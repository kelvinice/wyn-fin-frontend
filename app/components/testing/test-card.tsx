import { type ReactNode } from "react";
import { FancyCard } from "~/components/common/cards/fancy-card";

interface TestCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function TestCard({ title, children, className = "" }: TestCardProps) {
  return (
    <FancyCard className={`p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </FancyCard>
  );
}