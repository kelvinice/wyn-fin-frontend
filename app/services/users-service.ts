import BaseService from "./base-service";
import type { User } from "~/components/auth/core/models";

export default class UsersService extends BaseService {
    /**
     * Get the currently authenticated user's profile
     */
    getMe = (): Promise<User> => {
        return this._axios.get("users/me")
            .then(response => response.data);
    }
    
    /**
     * Update user profile information
     */
    updateProfile = (data: Partial<User>): Promise<User> => {
        return this._axios.put("users/profile", data)
            .then(response => response.data);
    }
}