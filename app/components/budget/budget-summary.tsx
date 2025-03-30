import { FancyCard } from "~/components/common/cards/fancy-card";
import { formatCurrency } from "~/utils/format-utils";

interface BudgetSummaryProps {
  totalBudget: number;
  currency: string;
}

export function BudgetSummary({ totalBudget, currency }: BudgetSummaryProps) {
  return (
    <div className="mb-6">
      <FancyCard className="p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Total Budget</span>
          <span className="text-lg font-semibold">{formatCurrency(totalBudget, currency)}</span>
        </div>
      </FancyCard>
    </div>
  );
}