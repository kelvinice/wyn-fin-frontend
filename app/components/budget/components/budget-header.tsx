import { PlusIcon } from "@heroicons/react/24/outline";
import { CopyBudgetButton } from "../copy-budget-button";
import type { Classification } from "~/models/classification";

interface BudgetHeaderProps {
  onAddNew: () => void;
  onCopy: (sourcePeriodId: string) => Promise<void>;
  onCopyFromPrevious: () => Promise<void>;
  availableClassifications: Classification[];
  isLoading: boolean;
  currentPeriodId: string;
  hasPreviousPeriod: boolean;
}

export function BudgetHeader({ 
  onAddNew, 
  onCopy, 
  onCopyFromPrevious,
  availableClassifications, 
  isLoading,
  currentPeriodId,
  hasPreviousPeriod
}: BudgetHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Budget Allocations</h2>
      <div className="flex flex-col sm:flex-row gap-2">
        {hasPreviousPeriod && (
          <button 
            className="btn btn-outline btn-success btn-sm"
            onClick={onCopyFromPrevious}
            disabled={isLoading}
          >
            Copy from Previous Month
          </button>
        )}
        <CopyBudgetButton 
          currentPeriodId={currentPeriodId}
          onCopy={onCopy}
          disabled={isLoading}
        />
        <button 
          className="btn btn-primary btn-sm"
          onClick={onAddNew}
          disabled={availableClassifications.length === 0 || isLoading}
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          New Allocation
        </button>
      </div>
    </div>
  );
}