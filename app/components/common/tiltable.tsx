import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  tiltMaxDegrees?: number;
}

export function TiltAble({ children, className = "", tiltMaxDegrees = 12 }: Props) {
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

  // Invert Y axis for correct rotation direction
  const rotateX = useTransform(mouseYSpring, [-1, 1], [`${tiltMaxDegrees}deg`, `-${tiltMaxDegrees}deg`]);
  const rotateY = useTransform(mouseXSpring, [-1, 1], [`-${tiltMaxDegrees}deg`, `${tiltMaxDegrees}deg`]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width * 2 - 1;
    const normalizedY = (e.clientY - rect.top) / rect.height * 2 - 1;
    
    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className={`perspective-1000 ${className}`} style={{ perspective: "1000px" }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
        }}
        className={`
          relative rounded-xl overflow-hidden
          w-full h-full
          before:absolute before:inset-0
          after:absolute after:inset-0
          after:pointer-events-none
          transition-shadow duration-300
        `}
      >
        <div className="relative z-10 transform-style-3d">
          {children}
        </div>
      </motion.div>
    </div>
  );
}