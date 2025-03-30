import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { formatCurrency } from "~/utils/format-utils";
import type { Spending } from "~/models/spending";
import type { Classification } from "~/models/classification";
import { SpendingList } from "../spending-list";

interface BudgetGroup {
  classification: Classification;
  spendings: Spending[];
  totalSpent: number;
  budgetAmount: number;
  remaining: number;
  percentUsed: number;
}

interface SpendingBudgetCardProps {
  budgetGroup: BudgetGroup;
  onEdit: (spending: Spending) => void;
  onDelete: (id: string) => void;
  currency: string;
}

export function SpendingBudgetCard({ 
  budgetGroup, 
  onEdit, 
  onDelete, 
  currency 
}: SpendingBudgetCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { classification, spendings, totalSpent, budgetAmount, remaining, percentUsed } = budgetGroup;

  const isOverBudget = remaining < 0;
  const progressBarColor = isOverBudget 
    ? "bg-error" 
    : percentUsed > 80 
      ? "bg-warning" 
      : "bg-success";

  return (
    <FancyCard className="overflow-hidden">
      <div 
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: classification.color || "#3b82f6" }}
          />
          <h3 className="font-medium text-lg">{classification.name}</h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {formatCurrency(totalSpent, currency)} / {formatCurrency(budgetAmount, currency)}
            </p>
            <p className={`text-xs font-medium ${isOverBudget ? 'text-error' : 'text-gray-500'}`}>
              {isOverBudget ? 'Over budget: ' : 'Remaining: '}
              {formatCurrency(Math.abs(remaining), currency)}
            </p>
          </div>
          
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-1.5">
        <div 
          className={`h-full ${progressBarColor} transition-all duration-300`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>

      {isExpanded && (
        <div className="p-4 pt-2 bg-base-200 border-t border-base-300">
          {spendings.length > 0 ? (
            <SpendingList
              spendings={spendings}
              onEdit={onEdit}
              onDelete={onDelete}
              currency={currency}
              showClassification={false}
            />
          ) : (
            <p className="text-center text-gray-500 py-4">No spending entries for this budget</p>
          )}
        </div>
      )}
    </FancyCard>
  );
}