import type { RegisterFormData, SignInFormData, AuthResponse } from "~/components/auth/core/models";
import BaseService from "./base-service";
import type { EndpointCallResponse } from "~/components/core/_models";

export default class AuthService extends BaseService {
    login = (data: SignInFormData): Promise<AuthResponse> => {
        return this._axios.post("auth/login", data)
            .then(response => response.data);
    }

    me = () => {
        return this._axios.get("auth/me");
    }

    register = (data: RegisterFormData): Promise<EndpointCallResponse> => {
        return this._axios.post("auth/register", data);
    }
    
    refreshToken = (refreshToken: string): Promise<AuthResponse> => {
        return this._axios.post("auth/refresh-token", { refreshToken })
            .then(response => response.data);
    }
}