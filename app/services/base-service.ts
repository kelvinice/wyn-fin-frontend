import axios from 'axios';
import { type AxiosInstance } from 'axios';

export default class BaseService {
    protected _axios: AxiosInstance;

    constructor() {
        this._axios = axios.create({
            baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/',
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true, // This ensures cookies are sent automatically
        });

        // Add request interceptor to include auth token from localStorage as fallback
        this._axios.interceptors.request.use(
            (config) => {
                // The primary auth method is cookies (withCredentials: true)
                // But we'll also include the token in the Authorization header as a fallback
                // for APIs that may expect it there
                const token = localStorage.getItem('auth_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    // Static method to create pre-configured instance with token
    static createWithToken(token: string): BaseService {
        const service = new BaseService();
        
        // Override Authorization header with the provided token
        service._axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        
        return service;
    }
}