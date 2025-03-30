import { FancyCard } from "~/components/common/cards/fancy-card";
import { formatCurrency } from "~/utils/format-utils";

interface SpendingBudgetSummaryProps {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  percentSpent: number;
  currency: string;
}

export function SpendingBudgetSummary({
  totalBudget,
  totalSpent,
  totalRemaining,
  percentSpent,
  currency
}: SpendingBudgetSummaryProps) {
  const isOverBudget = totalRemaining < 0;
  const progressBarColor = isOverBudget 
    ? "bg-error" 
    : percentSpent > 80 
      ? "bg-warning" 
      : "bg-success";

  return (
    <FancyCard className="p-5 mb-6">
      <div className="flex flex-wrap justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-medium">Total Budget</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalBudget, currency)}</p>
        </div>
        
        <div className="text-right">
          <h3 className="text-lg font-medium">Spent</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalSpent, currency)}</p>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
        <div 
          className={`h-full ${progressBarColor} rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(percentSpent, 100)}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-sm">
          {percentSpent.toFixed(0)}% used
        </p>
        <p className={`text-sm font-medium ${isOverBudget ? 'text-error' : 'text-success'}`}>
          {isOverBudget ? 'Over budget: ' : 'Remaining: '}
          {formatCurrency(Math.abs(totalRemaining), currency)}
        </p>
      </div>
    </FancyCard>
  );
}