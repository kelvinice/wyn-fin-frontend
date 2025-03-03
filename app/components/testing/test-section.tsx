import { type ReactNode } from "react";

interface TestSectionProps {
  title: string;
  children: ReactNode;
}

export function TestSection({ title, children }: TestSectionProps) {
  return (
    <section>
      <div className="border-b border-base-300 pb-2 mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {children}
      </div>
    </section>
  );
}