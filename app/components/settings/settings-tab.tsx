import { type ReactNode } from "react";

interface SettingsTabProps {
  title: string;
  children: ReactNode;
}

export function SettingsTab({ title, children }: SettingsTabProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

export function SettingItem({ 
  label, 
  description,
  children 
}: { 
  label: string; 
  description?: string; 
  children: ReactNode 
}) {
  return (
    <div>
      <label className="font-medium mb-2 block">{label}</label>
      {children}
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
  );
}