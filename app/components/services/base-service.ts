import axios, { type AxiosInstance } from "axios";

export default abstract class BaseService {
    protected _axios: AxiosInstance;
    constructor(token?: string) {
        let headers = {};
        if(token) {
            headers = {...headers, 'Authorization': `Bearer ${token}`}
        }

        this._axios = axios.create({
            baseURL: `${import.meta.env.VITE_BACKEND_URL}api/`,
            timeout: 10000,
            headers: headers
        });
    }

    protected setMultipartFormDataHeaders() {
        this._axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
    }

}