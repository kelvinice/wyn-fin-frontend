import { SpendingBudgetCard } from "./spending-budget-card";
import type { Spending } from "~/models/spending";
import type { Classification } from "~/models/classification";

interface BudgetGroup {
  classification: Classification;
  spendings: Spending[];
  totalSpent: number;
  budgetAmount: number;
  remaining: number;
  percentUsed: number;
}

interface SpendingBudgetViewProps {
  spendingsByClassification: BudgetGroup[];
  onEdit: (spending: Spending) => void;
  onDelete: (id: string) => void;
  currency: string;
}

export function SpendingBudgetView({
  spendingsByClassification,
  onEdit,
  onDelete,
  currency
}: SpendingBudgetViewProps) {
  // Sort by budget amount descending
  const sortedBudgets = [...spendingsByClassification].sort(
    (a, b) => b.budgetAmount - a.budgetAmount
  );

  return (
    <div className="space-y-6">
      {sortedBudgets.map(budgetGroup => (
        <SpendingBudgetCard
          key={budgetGroup.classification.secureId || budgetGroup.classification.id}
          budgetGroup={budgetGroup}
          onEdit={onEdit}
          onDelete={onDelete}
          currency={currency}
        />
      ))}
    </div>
  );
}