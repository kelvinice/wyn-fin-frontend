import { useTheme } from "../core/theme-context";

export function Logo() {
  const { theme } = useTheme();
  
  return (
    <img
      src={theme === 'dark' ? '/logo-dark.png' : '/logo.png'}
      alt="Logo"
      className="h-8 w-auto"
    />
  );
}