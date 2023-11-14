import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Stores } from '@/store';
import { parseQueryObject } from '@/helper/ApiCalls';
import { AuthResponse, FindAllResponse, QueryObject } from '@/interfaces/Request';
import { AuthActions, AuthMutations, useAuthStore } from '@/stores/auth.store';
import { useNotification } from '@kyvg/vue3-notification';
import ApiError from '@/api/misc/ApiError';
import { Views } from '@/views';
import router from '@/router';
import { DateTime } from 'luxon';

export default abstract class EntityBaseRepository<Entity> {
  protected axiosClient!: AxiosInstance;
  protected abstract base: Stores;
  private baseURL: string = import.meta.env.VITE_APP_BASE_URL!;
  private authStore = useAuthStore();

  constructor() {
    this.createHttpClient();
    this.setResponseInterceptors();
  }

  public findAll(whereBody: QueryObject<Entity> = {}): Promise<FindAllResponse<Entity>> {
    return this.axiosClient.get(`${ this.base }?${ parseQueryObject(whereBody) }`);
  }

  public findOne(id: string): Promise<Entity> {
    return this.axiosClient.get(`${ this.base }/${ id }`);
  }

  public create(body: Entity): Promise<Entity> {
    return this.axiosClient.post(`${ this.base }`, body);
  }

  public update(id: string, payload: Partial<Entity>): Promise<Entity> {
    const body = { ...payload };
    Object.keys(body).forEach((key) => {
      if (['startDateSoft', 'startDateHard', 'endDateSoft', 'endDateHard'].includes(key)) {
        body[key] = (body[key] as DateTime)?.plus({ hour: 12 }).toJSDate();
      }
    });
    return this.axiosClient.patch(`${ this.base }/${ id }`, body);
  }

  public delete(id: string): Promise<void> {
    return this.axiosClient.delete(`${ this.base }/${ id }`);
  }

  public setAuthStore(store: any) {
    if (!this.authStore) {
      this.authStore = store;
    }
  }

  private createHttpClient() {
    this.axiosClient = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'client-type': 'web',
      },
    });
  }

  private setResponseInterceptors() {
    // -- set token for each request
    this.axiosClient.interceptors.request.use((config) => {
      if (this.authStore.getters.token) {
        config.headers.authorization = `Bearer ${ this.authStore.getters.token }`;
      }
      return config;
    }, (error) => {
      throw Promise.reject(error);
    });

    // -- normalize response
    this.axiosClient.interceptors.response.use(
      async (response) => this.onResponseFulfilled(response),
      async (error) => await this.onResponseRejected(error));
  }

  private onResponseFulfilled(response: AxiosResponse): any {
    // Check if we have content-disposition in headers, if so save the name
    if ('content-disposition' in response.headers) {
      // Modify our response object to include our content-disposition header and our blob
      response.data = {
        'blob': new Blob([response.data], { type: response.data.type }),
        'content-disposition': response.headers['content-disposition'],
      };
    }

    return response.data;
  }

  private async onResponseRejected(error: AxiosError<any, any>): Promise<any> {
    // Check if Response was canceled. Without === true type of error would be never...
    if (axios.isCancel(error) === true) {
      // cancels process of the interceptor chain
      // tslint:disable-next-line:no-empty
      return new Promise(() => {
      });
    }
    // No Response show network error message
    console.log(error.message);
    if (!error.response) {
      useNotification().notify({
        title: 'Network Error',
        text: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut',
        type: 'error',
      });

      // cancels processing of the interceptor chain
      // tslint:disable-next-line:no-empty
      return new Promise(() => {
      });
    }

    // check for "special" errors that need special treatment
    if (error.response.status < 500 && error.response.status !== 401) {
      throw new ApiError(error.response.status, error.message, error.response.data.data);
    }

    // Switch all response status
    switch (error.response.status) {
      case 401: // handle invalid (or expired) token ...
        // Get current Refreshing Status from Auth Store
        const isRefreshingToken = this.authStore.getters.isRefreshing;

        // Check if token is being refreshed
        // if true, return promise which will be resolved later
        if (isRefreshingToken) {
          return new Promise((resolve, reject) => {
            // Push to failed request Queue in Store
            this.authStore.commit(AuthMutations.PUSH_FAILED_REQUEST, { resolve, reject });
          }).then(async (token) => {
            // Set new Token as header
            error.config!.headers.Authorization = 'Bearer ' + token;

            // Wait for Request to finish and return data
            const request = await axios.request(error.config!);
            return request.data;
          }).catch((err) => {
            return Promise.reject(err);
          });
        }

        // Set Is Refreshing to true
        this.authStore.commit(AuthMutations.SET_IS_REFRESHING, true);

        // Return a Promise, which bill be resolved later
        // When the Data for the Token Refresh is available
        // And being called for
        return new Promise(async (resolve, reject) => {
          try {
            // Get current Refresh Token from Store
            const refreshToken = this.authStore.getters.refreshToken;

            // Dispatch a new RefreshToken Call
            const refreshData: AuthResponse = await this.authStore.dispatch(AuthActions.REFRESH_TOKEN, refreshToken);

            // Add new Auth Token to Headers
            error.config!.headers.Authorization = 'Bearer ' + refreshData.access_token;

            // Process old Requests with new Token
            this.processQueue(null, refreshData.access_token);

            // Wait for old Request to finish
            const request = await axios.request(error.config!);

            // Set Refreshing to false
            this.authStore.commit(AuthMutations.SET_IS_REFRESHING, false);

            // Resolve Promise with Data
            resolve(request.data);
          } catch (e) {
            // Set Refreshing to false
            this.authStore.commit(AuthMutations.SET_IS_REFRESHING, false);

            // Process Failed Queue with error and no token
            this.processQueue(e);

            // Navigate to Login and reject this promise
            return await this.onTokenGenerationFailed(reject(e));
          }
        });
      default: // 500 > any server error
        useNotification().notify({
          title: 'Fehler',
          text: 'Es ist ein Fehler aufgetreten',
          type: 'error',
        });
    }

    // cancels process of the interceptor chain
    // tslint:disable-next-line:no-empty
    return new Promise(() => {
    });
  }

  /**
   * If no Refreshed Token was received by the API
   * clear Token Data and go to login
   * @private
   */
  private async onTokenGenerationFailed(reject: any) {
    this.authStore.commit(AuthMutations.CLEAR_LOGIN);
    await router.push({ name: Views.LOGIN });
    return (reject && reject()) ?? reject;
  }

  /**
   * Resolves Failed Promises by using a new generated token
   * rejects them if an error occurred
   * @param error API-Error Object
   * @param token Token which has been received
   * @private
   */
  private processQueue(error: any, token: string | null = null) {
    // Get current failed queue list
    const failedQueue: Array<{ reject: any; resolve: any }> = this.authStore.getters.failedQueue;

    // Go through all Failed promises and resolve them
    for (const failedPromise of failedQueue) {
      // If error occured reject this promise
      if (error) {
        failedPromise.reject(error);
        continue;
      }

      // Else resolve with token
      failedPromise.resolve(token);
    }

    // Clear Failed Queue
    this.authStore.commit(AuthMutations.CLEAR_FAILED_QUEUE);
  }
}
