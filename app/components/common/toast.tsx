import { Fragment, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: number;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  show: boolean;
}

export function Toast({ 
  id,
  message, 
  type = "success", 
  duration = 3000, 
  onClose, 
  show 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(show);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [progress, setProgress] = useState(100);
  
  const timerRef = useRef<{
    rafId: number | null,
    startTime: number | null,
    endTime: number | null
  }>({ 
    rafId: null, 
    startTime: null,
    endTime: null
  });
  
  useEffect(() => {
    if (timerRef.current.rafId) {
      cancelAnimationFrame(timerRef.current.rafId);
      timerRef.current.rafId = null;
    }
    
    if (show && duration > 0) {
      // Set initial state
      setProgress(100);
      
      // Use RAF for smoother animation
      const startTime = Date.now();
      const endTime = startTime + duration;
      
      timerRef.current.startTime = startTime;
      timerRef.current.endTime = endTime;
      
      // Small delay to ensure the component has rendered
      setTimeout(() => {
        setAnimationStarted(true);
        setProgress(0);
      }, 10);
      
      // Use timeout for the actual closing
      const closeTimeout = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          if (onClose) onClose();
        }, 300);
      }, duration);
      
      return () => {
        clearTimeout(closeTimeout);
      };
    }
    
    return () => {
      if (timerRef.current.rafId) {
        cancelAnimationFrame(timerRef.current.rafId);
      }
    };
  }, [id, show, duration, onClose]);
  
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="w-5 h-5 flex-shrink-0 text-success" />;
      case "error":
        return <XCircleIcon className="w-5 h-5 flex-shrink-0 text-error" />;
      case "warning":
        return <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0 text-warning" />;
      case "info":
        return <InformationCircleIcon className="w-5 h-5 flex-shrink-0 text-info" />;
    }
  };
  
  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-success/10 border-success/30";
      case "error":
        return "bg-error/10 border-error/30";
      case "warning":
        return "bg-warning/10 border-warning/30";
      case "info":
        return "bg-info/10 border-info/30";
    }
  };
  
  const getProgressColor = () => {
    switch (type) {
      case "success":
        return "bg-success";
      case "error":
        return "bg-error";
      case "warning":
        return "bg-warning";
      case "info":
        return "bg-info";
    }
  };
  
  return (
    <motion.div
      className="pointer-events-auto w-full max-w-sm"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20, scale: isVisible ? 1 : 0.95 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className={`alert shadow-lg ${getBgColor()} border w-full flex backdrop-blur-md relative overflow-hidden`}>
        <div className="flex items-start gap-3 w-full pr-2">
          <div className="pt-0.5">{getIcon()}</div>
          <span className="text-sm line-clamp-3 text-pretty">{message}</span>
        </div>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => {
              if (onClose) onClose();
            }, 300);
          }} 
          className="btn btn-ghost btn-xs btn-circle flex-shrink-0 self-start mt-0.5"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
        
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-base-300/20">
            <div 
              className={`h-full ${getProgressColor()} opacity-80 dark:opacity-60`}
              style={{ 
                width: animationStarted ? '0%' : '100%',
                transition: `width ${duration}ms linear`,
                transformOrigin: 'left'
              }}
              onTransitionEnd={() => {
                // Once the progress bar animation completes, start the close sequence
                setIsVisible(false);
                setTimeout(() => {
                  if (onClose) onClose();
                }, 300);
              }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}