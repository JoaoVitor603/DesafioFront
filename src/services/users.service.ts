import HttpClient from './httpClient';
import { IUser } from '../interfaces';
import { IUserResponse } from '../interfaces/IUserResponse';

interface LoginResponse {
  token: string;
  user: IUserResponse;
}

class UsersService {
  static async signIn(cpf: string, password: string): Promise<LoginResponse> {
    const { data } = await HttpClient.api.post('/sessions', { cpf, password });

    return data;
  }

  static async allUsers(): Promise<IUser[]> {
    const { data } = await HttpClient.api.get<[]>('/users');
    return data;
  }

  static async user(id: string): Promise<IUser> {
    const { data } = await HttpClient.api.get(`/users/${id}`);
    return data;
  }

  static async create(
    token: string,
    name: string,
    cpf: string,
    password: string,
    birthdate: string,
    admin: boolean,
    observation?: string
  ): Promise<void> {
    HttpClient.api.defaults.headers.common.Authorization = `Bearer ${token}`;
    const obj = {
      name,
      cpf,
      birthdate,
      password,
      admin,
      observation,
    };

    const { data } = await HttpClient.api.post('/users/', obj);
    return data;
  }

  static async update(token: string, id: string, observation?: string, admin?: boolean): Promise<void> {
    HttpClient.api.defaults.headers.common.Authorization = `Bearer ${token}`;
    const obj = {
      observation,
      admin,
    };

    const { data } = await HttpClient.api.put(`/users/${id}`, obj);
    return data;
  }

  static async delete(id: string, token: string): Promise<string> {
    HttpClient.api.defaults.headers.common.Authorization = `Bearer ${token}`;
    const { statusText } = await HttpClient.api.delete(`/users/${id}`);
    return statusText;
  }
}

export default UsersService;
