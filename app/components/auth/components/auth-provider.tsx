import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate, useFetcher } from 'react-router';
import type { User } from '../core/models';

// Define initial auth state type
type InitialAuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
};

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

// Define the auth provider component
export const AuthProvider = ({ 
  children, 
  initialAuthState = { user: null, token: null, isAuthenticated: false }
}: { 
  children: React.ReactNode, 
  initialAuthState?: InitialAuthState 
}) => {
  const [user, setUser] = useState<User | null>(initialAuthState.user);
  const [token, setToken] = useState<string | null>(initialAuthState.token);
  const [loading, setLoading] = useState(!initialAuthState.isAuthenticated);
  const fetcher = useFetcher();
  
  // Initial state is now set entirely from server-provided cookies
  // No need to load from localStorage
  useEffect(() => {
    // We already have auth data from the server via initialAuthState
    setLoading(false);
    console.log("Auth Provider initialized with:", {
      hasUser: !!initialAuthState.user,
      hasToken: !!initialAuthState.token,
      isAuthenticated: initialAuthState.isAuthenticated
    });
  }, [initialAuthState.isAuthenticated, initialAuthState.user, initialAuthState.token]);

  // Sign in function
  const signIn = (authToken: string, userData: User, expiresIn: number) => {
    console.log("Signing in with token and user data");
    console.log("Setting cookies for authentication:", {
      token: authToken?.substring(0, 10) + "...",
      hasUserData: !!userData,
      expiresIn
    });
    setToken(authToken);
    setUser(userData);
    
    // Send to server to set auth cookies
    const formData = new FormData();
    formData.append('token', authToken);
    formData.append('userData', JSON.stringify(userData));
    formData.append('expiresIn', expiresIn.toString());
    
    fetcher.submit(formData, { 
      method: 'post', 
      action: '/api/auth/set-session'
    });
  };
  
  // Sign out function
  const signOut = () => {
    setToken(null);
    setUser(null);
    
    // Clear cookies via server action
    fetcher.submit(null, {
      method: 'post',
      action: '/api/auth/clear-session'
    });
  };
  
  // The check for token expiration is now handled server-side by the cookie expiry
  // No need for client-side checking
  
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
  // Change this to handle the object parameter
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
  return async ({ request }: { request: Request }) => {
    // We no longer need to check localStorage
    // All authentication checks are done via cookies
    // on the server when the request is processed
    return null;
  };
};