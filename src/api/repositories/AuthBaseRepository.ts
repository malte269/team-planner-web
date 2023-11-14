import axios, { AxiosInstance } from 'axios';
import ApiError from '@/api/misc/ApiError';
import { Stores } from '@/store';
import { useNotification } from '@kyvg/vue3-notification';

/**
 * Base repository for auth repositories
 */
export default class AuthBaseRepository {
  protected axiosClient!: AxiosInstance;
  protected base: Stores = 'auth';
  private baseURL: string = import.meta.env.VITE_APP_BASE_URL!;

  constructor() {
    this.createHttpClient();
    this.setResponseInterceptors();
  }

  private createHttpClient() {
    this.axiosClient = axios.create({
      baseURL: `${ this.baseURL }${ this.base }`,
      headers: {
        'Content-Type': 'application/json',
        'client-type': 'web',
      },
      auth: {
        username: 'admin',
        password: 'admin',
      },
    });
  }

  /**
   * Intercept response. Normalizes the response and handles certain error cases
   */
  private setResponseInterceptors() {
    // normalize response
    this.axiosClient.interceptors.response.use(
      (response) => response.data,
      (error) => {
        console.log('On Error');
        if (error.response) {
          console.log(error, error.response);
          if (error.response.status >= 500) {
            useNotification().notify({
              title: 'Fehler',
              text: 'Ein Fehler ist aufgetreten',
            });
            return new Promise(() => {
              // cancels process of the interceptor chain
            });
          } else {
            throw new ApiError(error.response.status, error.message, error.response.data.data);
          }
        } else {
          useNotification().notify({
            title: 'Fehler',
            text: 'Der Server konnte nicht erreicht werden',
          });
          return new Promise(() => {
            // cancels process of the interceptor chain
          });
        }
      });
  }
}
