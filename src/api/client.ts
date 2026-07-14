import axios, { type InternalAxiosRequestConfig } from 'axios';
import store from '../store/store';

const client = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// 요청 인터셉터: Authorization 헤더에 토큰 추가
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export class ApiError extends Error {
  errorCode: string;

  constructor(errorCode: string) {
    super();
    this.errorCode = errorCode;
  }
}

export default client;
