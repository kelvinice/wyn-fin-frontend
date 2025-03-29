import { createContext, useState, useContext } from "react";
import { ToastContainer } from "./toast-container";
import type { ToastType } from "./toast";

let toastIdCounter = 1;

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastContextProps {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextProps | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const MAX_TOASTS = 3;

  const showToast = (message: string, type: ToastType = 'success', duration: number = 3000) => {
    const newToast: ToastItem = {
      id: toastIdCounter++,
      message,
      type,
      duration,
    };
    
    setToasts(prev => {
      const updatedToasts = [...prev, newToast];
      if (updatedToasts.length > MAX_TOASTS) {
        return updatedToasts.slice(-MAX_TOASTS);
      }
      return updatedToasts;
    });
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}