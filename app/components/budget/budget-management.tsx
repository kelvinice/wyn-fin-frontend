import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "~/components/common/toast-context";
import { useBudgetService, type Budget } from "~/hooks/use-budget-service";
import { useClassificationService } from "~/hooks/use-classification-service";
import { useBudgetUtils } from "~/hooks/use-budget-utils";
import { useCurrency } from "~/hooks/use-currency";
import { usePeriodService } from "~/hooks/use-period-service";
import { BudgetSummary } from "./budget-summary";
import { BudgetList } from "./budget-list";
import { BudgetForm, type BudgetFormData } from "./budget-form";
import { BudgetHeader } from "./components/budget-header";
import { BudgetEditModal } from "./components/budget-edit-modal";
import { BudgetDeleteModal } from "./components/budget-delete-modal";
import { BudgetLoading } from "./components/budget-loading";
import { BudgetEmpty } from "./components/budget-empty";

interface BudgetManagementProps {
  periodId: string;
}

export function BudgetManagement({ periodId }: BudgetManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  
  const currency = useCurrency();
  const { showToast } = useToast();
  const { register, handleSubmit: handleFormSubmit, reset, watch } = useForm<BudgetFormData>({
    defaultValues: {
      classificationId: "",
      amount: 0
    }
  });
  
  // Services
  const { 
    useGetBudgetsByPeriod, 
    useCreateBudget,
    useUpdateBudget,
    useDeleteBudget,
    useCopyBudgets,
  } = useBudgetService();
  
  const { useGetAllClassifications } = useClassificationService();
  const { useGetAllPeriods } = usePeriodService();
  
  // Fetch data
  const { data: budgets = [], isLoading: isBudgetsLoading } = 
    useGetBudgetsByPeriod(periodId);
  
  const { data: classifications = [], isLoading: isClassificationsLoading } = 
    useGetAllClassifications();
    
  const { data: periods = [], isLoading: isPeriodsLoading } = 
    useGetAllPeriods();
  
  // Setup mutations
  const createBudgetMutation = useCreateBudget();
  const updateBudgetMutation = useUpdateBudget();
  const deleteBudgetMutation = useDeleteBudget();
  const copyBudgetMutation = useCopyBudgets();

  // Utility functions
  const {
    getClassification,
    getAvailableClassifications,
    totalBudget
  } = useBudgetUtils(budgets, classifications);
  
  // Find the current period in periods
  const currentPeriod = useMemo(() => {
    return periods.find(p => p.id === periodId);
  }, [periods, periodId]);
  
  // Find the previous period (month/year)
  const previousPeriod = useMemo(() => {
    if (!currentPeriod) return null;
    
    // Get year and month of current period
    const { year, month } = currentPeriod;
    
    // Calculate previous month (handle January)
    const prevYear = month === 1 ? year - 1 : year;
    const prevMonth = month === 1 ? 12 : month - 1;
    
    // Find the period matching previous month/year
    return periods.find(p => p.year === prevYear && p.month === prevMonth);
  }, [periods, currentPeriod]);
  
  // Determine if any data is loading
  const isLoading = isBudgetsLoading || isClassificationsLoading || isPeriodsLoading ||
    createBudgetMutation.isPending || updateBudgetMutation.isPending || 
    deleteBudgetMutation.isPending || copyBudgetMutation.isPending;
  
  // Get available classifications
  const availableClassifications = getAvailableClassifications(currentBudget, isEditMode);
  
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
  
  // Open modal to edit budget
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
  const handleSubmit = async (data: BudgetFormData) => {
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
  
  // Handle delete confirmation
  const handleDelete = async () => {
    if (!deleteConfirmationId) return;
    
    try {
      await deleteBudgetMutation.mutateAsync(deleteConfirmationId);
      showToast('Budget deleted successfully', 'success');
      setDeleteConfirmationId(null);
    } catch (error) {
      console.error('Error deleting budget:', error);
      showToast('Failed to delete budget', 'error');
    }
  };
  
  // Handle copying budgets from another period
  const handleCopyBudgets = async (sourcePeriodId: string) => {
    try {
      await copyBudgetMutation.mutateAsync({
        sourcePeriodId,
        targetPeriodId: periodId
      });
      showToast('Budget copied successfully', 'success');
    } catch (error) {
      console.error('Error copying budget:', error);
      showToast('Failed to copy budget', 'error');
    }
  };
  
  // Handle copying from previous month
  const handleCopyFromPrevious = async () => {
    if (!previousPeriod) {
      showToast('No previous period found to copy from', 'error');
      return;
    }
    
    try {
      await copyBudgetMutation.mutateAsync({
        sourcePeriodId: previousPeriod.id,
        targetPeriodId: periodId
      });
      showToast('Budget copied from previous month successfully', 'success');
    } catch (error) {
      console.error('Error copying from previous month:', error);
      showToast('Failed to copy from previous month', 'error');
    }
  };
  
  return (
    <div>
      <BudgetHeader 
        onAddNew={handleAddNew}
        onCopy={handleCopyBudgets}
        onCopyFromPrevious={handleCopyFromPrevious}
        availableClassifications={availableClassifications}
        isLoading={isLoading}
        currentPeriodId={periodId}
        hasPreviousPeriod={!!previousPeriod}
      />
      
      {isLoading ? (
        <BudgetLoading />
      ) : (
        <>
          <BudgetSummary totalBudget={totalBudget} currency={currency} />
          
          {budgets.length === 0 ? (
            <BudgetEmpty 
              onAddNew={handleAddNew}
              availableClassifications={availableClassifications}
            />
          ) : (
            <BudgetList 
              budgets={budgets}
              getClassification={getClassification}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteConfirmationId(id)}
              onAddNew={handleAddNew}
              availableClassifications={availableClassifications}
            />
          )}
        </>
      )}
      
      <BudgetEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        onSubmit={handleFormSubmit(handleSubmit)}
        isLoading={createBudgetMutation.isPending || updateBudgetMutation.isPending}
        register={register}
        watch={watch}
        availableClassifications={availableClassifications}
        getClassification={getClassification}
        currency={currency}
      />
      
      <BudgetDeleteModal
        isOpen={deleteConfirmationId !== null}
        onClose={() => setDeleteConfirmationId(null)}
        onDelete={handleDelete}
        isLoading={deleteBudgetMutation.isPending}
      />
    </div>
  );
}