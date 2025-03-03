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
  const [progress, setProgress] = useState(100);
  
  const timerRef = useRef<{interval: NodeJS.Timeout | null}>({ interval: null });
  
  useEffect(() => {
    console.log(`Toast ${id} initialized with duration ${duration}ms`);
    
    if (timerRef.current.interval) {
      clearInterval(timerRef.current.interval);
    }
    
    if (show && duration > 0) {
      const startTime = Date.now();
      const endTime = startTime + duration;
      
      timerRef.current.interval = setInterval(() => {
        const now = Date.now();
        const remaining = endTime - now;
        const newProgress = Math.max(0, (remaining / duration) * 100);
        
        setProgress(newProgress);
        
        if (now >= endTime) {
          if (timerRef.current.interval) {
            clearInterval(timerRef.current.interval);
            timerRef.current.interval = null;
          }
          setIsVisible(false);
          setTimeout(() => {
            if (onClose) onClose();
          }, 300);
        }
      }, 16);
    }
    
    return () => {
      if (timerRef.current.interval) {
        clearInterval(timerRef.current.interval);
      }
    };
  }, [id]);
  
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
          <div 
            className={`absolute bottom-0 left-0 h-0.5 ${getProgressColor()} opacity-80 dark:opacity-60`}
            style={{ 
              width: `${progress}%`,
              transition: "width 100ms linear"
            }}
          />
        )}
      </div>
    </motion.div>
  );
}