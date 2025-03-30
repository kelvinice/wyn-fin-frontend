import { useState } from "react";
import { useForm } from "react-hook-form";
import { PlusIcon } from "@heroicons/react/24/outline";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { useToast } from "~/components/common/toast-context";
import { LoadingButton } from "~/components/auth/components/loading-button";
import { Modal } from "~/components/common/modal";
import { useBudgetService, type Budget } from "~/hooks/use-budget-service";
import { useClassificationService, type Classification } from "~/hooks/use-classification-service";
import { BudgetItem } from "./budget-item";
import { formatCurrency } from "~/utils/format-utils";
import { useCurrency } from "~/hooks/use-currency";

interface BudgetManagementProps {
  periodId: string;
}

interface BudgetFormData {
  classificationId: string;
  amount: number;
}

export function BudgetManagement({ periodId }: BudgetManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  
  const currency = useCurrency();
  const { showToast } = useToast();
  const { register, handleSubmit: handleFormSubmit, setValue, reset, watch } = useForm<BudgetFormData>({
    defaultValues: {
      classificationId: "",
      amount: 0
    }
  });
  
  const currentClassificationId = watch("classificationId");
 
  const { 
    useGetBudgetsByPeriod, 
    useCreateBudget,
    useUpdateBudget,
    useDeleteBudget 
  } = useBudgetService();
  
  const { data: budgets = [], isLoading: isBudgetsLoading } = 
    useGetBudgetsByPeriod(periodId);
  
  const createBudgetMutation = useCreateBudget();
  const updateBudgetMutation = useUpdateBudget();
  const deleteBudgetMutation = useDeleteBudget();
  
  const { 
    useGetAllClassifications 
  } = useClassificationService();
  
  const { data: classifications = [], isLoading: isClassificationsLoading } = 
    useGetAllClassifications();
  
  // Calculate total budget
  const totalBudget = budgets.reduce((acc, budget) => acc + budget.amount, 0);
  
  // Determine if any data is loading
  const isLoading = isBudgetsLoading || isClassificationsLoading;
  
  // Open modal to create new budget
  const handleAddNew = () => {
    reset({
      classificationId: availableClassifications.length > 0 ? 
        (availableClassifications[0].secureId || availableClassifications[0].id?.toString() || "") : "",
      amount: 0
    });
    setCurrentBudget(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };
  
  const handleEdit = (budget: Budget) => {
    const classificationId = budget.classification?.secureId || 
                             budget.classification?.id?.toString() || 
                             budget.classificationId?.toString() || "";
    
    reset({
      classificationId,
      amount: budget.amount
    });
    
    setCurrentBudget(budget);
    setIsEditMode(true);
    setIsModalOpen(true);
  };
  
  // Handle form submission
  const onSubmit = async (data: BudgetFormData) => {
    try {
      if (isEditMode && currentBudget) {
        // Update existing budget
        await updateBudgetMutation.mutateAsync({
          id: currentBudget.secureId,
          data: { amount: data.amount }
        });
        showToast('Budget updated successfully', 'success');
      } else {
        // Create new budget
        await createBudgetMutation.mutateAsync({
          periodId,
          classificationId: data.classificationId,
          amount: data.amount
        });
        showToast('Budget created successfully', 'success');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving budget:', error);
      showToast('Failed to save budget', 'error');
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteBudgetMutation.mutateAsync(id);
      showToast('Budget deleted successfully', 'success');
      setDeleteConfirmationId(null);
    } catch (error) {
      console.error('Error deleting budget:', error);
      showToast('Failed to delete budget', 'error');
    }
  };
  
  const getClassification = (classificationId: number | string | undefined): Classification | undefined => {
    if (!classificationId) return undefined;
    
    const idStr = classificationId.toString();
    
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
  const getAvailableClassifications = (): Classification[] => {
    if (isEditMode && currentBudget) {
      return classifications.filter(c => 
        c.id === currentBudget.classificationId ||
        c.secureId === currentBudget.classificationId ||
        !classificationHasBudget(c.id)
      );
    }
    return classifications.filter(c => !classificationHasBudget(c.id));
  };
  
  const availableClassifications = getAvailableClassifications();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Budget Allocations</h2>
        <button 
          className="btn btn-primary btn-sm"
          onClick={handleAddNew}
          disabled={availableClassifications.length === 0 || isLoading}
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          New Allocation
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <FancyCard className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total Budget</span>
                <span className="text-lg font-semibold">{formatCurrency(totalBudget, currency)}</span>
              </div>
            </FancyCard>
          </div>
          
          {budgets.length === 0 ? (
            <FancyCard className="p-6 text-center">
              <p className="text-gray-500">No budget allocations found for this period</p>
              {availableClassifications.length > 0 && (
                <button 
                  className="btn btn-primary btn-sm mt-4"
                  onClick={handleAddNew}
                >
                  Create your first budget allocation
                </button>
              )}
            </FancyCard>
          ) : (
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
                    onEdit={handleEdit}
                    onDelete={(id) => setDeleteConfirmationId(id)}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
      
      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? "Edit Budget Allocation" : "New Budget Allocation"}
        size="sm"
        footer={
          <>
            <button
              className="btn btn-ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={createBudgetMutation.isPending || updateBudgetMutation.isPending}
            >
              Cancel
            </button>
            <LoadingButton
              className="btn btn-primary"
              onClick={handleFormSubmit(onSubmit)}
              isLoading={createBudgetMutation.isPending || updateBudgetMutation.isPending}
              loadingText={isEditMode ? "Updating..." : "Creating..."}
            >
              {isEditMode ? "Update" : "Create"}
            </LoadingButton>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleFormSubmit(onSubmit)}>
          <div>
            <label className="label">
              <span className="label-text font-medium">Classification</span>
            </label>
            {isEditMode ? (
              <div className="flex items-center gap-2 p-2 border rounded-lg">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: getClassification(currentClassificationId)?.color || "#3b82f6" }}
                ></div>
                <span>{getClassification(currentClassificationId)?.name || "Unknown"}</span>
              </div>
            ) : (
              <select
                className="select select-bordered w-full"
                disabled={availableClassifications.length === 0 || createBudgetMutation.isPending}
                {...register("classificationId", { required: true })}
              >
                {availableClassifications.map((classification) => (
                  <option 
                    key={classification.secureId || classification.id} 
                    value={classification.secureId || classification.id}
                  >
                    {classification.name}
                  </option>
                ))}
                {availableClassifications.length === 0 && (
                  <option value="">No available classifications</option>
                )}
              </select>
            )}
          </div>
          
          <div>
            <label className="label">
              <span className="label-text font-medium">Budget Amount</span>
            </label>
            <div className="relative">
              <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500">
                {currency === 'IDR' ? 'Rp' : currency === 'USD' ? '$' : ''}
              </span>
              <input
                type="number"
                className="input input-bordered w-full pl-7"
                min="0"
                step={currency === 'IDR' ? "1000" : "0.01"}
                disabled={createBudgetMutation.isPending || updateBudgetMutation.isPending}
                {...register("amount", { 
                  required: true,
                  valueAsNumber: true,
                  min: 0
                })}
              />
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-sm text-gray-500">
              {isEditMode 
                ? "Update the budget allocation amount" 
                : "Allocate a budget amount to this classification"}
            </p>
          </div>
        </form>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmationId !== null}
        onClose={() => setDeleteConfirmationId(null)}
        title="Confirm Delete"
        size="sm"
        closeOnClickOutside={!deleteBudgetMutation.isPending}
        footer={
          <>
            <button
              className="btn btn-ghost"
              onClick={() => setDeleteConfirmationId(null)}
              disabled={deleteBudgetMutation.isPending}
            >
              Cancel
            </button>
            <LoadingButton
              className="btn btn-error"
              onClick={() => deleteConfirmationId && handleDelete(deleteConfirmationId)}
              isLoading={deleteBudgetMutation.isPending}
              loadingText="Deleting..."
            >
              Delete
            </LoadingButton>
          </>
        }
      >
        <div className="py-2">
          <p>Are you sure you want to delete this budget allocation? This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
}