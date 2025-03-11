import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFetcher } from 'react-router';

interface AuthCookieContextType {
  authToken: string | null;
  isLoading: boolean;
  hasCheckedCookies: boolean;
}

// Create context with default values
const AuthCookieContext = createContext<AuthCookieContextType>({
  authToken: null,
  isLoading: true,
  hasCheckedCookies: false
});

export function AuthCookieProvider({ children }: { children: React.ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedCookies, setHasCheckedCookies] = useState(false);
  const fetcher = useFetcher();

  useEffect(() => {
    // Check for auth cookies on first render
    fetcher.submit(null, {
      method: 'get',
      action: '/api/auth/get-session'
    });
  }, []);

  useEffect(() => {
    if (fetcher.data && fetcher.state === 'idle') {
      const { token } = fetcher.data;
      setAuthToken(token || null);
      setIsLoading(false);
      setHasCheckedCookies(true);
    }
  }, [fetcher.data, fetcher.state]);

  const contextValue = {
    authToken,
    isLoading,
    hasCheckedCookies
  };

  return (
    <AuthCookieContext.Provider value={contextValue}>
      {children}
    </AuthCookieContext.Provider>
  );
}

export function useAuthCookie() {
  const context = useContext(AuthCookieContext);
  if (!context) {
    throw new Error('useAuthCookie must be used within an AuthCookieProvider');
  }
  return context;
}