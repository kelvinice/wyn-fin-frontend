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
        });

        // Add auth token to requests if available
        this._axios.interceptors.request.use(
            (config) => {
                // Safe access for SSR
                if (typeof window !== 'undefined') {
                    const token = localStorage.getItem('auth_token');
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }
}