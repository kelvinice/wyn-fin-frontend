import React, { createContext, useContext, useMemo } from 'react';
import { useAuthToken } from '~/components/auth/components/auth-provider';
import { useAuthCookie } from '~/components/auth/components/auth-cookie-context';
import BaseService from '~/services/base-service';
import TestService from '~/services/test-service';
import PeriodService from '~/services/period-service';

// Service factory context
type ServiceFactoryContextType = {
  createService: <T extends BaseService>(ServiceClass: new (token?: string | null) => T) => T;
  testService: TestService;
  periodService: PeriodService;
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
      },
      testService: new TestService(token),
      periodService: new PeriodService(token),
    };
  }, [token]);

  return (
    <ServiceFactoryContext.Provider value={serviceFactory}>
      {children}
    </ServiceFactoryContext.Provider>
  );
}

export function useServiceFactory() {
  const context = useContext(ServiceFactoryContext);
  if (!context) {
    throw new Error('useServiceFactory must be used within a ServiceProvider');
  }
  return context;
}

export function useService<T extends BaseService>(
  ServiceClass: new (token?: string | null) => T
): T {
  const { createService } = useServiceFactory();
  return createService(ServiceClass);
}

export function useTestService() {
  const context = useContext(ServiceFactoryContext);
  if (!context) throw new Error('useTestService must be used within a ServiceProvider');
  return context.testService;
}

export function usePeriodServiceContext() {
  const context = useContext(ServiceFactoryContext);
  if (!context) throw new Error('usePeriodServiceContext must be used within a ServiceProvider');
  return context.periodService;
}