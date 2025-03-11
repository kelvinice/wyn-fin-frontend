import { useAuthCookie } from '~/components/auth/components/auth-cookie-context';
import BaseService from '~/services/base-service';

// Generic function to create service with auth token from cookie
export function useAuthService<T extends BaseService>(
  ServiceClass: new (token?: string | null) => T
): { service: T; isLoading: boolean } {
  const { authToken, isLoading } = useAuthCookie();
  
  // Create service with the auth token from cookies
  const service = new ServiceClass(authToken);
  
  return { service, isLoading };
}

// Specific service hooks
export function useAuthenticatedAuthService() {
  return useAuthService(require('~/services/auth-service').default);
}

export function useAuthenticatedUsersService() {
  return useAuthService(require('~/services/users-service').default);
}

// Add more service hooks as needed