import { useMemo } from "react";
import type { Budget } from "./use-budget-service";
import type { Classification } from "./use-classification-service";

export function useBudgetUtils(budgets: Budget[], classifications: Classification[]) {
  // Get classification by ID
  const getClassification = (classificationId: number | string | undefined): Classification | undefined => {
    if (!classificationId) return undefined;
    
    const idStr = classificationId?.toString();
    
    return classifications.find(c => 
      c.secureId === idStr || 
      c.id?.toString() === idStr
    );
  };
  
  // Check if a classification already has a budget
  const classificationHasBudget = (classificationId: number | string): boolean => {
    return budgets.some(budget => 
      budget.classificationId === classificationId || 
      (budget.classification && (
        budget.classification.id === classificationId || 
        budget.classification.secureId === classificationId
      ))
    );
  };
  
  // Get available classifications (those without budgets, unless editing)
  const getAvailableClassifications = (currentBudget: Budget | null, isEditMode: boolean): Classification[] => {
    if (isEditMode && currentBudget) {
      return classifications.filter(c => 
        c.id === currentBudget.classificationId ||
        c.secureId === currentBudget.classificationId ||
        !classificationHasBudget(c.id)
      );
    }
    return classifications.filter(c => !classificationHasBudget(c.id));
  };

  // Calculate total budget
  const totalBudget = useMemo(() => {
    return budgets.reduce((acc, budget) => acc + budget.amount, 0);
  }, [budgets]);

  return {
    getClassification,
    classificationHasBudget,
    getAvailableClassifications,
    totalBudget
  };
}