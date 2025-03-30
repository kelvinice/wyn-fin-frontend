import { useState } from 'react';
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { formatCurrency } from "~/utils/format-utils";
import { useCurrency } from "~/hooks/use-currency";
import type { Budget } from "~/hooks/use-budget-service";
import type { Classification } from "~/hooks/use-classification-service";

interface BudgetItemProps {
  budget: Budget;
  classification: Classification;
  onEdit: (budget: Budget) => void;
  onDelete: (budgetId: string) => void;
}

export function BudgetItem({ budget, classification, onEdit, onDelete }: BudgetItemProps) {
  const currency = useCurrency();
  
  return (
    <FancyCard className="p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: classification.color || "#3b82f6" }}
          ></div>
          <span className="font-medium">{classification.name}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="font-semibold">{formatCurrency(budget.amount, currency)}</span>
          
          <div className="flex items-center space-x-1">
            <button 
              className="btn btn-ghost btn-sm btn-square"
              onClick={() => onEdit(budget)}
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            
            <button 
              className="btn btn-ghost btn-sm btn-square text-error"
              onClick={() => onDelete(budget.id)}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </FancyCard>
  );
}