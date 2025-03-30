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
import { type BudgetFormData } from "./budget-form";
import { BudgetHeader } from "./components/budget-header";
import { BudgetEditModal } from "./components/budget-edit-modal";
import { BudgetDeleteModal } from "./components/budget-delete-modal";
import { BudgetCopyFromPreviousModal } from "./components/budget-copy-from-previous-modal";
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
  const [showCopyFromPreviousModal, setShowCopyFromPreviousModal] = useState(false);
  
  const currency = useCurrency();
  const { showToast } = useToast();
  const { register, handleSubmit: handleFormSubmit, reset, watch } = useForm<BudgetFormData>({
    defaultValues: {
      classificationId: "",
      amount: 0
    }
  });
  
  const { 
    useGetBudgetsByPeriod, 
    useCreateBudget,
    useUpdateBudget,
    useDeleteBudget,
    useCopyBudgets,
  } = useBudgetService();
  
  const { useGetAllClassifications } = useClassificationService();
  const { useGetAllPeriods } = usePeriodService();
  
  const { data: budgets = [], isLoading: isBudgetsLoading } = 
    useGetBudgetsByPeriod(periodId);
  
  const { data: classifications = [], isLoading: isClassificationsLoading } = 
    useGetAllClassifications();
    
  const { data: periods = [], isLoading: isPeriodsLoading } = 
    useGetAllPeriods();
  
  const createBudgetMutation = useCreateBudget();
  const updateBudgetMutation = useUpdateBudget();
  const deleteBudgetMutation = useDeleteBudget();
  const copyBudgetMutation = useCopyBudgets();

  const {
    getClassification,
    getAvailableClassifications,
    totalBudget
  } = useBudgetUtils(budgets, classifications);
  
  const currentPeriod = useMemo(() => {
    return periods.find(p => p.id === periodId);
  }, [periods, periodId]);
  
  const previousPeriod = useMemo(() => {
    if (!currentPeriod) return null;
    
    const { year, month } = currentPeriod;
    
    const prevYear = month === 1 ? year - 1 : year;
    const prevMonth = month === 1 ? 12 : month - 1;
    
    return periods.find(p => p.year === prevYear && p.month === prevMonth);
  }, [periods, currentPeriod]);
  
  const isLoading = isBudgetsLoading || isClassificationsLoading || isPeriodsLoading ||
    createBudgetMutation.isPending || updateBudgetMutation.isPending || 
    deleteBudgetMutation.isPending || copyBudgetMutation.isPending;
  
  const availableClassifications = getAvailableClassifications(currentBudget, isEditMode);
  
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
  
  const handleSubmit = async (data: BudgetFormData) => {
    try {
      if (isEditMode && currentBudget) {
        await updateBudgetMutation.mutateAsync({
          id: currentBudget.secureId,
          data: { amount: data.amount }
        });
        showToast('Budget updated successfully', 'success');
      } else {
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
  
  const formatPeriodName = (period: any) => {
    if (!period) return "";
    const monthName = new Date(2000, period.month - 1).toLocaleString('default', { month: 'long' });
    return `${monthName} ${period.year}`;
  };
  
  const handleCopyFromPreviousClick = () => {
    if (!previousPeriod) {
      showToast('No previous period found to copy from', 'error');
      return;
    }
    
    setShowCopyFromPreviousModal(true);
  };
  
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
      setShowCopyFromPreviousModal(false);
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
        onCopyFromPrevious={handleCopyFromPreviousClick}
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
      
      <BudgetCopyFromPreviousModal
        isOpen={showCopyFromPreviousModal}
        onClose={() => setShowCopyFromPreviousModal(false)}
        onConfirm={handleCopyFromPrevious}
        isLoading={copyBudgetMutation.isPending}
        previousPeriodName={previousPeriod ? formatPeriodName(previousPeriod) : undefined}
        currentPeriodName={currentPeriod ? formatPeriodName(currentPeriod) : undefined}
      />
    </div>
  );
}