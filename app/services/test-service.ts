import BaseService from "./base-service";

export default class TestService extends BaseService {
  /**
   * Simple ping test to check API connectivity
   * @returns Promise with the response data
   */
  ping = (): Promise<{message: string}> => {
    return this._axios.get("ping")
      .then(response => response.data);
  }

  /**
   * Get current user information
   * @returns Promise with the user data and token status
   */
  getMe = async (): Promise<{user: any, tokenStatus: string}> => {
    try {
      const response = await this._axios.get("auth/me");
      
      // The API returns the user object directly
      return {
        user: response.data,
        // Assume token is valid if we got a successful response
        tokenStatus: 'valid'
      };
    } catch (error: any) {
      // If we get a 401 status, the token is likely expired
      if (error.response?.status === 401) {
        return {
          user: null,
          tokenStatus: 'expired'
        };
      }
      
      // For any other error, rethrow
      throw error;
    }
  }
}