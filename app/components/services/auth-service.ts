import BaseService from "./base-service";
import type { AxiosResponse, EndpointCallResponse, EndpointCallResponseMessage } from "../core/_models";
import type { AuthResponse, RegisterFormData, SignInFormData } from "../auth/core/models";

export default class AuthService extends BaseService {
    login = (data: SignInFormData) => {
        return this._axios.post("auth/login", data);
    }

    me = () => {
        return this._axios.get("auth/me");
    }

    register = (data: RegisterFormData): Promise<EndpointCallResponse> => {
        return this._axios.post("auth/register", data);
    }
}