import type { RegisterFormData, SignInFormData, AuthResponse } from "~/components/auth/core/models";
import BaseService from "./base-service";
import type { EndpointCallResponse } from "~/components/core/_models";

export default class AuthService extends BaseService {
    login = (data: SignInFormData): Promise<AuthResponse> => {
        return this._axios.post("auth/login", data)
            .then(response => {
                // Map the API response to match our AuthResponse type
                const result = response.data;
                return {
                    token: result.accessToken,
                    refreshToken: result.refreshToken,
                    user: result.user,
                    expiresIn: result.expiresIn
                };
            });
    }

    me = () => {
        return this._axios.get("auth/me");
    }

    register = (data: RegisterFormData): Promise<EndpointCallResponse> => {
        return this._axios.post("auth/register", data);
    }
    
    refreshToken = (refreshToken: string): Promise<AuthResponse> => {
        return this._axios.post("auth/refresh", { refreshToken })
            .then(response => {
                const result = response.data;
                return {
                    token: result.accessToken,
                    refreshToken: result.refreshToken,
                    user: result.user,
                    expiresIn: result.expiresIn
                };
            });
    }
}