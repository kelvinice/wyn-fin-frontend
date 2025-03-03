import { useEffect, useRef, type ReactNode } from "react";

interface NonCopyableTextProps {
  children: ReactNode;
  className?: string;
}

export function NonCopyableText({
  children,
  className = "",
}: NonCopyableTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  
  // Prevent text selection and copying
  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.userSelect = "none";
      
      // Prevent copy on the specific element
      const preventCopy = (e: ClipboardEvent) => {
        e.preventDefault();
        return false;
      };
      
      textRef.current.addEventListener("copy", preventCopy);
      textRef.current.addEventListener("cut", preventCopy);
      
      return () => {
        if (textRef.current) {
          textRef.current.removeEventListener("copy", preventCopy);
          textRef.current.removeEventListener("cut", preventCopy);
        }
      };
    }
  }, []);
  
  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };
  
  return (
    <span 
      ref={textRef} 
      className={`select-none ${className}`}
      onCopy={handleCopy}
    >
      {children}
    </span>
  );
}