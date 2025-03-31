import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { formatCurrency } from "~/utils/format-utils";

import type { Classification } from "~/hooks/use-classification-service";
import type { Budget } from "~/hooks/use-budget-service";
import type { Spending } from "~/models/spending";

interface SpendingListProps {
  spendings: Spending[];
  getClassification?: (id: string | number | undefined) => Classification | undefined;
  getBudget?: (id: string | number | undefined) => Budget | undefined;
  onEdit: (spending: Spending) => void;
  onDelete: (id: string) => void;
  currency: string;
  showClassification?: boolean;
}

export function SpendingList({
  spendings,
  getClassification,
  getBudget,
  onEdit,
  onDelete,
  currency,
  showClassification = true
}: SpendingListProps) {
  return (
    <div className="space-y-3">
      {spendings.map(spending => {
        // Use embedded classification if it exists, otherwise look it up
        const classification = spending.classification || 
          (getClassification && getClassification(spending.classificationId));

        // Get budget for this classification if needed
        const budget = getBudget && getBudget(spending.classificationId);
        
        return (
          <FancyCard key={spending.secureId || spending.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {showClassification && classification && (
                    <>
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: classification.color || "#3b82f6" }}
                      />
                      <span className="text-sm text-gray-500">{classification.name}</span>
                    </>
                  )}
                </div>
                
                <p className="font-medium mt-1">{spending.description}</p>
                
                <div className="flex items-center mt-1">
                  <span className="text-lg font-semibold">
                    {formatCurrency(spending.amount, currency)}
                  </span>
                  {spending.date && (
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(spending.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button 
                  className="btn btn-ghost btn-xs btn-square"
                  onClick={() => onEdit(spending)}
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                
                <button 
                  className="btn btn-ghost btn-xs btn-square text-error"
                  onClick={() => onDelete(spending.secureId)}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </FancyCard>
        );
      })}
    </div>
  );
}