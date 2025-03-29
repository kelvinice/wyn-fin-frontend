import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useFetcher } from 'react-router';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isLoading: boolean;
}

const THEME_KEY = 'default-theme';

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

export function ThemeProvider({ 
  children, 
  initialTheme = 'light' 
}: { 
  children: React.ReactNode,
  initialTheme?: Theme 
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (initialTheme) return initialTheme;
    
    if (typeof window !== 'undefined') {
      const storedTheme = storage.get(THEME_KEY);
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme as Theme;
      }
    }
    return 'light';
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetcher = useFetcher();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    storage.set(THEME_KEY, theme); // Keep localStorage as fallback
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    isLoading,
    toggleTheme: () => {
      try {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setIsLoading(true);
        setError(null);
        setTheme(newTheme);
        const formData = new FormData();
        formData.append('theme', newTheme);
        
        fetcher.submit(
          formData,
          { method: 'post', action: '/api/set-theme' }
        );
      } catch (err) {
        console.error("Error toggling theme:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setIsLoading(false);
      }
    }
  }), [theme, isLoading, fetcher]);

  useEffect(() => {
    if (fetcher.state === 'idle') {
      setIsLoading(false);
      
      if (fetcher.data && fetcher.data.success === false) {
        console.error('Theme cookie set error:', fetcher.data.message);
        setError(fetcher.data.message || "Failed to save theme preference");
      }
    }
  }, [fetcher.state, fetcher.data]);

  useEffect(() => {
    if (error) {
      console.error("Theme context error:", error);
    }
  }, [error]);

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