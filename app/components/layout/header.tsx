import { Link } from "react-router";
import { useEffect, useState, useRef } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Logo } from "~/components/common/logo";
import { ThemeSwitcher } from "~/components/common/theme-switcher";
import { useIsAuthenticated } from "~/components/auth/components/auth-provider";

interface HeaderProps {
  homePage?: boolean;
}

export function Header({ homePage = false }: HeaderProps) {
  const isAuthenticated = useIsAuthenticated();
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
  
  return (
    <header className="sticky top-0 w-full z-50">
      {/* Background with backdrop blur */}
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
                  WynFin
                </span>
              </>
            ) : (
              <Link 
                to="/" 
                className={`btn btn-sm btn-outline flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 
                  ${textColorClass} 
                  hover:bg-base-200/60 hover:text-primary group
                `}
              >
                <ArrowLeftIcon className="w-4 h-4 group-hover:transform group-hover:-translate-x-0.5" />
                <span className="font-sm">Back to Home</span>
              </Link>
            )}
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <ThemeSwitcher />
            {isAuthenticated ? (
              <Link 
                to="/dashboard" 
                className="btn btn-sm btn-accent shadow-sm hover:shadow-md transition-all duration-300"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                to="/auth/login" 
                className={`btn btn-sm ${!hasScrolled ? 'btn-outline text-primary-content' : 'btn-outline'} transition-all duration-300`}
              >
                Sign In
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </header>
  );
}