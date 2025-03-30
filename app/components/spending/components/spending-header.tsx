import { PlusIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "~/utils/format-utils";

interface SpendingHeaderProps {
  onAddNew: () => void;
  isLoading: boolean;
  viewMode: 'date' | 'classification';
  onViewModeChange: (mode: 'date' | 'classification') => void;
  totalSpent: number;
  totalRemaining: number;
  currency: string;
  periodName?: string;
}

export function SpendingHeader({
  onAddNew,
  isLoading,
  viewMode,
  onViewModeChange,
  totalSpent,
  totalRemaining,
  currency,
  periodName = ''
}: SpendingHeaderProps) {
  const isOverBudget = totalRemaining < 0;
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Spending Transactions</h2>
          {periodName && (
            <span className="badge badge-primary">{periodName}</span>
          )}
        </div>
        <div className="flex items-center gap-4 mt-1">
          <p className="text-gray-600 dark:text-gray-300">
            Total: {formatCurrency(totalSpent, currency)}
          </p>
          <p className={`${isOverBudget ? 'text-error' : 'text-success'}`}>
            {isOverBudget ? 'Over budget: ' : 'Remaining: '}
            {formatCurrency(Math.abs(totalRemaining), currency)}
          </p>
        </div>
      </div>
      
      <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <button 
          className="btn btn-primary btn-sm"
          onClick={onAddNew}
          disabled={isLoading}
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          Add Spending
        </button>
      </div>
    </div>
  );
}