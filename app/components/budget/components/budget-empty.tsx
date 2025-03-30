import { FancyCard } from "~/components/common/cards/fancy-card";
import type { Classification } from "~/models/classification";

interface BudgetEmptyProps {
  onAddNew: () => void;
  availableClassifications: Classification[];
}

export function BudgetEmpty({ onAddNew, availableClassifications }: BudgetEmptyProps) {
  return (
    <FancyCard className="p-6 text-center">
      <p className="text-gray-500">No budget allocations found for this period</p>
      {availableClassifications.length > 0 && (
        <button 
          className="btn btn-primary btn-sm mt-4"
          onClick={onAddNew}
        >
          Create your first budget allocation
        </button>
      )}
    </FancyCard>
  );
}