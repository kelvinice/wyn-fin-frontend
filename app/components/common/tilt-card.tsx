import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, {
    stiffness: 100,
    damping: 30,
    mass: 0.5
  });

  const mouseYSpring = useSpring(y, {
    stiffness: 100,
    damping: 30,
    mass: 0.5
  });

  const degrees = 12;

  const rotateX = useTransform(mouseYSpring, [0.5, -0.5], [`${degrees}deg`, `-${degrees}deg`]);
  const rotateY = useTransform(mouseXSpring, [0.5, -0.5], [`${degrees}deg`, `-${degrees}deg`]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate center point
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center
    const distanceX = (e.clientX - centerX) / (rect.width / 2);
    const distanceY = (e.clientY - centerY) / (rect.height / 2);
    
    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
        rotateX,
        rotateY,
      }}
      className={`
        relative rounded-xl overflow-hidden
        backdrop-blur-xl bg-base-100/80
        before:absolute before:inset-0
        before:bg-gradient-to-br before:from-primary/10 before:to-transparent
        before:pointer-events-none before:opacity-50
        after:absolute after:inset-0
        after:bg-gradient-to-tr after:from-base-100/20 after:to-primary/5
        after:pointer-events-none
        border border-base-200/50
        shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
        hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.15)]
        transition-shadow duration-300
        ${className}
      `}
    >
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}