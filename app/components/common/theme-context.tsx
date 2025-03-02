import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useFetcher, useLoaderData } from 'react-router';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isLoading: boolean;
}

const THEME_KEY = 'default-theme';

// Safe storage wrapper
const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.warn('Local storage is not available:', error);
      return null;
    }
  },
  set: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Local storage is not available:', error);
    }
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, initialTheme = 'light' }: { 
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  // Use the theme from the loader data if available, otherwise use initialTheme
  const loaderData = useLoaderData<{ theme?: Theme }>();
  
  const [theme, setTheme] = useState<Theme>(() => {
    return loaderData?.theme || initialTheme;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const fetcher = useFetcher();
  
  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  const value = useMemo(() => ({
    theme,
    isLoading,
    toggleTheme: () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setIsLoading(true);
      
      // Update the theme immediately for UI responsiveness
      setTheme(newTheme);
      
      // Then persist the change in cookies server-side
      const formData = new FormData();
      formData.append('theme', newTheme);
      
      fetcher.submit(
        formData,
        { method: 'post', action: '/api/set-theme' }
      );
    }
  }), [theme, isLoading, fetcher]);

  // When the fetch action completes
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      setIsLoading(false);
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}