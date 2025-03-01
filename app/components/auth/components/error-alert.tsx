import { motion } from "framer-motion";

interface ErrorAlertProps {
  message: string | null;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;
  
  return (
    <motion.div 
      className="alert alert-error mb-6"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
    >
      <span>{message}</span>
    </motion.div>
  );
}