import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { useToast } from "~/components/common/toast-context";
import { LoadingButton } from "~/components/auth/components/loading-button";
import { Modal } from "~/components/common/modal";
import { useBudgetService, type Budget } from "~/hooks/use-budget-service";
import { useClassificationService, type Classification } from "~/hooks/use-classification-service";
import { BudgetItem } from "./budget-item";
import { formatCurrency } from "~/utils/format-utils";

interface BudgetManagementProps {
  periodId: string;
}

export function BudgetManagement({ periodId }: BudgetManagementProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    classificationId: "",
    amount: 0
  });
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [totalBudget, setTotalBudget] = useState(0);
  
  const { showToast } = useToast();
  const {
    getBudgetsByPeriod,
    createBudget,
    updateBudget,
    deleteBudget
  } = useBudgetService();
  
  const {
    getAllClassifications
  } = useClassificationService();
  
  // Load budgets when periodId changes
  useEffect(() => {
    if (periodId) {
      loadData();
    }
  }, [periodId]);
  
  // Load budgets and classifications
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [budgetsResponse, classificationsResponse] = await Promise.all([
        getBudgetsByPeriod(periodId),
        getAllClassifications()
      ]);
      
      setBudgets(Array.isArray(budgetsResponse) ? budgetsResponse : []);
      setClassifications(Array.isArray(classificationsResponse) ? classificationsResponse : []);
      
      // Calculate total budget
      const total = Array.isArray(budgetsResponse) 
        ? budgetsResponse.reduce((acc, budget) => acc + budget.amount, 0)
        : 0;
      setTotalBudget(total);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load budget data', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Open modal to create new budget
  const handleAddNew = () => {
    setFormData({
      classificationId: classifications.length > 0 ? classifications[0].id : "",
      amount: 0
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };
  
  // Open modal to edit budget
  const handleEdit = (budget: Budget) => {
    setFormData({
      classificationId: budget.classificationId,
      amount: budget.amount
    });
    setCurrentBudget(budget);
    setIsEditMode(true);
    setIsModalOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (isEditMode && currentBudget) {
        // Update existing budget
        await updateBudget(currentBudget.id, {
          amount: formData.amount
        });
        showToast('Budget updated successfully', 'success');
      } else {
        // Create new budget
        await createBudget({
          periodId,
          classificationId: formData.classificationId,
          amount: formData.amount
        });
        showToast('Budget created successfully', 'success');
      }
      
      // Reload budgets and close modal
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving budget:', error);
      showToast('Failed to save budget', 'error');
    }
  };
  
  // Handle delete confirmation
  const handleDelete = async (id: string) => {
    try {
      await deleteBudget(id);
      showToast('Budget deleted successfully', 'success');
      await loadData();
      setDeleteConfirmationId(null);
    } catch (error) {
      console.error('Error deleting budget:', error);
      showToast('Failed to delete budget', 'error');
    }
  };
  
  // Get classification by ID
  const getClassification = (classificationId: string): Classification | undefined => {
    return classifications.find(c => c.id === classificationId);
  };
  
  // Check if a classification already has a budget
  const classificationHasBudget = (classificationId: string): boolean => {
    return budgets.some(budget => budget.classificationId === classificationId);
  };
  
  // Get available classifications (those without budgets, unless editing)
  const getAvailableClassifications = (): Classification[] => {
    if (isEditMode && currentBudget) {
      return classifications.filter(c => 
        c.id === currentBudget.classificationId || 
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
          disabled={availableClassifications.length === 0}
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
                <span className="text-lg font-semibold">{formatCurrency(totalBudget)}</span>
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
                const classification = getClassification(budget.classificationId);
                if (!classification) return null;
                
                return (
                  <BudgetItem
                    key={budget.id}
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
            >
              Cancel
            </button>
            <LoadingButton
              className="btn btn-primary"
              onClick={handleSubmit}
              isLoading={false}
            >
              {isEditMode ? "Update" : "Create"}
            </LoadingButton>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Classification</span>
            </label>
            {isEditMode ? (
              <div className="flex items-center gap-2 p-2 border rounded-lg">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: getClassification(formData.classificationId)?.color || "#3b82f6" }}
                ></div>
                <span>{getClassification(formData.classificationId)?.name || "Unknown"}</span>
              </div>
            ) : (
              <select
                className="select select-bordered w-full"
                value={formData.classificationId}
                onChange={(e) => setFormData({ ...formData, classificationId: e.target.value })}
                disabled={availableClassifications.length === 0}
              >
                {availableClassifications.map((classification) => (
                  <option key={classification.id} value={classification.id}>
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
              <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500">$</span>
              <input
                type="number"
                className="input input-bordered w-full pl-7"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
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
        </div>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmationId !== null}
        onClose={() => setDeleteConfirmationId(null)}
        title="Confirm Delete"
        size="sm"
        footer={
          <>
            <button
              className="btn btn-ghost"
              onClick={() => setDeleteConfirmationId(null)}
            >
              Cancel
            </button>
            <LoadingButton
              className="btn btn-error"
              onClick={() => deleteConfirmationId && handleDelete(deleteConfirmationId)}
              isLoading={false}
            >
              Delete
            </LoadingButton>
          </>
        }
      >
        <p>Are you sure you want to delete this budget allocation? This cannot be undone.</p>
      </Modal>
    </div>
  );
}