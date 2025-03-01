import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import type { User } from '../core/models';
import AuthService from "~/services/auth-service";

// Define the structure of our auth context
type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (token: string, user: User, expiresIn: number) => void;
  signOut: () => void;
};

// Create a context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  signIn: () => {},
  signOut: () => {},
});

// Safe client-side storage access to handle SSR
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
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load saved auth data on first render (client-side only)
  useEffect(() => {
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
  }, []);

  // Sign in function
  const signIn = (authToken: string, userData: User, expiresIn: number) => {
    setToken(authToken);
    setUser(userData);
    
    // Store in localStorage
    storage.set('auth_token', authToken);
    storage.set('auth_user', JSON.stringify(userData));
    
    // Set token expiration
    if (expiresIn) {
      const expirationTime = new Date().getTime() + expiresIn * 1000;
      storage.set('auth_expires', expirationTime.toString());
    }
  };
  
  // Sign out function
  const signOut = () => {
    setToken(null);
    setUser(null);
    
    // Clear localStorage
    storage.remove('auth_token');
    storage.remove('auth_user');
    storage.remove('auth_expires');
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
  
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, signIn, signOut }}>
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
  // This works with React Router's loader API
  return () => {
    // We can't directly access context in a loader function
    // So we check localStorage directly
    if (typeof window !== 'undefined') {
      const hasToken = !!storage.get('auth_token');
      const hasUser = !!storage.get('auth_user');
      
      if (!hasToken || !hasUser) {
        // Return redirect instruction for React Router
        return { redirect: redirectTo };
      }
    }
    
    // Continue to the protected route
    return null;
  };
};