import { Link } from "react-router";
import { useEffect, useState, useRef } from "react";
import { 
  ArrowLeftIcon, 
  ArrowRightOnRectangleIcon, 
  UserIcon, 
  RectangleGroupIcon 
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Logo } from "~/components/common/logo";
import { ThemeSwitcher } from "~/components/common/theme-switcher";
import { useIsAuthenticated, useSignOut } from "~/components/auth/components/auth-provider";
import { useToast } from "~/components/common/toast-context";

interface HeaderProps {
  homePage?: boolean;
}

export function Header({ homePage = false }: HeaderProps) {
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const { showToast } = useToast();
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Use classic scroll listener for class toggling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== hasScrolled) {
        setHasScrolled(isScrolled);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);
  
  // Determine text color class based on scroll state
  const textColorClass = hasScrolled ? 'text-base-content' : 'text-primary-content';
  
  const handleSignOut = () => {
    signOut();
    showToast("You have been signed out successfully", "info");
  };
  
  return (
    <header className="sticky top-0 w-full z-50">
      <div 
        className={`
          absolute inset-0 backdrop-blur-xl transition-all duration-300
          ${hasScrolled ? 'bg-base-100/95 shadow-sm' : 'bg-transparent'}
        `}
      />
      
      <div className="container mx-auto px-6 relative z-10 h-16 flex items-center">
        <div className="flex justify-between items-center w-full">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {homePage ? (
              <>
                <div className={`transition-colors duration-300 ${hasScrolled ? 'text-primary' : textColorClass}`}>
                  <Logo className="w-8 h-8" />
                </div>
                <span className={`font-bold text-xl transition-colors duration-300 ${textColorClass}`}>
                WinFin
                </span>
              </>
            ) : (
              <Link to="/" className="absolute top-4 left-4 z-50 btn btn-sm gap-2 group hover:text-primary">
                <ArrowLeftIcon className="w-4 h-4 group-hover:transform group-hover:-translate-x-0.5" />
                Back to Home
              </Link>
            )}
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <ThemeSwitcher />
            
            {isAuthenticated ? (
              <div className="flex gap-2">
                <Link 
                  to="/dashboard" 
                  className="btn btn-sm btn-accent transition-all duration-300 gap-2"
                >
                  <RectangleGroupIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                
                <button 
                  onClick={handleSignOut}
                  className="btn btn-sm btn-error gap-2 transition-all duration-300"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/auth/login" 
                className="btn btn-sm gap-2 hover:bg-base-200/60 hover:text-primary transition-all duration-300"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </header>
  );
}