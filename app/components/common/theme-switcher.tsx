import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { motion } from "framer-motion";
import { useTheme } from "./theme-context";

export function ThemeSwitcher({ className = "" }: { className?: string }) {
  const { toggleTheme, theme } = useTheme();

  return (
    <motion.button
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className={`cursor-pointer relative p-2 rounded-full bg-base-200/50 hover:bg-base-300/60 transition-colors ${className}`}
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 0 : 180,
          opacity: theme === 'dark' ? 1 : 0,
          scale: theme === 'dark' ? 1 : 0.5,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <MoonIcon className="w-5 h-5 text-primary" />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'light' ? 0 : -180,
          opacity: theme === 'light' ? 1 : 0,
          scale: theme === 'light' ? 1 : 0.5,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <SunIcon className="w-5 h-5 text-yellow-500" />
      </motion.div>
      
      {/* Invisible element to maintain button size */}
      <div className="w-5 h-5 opacity-0">
        <SunIcon className="w-5 h-5" />
      </div>
    </motion.button>
  );
}