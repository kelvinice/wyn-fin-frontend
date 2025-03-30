import { PlusIcon } from "@heroicons/react/24/outline";
import { BudgetItem } from "./budget-item";
import { FancyCard } from "~/components/common/cards/fancy-card";
import type { Budget } from "~/models/budget";
import type { Classification } from "~/models/classification";

interface BudgetListProps {
  budgets: Budget[];
  getClassification: (id: string | number | undefined) => Classification | undefined;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  availableClassifications: Classification[];
}

export function BudgetList({ 
  budgets, 
  getClassification, 
  onEdit, 
  onDelete, 
  onAddNew,
  availableClassifications
}: BudgetListProps) {
  if (budgets.length === 0) {
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

  return (
    <div className="space-y-3">
      {budgets.map((budget) => {
        // Use the embedded classification if it exists, otherwise find it
        const classification = budget.classification || getClassification(budget.classificationId);
        if (!classification) return null;
        
        return (
          <BudgetItem
            key={budget.secureId || budget.id}
            budget={budget}
            classification={classification}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}