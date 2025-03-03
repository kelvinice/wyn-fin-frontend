import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, type ReactNode } from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnClickOutside?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnClickOutside = true,
}: ModalProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={closeOnClickOutside ? onClose : () => {}}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel 
                className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-xl bg-base-100 text-left align-middle shadow-xl transition-all`}
              >
                <DialogTitle
                  as="div"
                  className="flex justify-between items-center border-b border-base-200 p-4"
                >
                  <h3 className="text-lg font-medium leading-6">{title}</h3>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-circle"
                    onClick={onClose}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </DialogTitle>
                
                <div className="p-6">{children}</div>
                
                {footer && (
                  <div className="border-t border-base-200 p-4 flex justify-end space-x-2">
                    {footer}
                  </div>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}