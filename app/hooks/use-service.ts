import { useAuthToken } from '~/components/auth/components/auth-provider';
import BaseService from '~/services/base-service';
import UsersService from '~/services/users-service';
import AuthService from '~/services/auth-service';
import TestService from '~/services/test-service';
import { useService } from '~/components/services/service-provider';

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

// Typed hooks for specific services
export function useAuthService() {
  return useService(AuthService);
}

export function useUsersService() {
  return useService(UsersService);
}

export function useTestService() {
  return useService(TestService);
}

// Add more specific service hooks as needed