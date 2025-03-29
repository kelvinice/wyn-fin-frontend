import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate, useFetcher } from 'react-router';
import type { User } from '../core/models';

// Define the structure of our auth context
type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (token: string, user: User, expiresIn: number) => Promise<void>; // Update the signIn type
  signOut: () => void;
  getAuthToken: () => string | null; // Add this new method
};

// Create a context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  signIn: () => Promise.resolve(), // Update the default signIn
  signOut: () => {},
  getAuthToken: () => null,
});

// Safe client-side storage access as fallback for SSR
const storage = {
  get: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Error accessing localStorage:', e);
      return null;
    }
  },
  set: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Error writing to localStorage:', e);
    }
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from localStorage:', e);
    }
  }
};

// Define the auth provider component
export const AuthProvider = ({ 
  children,
  initialAuthState = { user: null, token: null, isAuthenticated: false } 
}: { 
  children: React.ReactNode,
  initialAuthState?: {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
  }
}) => {
  const [user, setUser] = useState<User | null>(initialAuthState.user);
  const [token, setToken] = useState<string | null>(initialAuthState.token);
  const [loading, setLoading] = useState(!initialAuthState.isAuthenticated);
  const fetcher = useFetcher();

  // Load saved auth data on first render (client-side only) if not provided via SSR
  useEffect(() => {
    if (initialAuthState.isAuthenticated) {
      setLoading(false);
      return;
    }
    
    const savedToken = storage.get('auth_token');
    const savedUser = storage.get('auth_user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        // Clear invalid data
        storage.remove('auth_token');
        storage.remove('auth_user');
      }
    }
    
    setLoading(false);
  }, [initialAuthState.isAuthenticated]);

  // Sign in function
  const signIn = (authToken: string, userData: User, expiresIn: number): Promise<void> => {
    setToken(authToken);
    setUser(userData);
    
    // Store in localStorage as fallback
    storage.set('auth_token', authToken);
    storage.set('auth_user', JSON.stringify(userData));
    
    // Set token expiration locally
    if (expiresIn) {
      const expirationTime = new Date().getTime() + expiresIn * 1000;
      storage.set('auth_expires', expirationTime.toString());
    }
    
    // Store auth data in cookies via server action and return the promise
    const formData = new FormData();
    formData.append('token', authToken);
    formData.append('userData', JSON.stringify(userData));
    formData.append('expiresIn', expiresIn.toString());
    
    return new Promise((resolve, reject) => {
      fetcher.submit(formData, {
        method: 'post',
        action: '/api/auth/set-session'
      });
      
      const checkFetcher = () => {
        if (fetcher.state === 'idle') {
          if (fetcher.data?.success) {
            resolve();
          } else if (fetcher.data?.success === false) {
            reject(new Error(fetcher.data.message || 'Failed to set session'));
          } else {
            setTimeout(checkFetcher, 50); // Check again in a bit
          }
        } else {
          setTimeout(checkFetcher, 50); // Not done yet, check again
        }
      };
      
      checkFetcher();
    });
  };
  
  const signOut = () => {
    setToken(null);
    setUser(null);
    
    storage.remove('auth_token');
    storage.remove('auth_user');
    storage.remove('auth_expires');
    
    fetcher.submit(null, {
      method: 'post',
      action: '/api/auth/clear-session'
    });
  };
  
  // Check for token expiration
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkTokenExpiration = () => {
      const expiration = storage.get('auth_expires');
      if (expiration && token) {
        const expirationTime = parseInt(expiration, 10);
        const currentTime = new Date().getTime();
        
        if (currentTime > expirationTime) {
          console.log('Token expired, logging out');
          signOut();
        }
      }
    };
    
    // Check immediately
    checkTokenExpiration();
    
    // Then set up interval to check periodically
    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [token]);
  
  // Listen for token expiration events
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleTokenExpired = () => {
      console.log('Token expired event received');
      signOut();
    };
    
    window.addEventListener('auth:token-expired', handleTokenExpired);
    
    return () => {
      window.removeEventListener('auth:token-expired', handleTokenExpired);
    };
  }, []);

  const isAuthenticated = !!token && !!user;

  const getAuthToken = () => {
    return token;
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, signIn, signOut, getAuthToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook for components to get and use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper hooks for specific auth operations
export const useAuthUser = () => {
  const { user } = useAuth();
  return user; // Returns the user object directly
};

export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated; // Returns the boolean property
};

export const useSignIn = () => {
  const { signIn } = useAuth();
  return (data: {token: string, user: User, expiresIn: number}) => {
    return signIn(data.token, data.user, data.expiresIn);
  };
};

export const useSignOut = () => {
  const { signOut } = useAuth();
  return signOut; // Returns the function
};

export const useAuthToken = () => {
  const { getAuthToken } = useAuth();
  return getAuthToken();
};

// RequireAuth component for protected routes that works with SSR
export const RequireAuth = ({ children, fallbackPath = "/auth/login" }: { 
  children: React.ReactNode, 
  fallbackPath?: string 
}) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State to track if we've completed client-side hydration
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Effect that runs only on client side after hydration
  useEffect(() => {
    setIsHydrated(true);
    
    // Handle redirect on client side if not authenticated
    if (!isAuthenticated) {
      navigate(fallbackPath, { 
        state: { from: location.pathname },
        replace: true
      });
    }
  }, [isAuthenticated, location.pathname, navigate, fallbackPath]);

  // During SSR or before hydration, render children to avoid hydration mismatch
  if (!isHydrated) {
    return <>{children}</>;
  }
  
  // After hydration, only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

// Route loader function for React Router v7 data loading API
export const authLoader = (redirectTo = "/auth/login") => {
  return async ({ request }: { request: Request }) => {
    // For server-side rendering, we'll use cookies
    const cookieHeader = request.headers.get("Cookie");
    
    // Client-side fallback
    if (typeof window !== 'undefined') {
      const hasToken = !!storage.get('auth_token');
      const hasUser = !!storage.get('auth_user');
      
      if (!hasToken || !hasUser) {
        return { redirect: redirectTo };
      }
    }
    
    return null;
  };
};