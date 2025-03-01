import { Fragment, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  show: boolean;
}

export function Toast({ 
  message, 
  type = "success", 
  duration = 3000, 
  onClose, 
  show 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(show);
  
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          if (onClose) onClose();
        }, 300); // Wait for exit animation to complete
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);
  
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
  
  return (
    <motion.div
      className="pointer-events-auto w-full max-w-sm"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20, scale: isVisible ? 1 : 0.95 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className={`alert shadow-lg ${getBgColor()} border w-full flex backdrop-blur-md`}>
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
      </div>
    </motion.div>
  );
}