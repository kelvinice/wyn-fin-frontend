import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate, useFetcher } from 'react-router';
import type { User } from '../core/models';

// Define the structure of our auth context
type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (token: string, user: User, expiresIn: number, refreshToken?: string) => Promise<void>; // Update the signIn type
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
    
    // Use the get-session API instead of localStorage
    const loadAuthState = async () => {
      try {
        const response = await fetch('/api/auth/get-session');
        const data = await response.json();
        
        if (data.token && data.userData) {
          setToken(data.token);
          setUser(data.userData);
        }
      } catch (error) {
        console.error('Failed to load auth session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAuthState();
  }, [initialAuthState.isAuthenticated]);

  // Sign in function
  const signIn = (authToken: string, userData: User, expiresIn: number, refreshToken?: string): Promise<void> => {
    setToken(authToken);
    setUser(userData);
    
    // Store auth data in cookies via server action and return the promise
    const formData = new FormData();
    formData.append('token', authToken);
    formData.append('userData', JSON.stringify(userData));
    formData.append('expiresIn', expiresIn.toString());
    if (refreshToken) {
      formData.append('refreshToken', refreshToken);
    }
    
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
    
    fetcher.submit(null, {
      method: 'post',
      action: '/api/auth/clear-session'
    });
  };
  
  // Check for token expiration
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkTokenExpiration = async () => {
      try {
        const response = await fetch('/api/auth/get-session');
        const data = await response.json();
        
        if (data.expiration && token) {
          const expirationTime = new Date(data.expiration).getTime();
          const currentTime = new Date().getTime();
          
          if (currentTime > expirationTime) {
            console.log('Token expired, logging out');
            signOut();
          }
        }
      } catch (error) {
        console.error('Failed to check token expiration:', error);
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
  return (data: {token: string, user: User, expiresIn: number, refreshToken?: string}) => {
    return signIn(data.token, data.user, data.expiresIn, data.refreshToken);
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

// Add the useRefreshToken hook
export const useRefreshToken = () => {
  const { user, signIn } = useAuth();
  
  return async (): Promise<boolean> => {
    if (!user) {
      console.error('No user found');
      return false;
    }
    
    try {
      // The refresh token is stored in an HTTP-only cookie,
      // so we don't need to send it explicitly in the request body
      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const result = await response.json();
      
      if (!result.success || !result.data) {
        console.error('Token refresh failed:', result.message);
        return false;
      }
      
      const { token, user: userData, expiresIn } = result.data;
      
      // Update auth state with new token
      await signIn(token, userData, expiresIn);
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  };
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