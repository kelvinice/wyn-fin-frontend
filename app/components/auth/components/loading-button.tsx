import { motion, AnimatePresence } from "framer-motion";

interface LoadingButtonProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: () => void;
}

export function LoadingButton({
  isLoading,
  loadingText = "Processing",
  children,
  type = "submit",
  className = "btn btn-primary w-full",
  onClick,
}: LoadingButtonProps) {
  return (
    <motion.button
      type={type}
      className={`${className} relative overflow-hidden`}
      disabled={isLoading}
      whileTap={{ scale: isLoading ? 1 : 0.98 }}
      whileHover={{ scale: isLoading ? 1 : 1.01 }}
      onClick={onClick}
    >
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary"
          initial={{ x: "-100%" }}
          animate={{ 
            x: ["100%", "-100%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear"
          }}
        />
      )}
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            className="flex items-center justify-center gap-2 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span>{loadingText}</span>
            <motion.div
              className="flex space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="h-1.5 w-1.5 rounded-full bg-current"
                  animate={{
                    y: ["0%", "-30%", "0%"],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: dot * 0.1
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}