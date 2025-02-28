import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface UnderConstructionProps {
  message?: string;
}

export function UnderConstruction({ message = "This feature is coming soon!" }: UnderConstructionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <BuildingOfficeIcon className="w-24 h-24 text-primary animate-bounce mb-4" />
      <h2 className="text-2xl font-bold text-center mb-2">Under Construction</h2>
      <p className="text-gray-600 text-center">{message}</p>
    </div>
  );
}