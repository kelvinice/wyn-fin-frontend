import axios from 'axios';
import { type AxiosInstance } from 'axios';

export default class BaseService {
    protected _axios: AxiosInstance;

    constructor(token?: string | null) {
        const config = {
            baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api',
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        };

        this._axios = axios.create(config);

        if (token) {
            this._axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        }
        
        this._axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    console.warn('Authentication token expired or invalid');
                    
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('auth:token-expired'));
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    static createWithToken(token: string): BaseService {
        return new BaseService(token);
    }
}