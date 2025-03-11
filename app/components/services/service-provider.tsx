import React, { createContext, useContext, useMemo } from 'react';
import { useAuthToken } from '~/components/auth/components/auth-provider';
import { useAuthCookie } from '~/components/auth/components/auth-cookie-context';
import BaseService from '~/services/base-service';

// Service factory context
type ServiceFactoryContextType = {
  createService: <T extends BaseService>(ServiceClass: new (token?: string | null) => T) => T;
};

const ServiceFactoryContext = createContext<ServiceFactoryContextType | undefined>(undefined);

// Provider component that makes service factory available
export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const authToken = useAuthToken();
  const { authToken: cookieToken } = useAuthCookie();
  
  // Prefer the auth token from context, fall back to cookie token
  const token = authToken || cookieToken;

  // Create the service factory
  const serviceFactory = useMemo(() => {
    return {
      createService: <T extends BaseService>(ServiceClass: new (token?: string | null) => T): T => {
        return new ServiceClass(token);
      }
    };
  }, [token]);

  return (
    <ServiceFactoryContext.Provider value={serviceFactory}>
      {children}
    </ServiceFactoryContext.Provider>
  );
}

// Hook for consuming components to get the service factory
export function useServiceFactory() {
  const context = useContext(ServiceFactoryContext);
  if (!context) {
    throw new Error('useServiceFactory must be used within a ServiceProvider');
  }
  return context;
}

// Typed service hooks - automatically inject the token
export function useService<T extends BaseService>(
  ServiceClass: new (token?: string | null) => T
): T {
  const { createService } = useServiceFactory();
  return createService(ServiceClass);
}