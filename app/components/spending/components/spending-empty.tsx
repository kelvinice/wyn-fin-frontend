import { FancyCard } from "~/components/common/cards/fancy-card";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

interface SpendingEmptyProps {
  onAddNew: () => void;
}

export function SpendingEmpty({ onAddNew }: SpendingEmptyProps) {
  return (
    <FancyCard className="p-6 text-center">
      <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-primary/10">
        <CurrencyDollarIcon className="w-8 h-8 text-primary" />
      </div>
      <p className="text-gray-500 mb-4">No spending transactions found for this period</p>
      <button 
        className="btn btn-primary btn-sm"
        onClick={onAddNew}
      >
        Add your first spending
      </button>
    </FancyCard>
  );
}