import { useAuthToken } from '~/components/auth/components/auth-provider';
import BaseService from '~/services/base-service';
import UsersService from '~/services/users-service';
import AuthService from '~/services/auth-service';

// Generic function to create an authenticated service
export function useAuthenticatedService<T extends BaseService>(
  ServiceClass: new () => T
): T {
  const token = useAuthToken();
  
  // Create a new instance of the service
  const service = new ServiceClass();
  
  // If we have a token, set it in the service's axios instance
  if (token) {
    service['_axios'].defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  
  return service;
}

// Specific hooks for each service type
export function useUsersService() {
  return useAuthenticatedService(UsersService);
}

export function useAuthService() {
  return useAuthenticatedService(AuthService);
}

// Add more specific hooks as needed