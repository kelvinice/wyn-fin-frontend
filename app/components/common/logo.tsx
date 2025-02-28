import { useTheme } from "./theme-context";

interface Props {
  className?: string;
}

export function Logo({ className = "" }: Props) {
  const { theme } = useTheme();
  
  return (
    <img
      src={theme === 'dark' ? '/logo-dark.png' : '/logo.png'}
      alt="Logo"
      className={className}
    />
  );
}