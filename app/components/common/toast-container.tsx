import { AnimatePresence } from "framer-motion";
import { Toast } from "./toast";
import type { ToastItem } from "./toast-context";

interface ToastContainerProps {
  toasts: ToastItem[];
  removeToast: (id: number) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="toast-container toast-end z-50 fixed bottom-4 right-4 flex flex-col gap-2 items-end max-h-screen overflow-hidden">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="w-auto">
            <Toast
              id={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
              show={true}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}