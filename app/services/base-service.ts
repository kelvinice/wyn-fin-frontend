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
            withCredentials: true, // This is critical for cookies
        });

        // Add request interceptor for debugging
        this._axios.interceptors.request.use(
            config => {
                console.log('Request headers:', config.headers);
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor for debugging
        this._axios.interceptors.response.use(
            response => {
                console.log('Response cookies:', document.cookie);
                return response;
            },
            error => {
                console.error('API error:', error);
                return Promise.reject(error);
            }
        );
    }
}