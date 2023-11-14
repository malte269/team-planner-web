import { AuthResponse, LoginBody } from '@/interfaces/Request';
import AuthBaseRepository from '@/api/repositories/AuthBaseRepository';

export default class AuthRepository extends AuthBaseRepository {

  public login(payload: LoginBody): Promise<AuthResponse> {
    return this.axiosClient.post(`login`, payload);
  }

  public refreshToken(token: string): Promise<AuthResponse> {
    return this.axiosClient.post(`refreshToken`, { refreshToken: token });
  }
}
