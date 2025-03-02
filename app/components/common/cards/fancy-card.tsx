import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export function FancyCard({ children, className = "" }: Props) {
  
  return (
    <div
      className={`
        relative rounded-xl overflow-hidden
        backdrop-blur-xl bg-base-100/80
        before:absolute before:inset-0
        before:bg-linear-to-br before:from-primary/10 before:to-transparent
        before:pointer-events-none before:opacity-50
        after:absolute after:inset-0
        after:bg-linear-to-tr after:from-base-100/20 after:to-primary/5
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
    </div>
  );
}