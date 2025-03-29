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
   * Get current user information using either token in header or cookie
   * @returns Promise with the user data and token status
   */
  getMe = async (): Promise<{user: any, tokenStatus: string, authMethod: string}> => {
    try {
      const response = await this._axios.get("auth/me");
      
      // Detect authentication method
      const authMethod = response.headers['x-auth-method'] || 
                         (this._axios.defaults.headers.common.Authorization ? 'token' : 'cookie');
      
      return {
        user: response.data,
        tokenStatus: 'valid',
        authMethod
      };
    } catch (error: any) {
      // If we get a 401 status, the token is likely expired
      if (error.response?.status === 401) {
        return {
          user: null,
          tokenStatus: 'expired',
          authMethod: 'none'
        };
      }
      
      // For any other error, rethrow
      throw error;
    }
  }
}