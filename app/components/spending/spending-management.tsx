import { useState, useEffect } from "react";
import { useSpendingService, type Spending } from "~/hooks/use-spending-service";
import { useBudgetService, type Budget } from "~/hooks/use-budget-service";
import { useClassificationService } from "~/hooks/use-classification-service";
import { usePeriodService, type Period } from "~/hooks/use-period-service";
import { useCurrency } from "~/hooks/use-currency";
import { useToast } from "~/components/common/toast-context";
import { useForm } from "react-hook-form";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { SpendingHeader } from "./components/spending-header";
import { SpendingBudgetSummary } from "./spending-budget-summary";
import { SpendingLoading } from "./components/spending-loading";
import { SpendingDateView } from "./components/spending-date-view";
import { SpendingEmpty } from "./components/spending-empty";
import { SpendingEditModal } from "./components/spending-edit-modal";
import { SpendingBudgetView } from "./components/spending-budget-view";
import { SpendingDeleteModal } from "./components/spending-delete-modal";

interface SpendingManagementProps {
  periodId: string;
}

type ViewMode = 'date' | 'classification';

export function SpendingManagement({ periodId }: SpendingManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSpending, setCurrentSpending] = useState<Spending | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('date');
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  
  const currency = useCurrency();
  const { showToast } = useToast();
  const { register, handleSubmit: handleFormSubmit, reset, watch, control } = useForm<SpendingFormData>({
    defaultValues: {
      classificationId: "",
      description: "",
      amount: 0
    }
  });
  
  const { 
    useGetSpendingsByPeriod, 
    useCreateSpending,
    useUpdateSpending,
    useDeleteSpending
  } = useSpendingService();
  
  const { useGetBudgetsByPeriod } = useBudgetService();
  const { useGetAllClassifications } = useClassificationService();
  const { useGetAllPeriods } = usePeriodService();
  
  const { data: periods = [], isLoading: isPeriodsLoading } = 
    useGetAllPeriods();
    
  const activePeriodId = selectedPeriod?.id || periodId;
    
  const { data: spendings = [], isLoading: isSpendingsLoading } = 
    useGetSpendingsByPeriod(activePeriodId);
  
  const { data: budgets = [], isLoading: isBudgetsLoading } = 
    useGetBudgetsByPeriod(activePeriodId);
  
  const { data: classifications = [], isLoading: isClassificationsLoading } = 
    useGetAllClassifications();
  
  const createSpendingMutation = useCreateSpending();
  const updateSpendingMutation = useUpdateSpending();
  const deleteSpendingMutation = useDeleteSpending();
  
  useEffect(() => {
    if (!isPeriodsLoading && periods.length > 0) {
      const initialPeriod = periods.find(p => p.id === periodId) || periods[0];
      setSelectedPeriod(initialPeriod);
    }
  }, [periods, periodId, isPeriodsLoading]);
  
  const isLoading = isSpendingsLoading || isBudgetsLoading || 
                   isClassificationsLoading || isPeriodsLoading ||
                   createSpendingMutation.isPending || 
                   updateSpendingMutation.isPending || 
                   deleteSpendingMutation.isPending;
  
  const getClassification = (classificationId: string | number | undefined) => {
    if (!classificationId) return undefined;
    
    const idStr = classificationId.toString();
    return classifications.find(c => 
      c.secureId === idStr || c.id?.toString() === idStr
    );
  };
  
  const getBudget = (classificationId: string | number | undefined) => {
    if (!classificationId) return undefined;
    
    const idStr = classificationId.toString();
    return budgets.find(b => 
      b.classificationId === idStr || 
      b.classification?.secureId === idStr || 
      b.classification?.id?.toString() === idStr
    );
  };
  
  const spendingsByClassification = classifications.map(classification => {
    const classificationId = classification.secureId || classification.id;
    const classificationSpendings = spendings.filter(s => {
      const spendingClassId = s.classification?.secureId || s.classification?.id || s.classificationId;
      return spendingClassId === classificationId;
    });
    
    const totalSpent = classificationSpendings.reduce((sum, s) => sum + s.amount, 0);
    const budget = getBudget(classificationId);
    const budgetAmount = budget?.amount || 0;
    const remaining = budgetAmount - totalSpent;
    
    return {
      classification,
      spendings: classificationSpendings,
      totalSpent,
      budgetAmount,
      remaining,
      percentUsed: budgetAmount > 0 ? (totalSpent / budgetAmount) * 100 : 0
    };
  }).filter(item => item.spendings.length > 0 || item.budgetAmount > 0);
  
  const spendingsByDate = spendings.reduce((acc, spending) => {
    const date = new Date(spending.createdAt || new Date()).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(spending);
    return acc;
  }, {} as Record<string, Spending[]>);
  
  const sortedDates = Object.keys(spendingsByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  const handleAddNew = () => {
    reset({
      classificationId: classifications.length > 0 ? 
        (classifications[0].secureId || classifications[0].id?.toString() || "") : "",
      description: "",
      amount: 0
    });
    setCurrentSpending(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };
  
  const handleEdit = (spending: Spending) => {
    const classificationId = spending.classification?.secureId || 
                             spending.classification?.id?.toString() || 
                             spending.classificationId?.toString() || "";
    
    reset({
      classificationId,
      description: spending.description,
      amount: spending.amount
    });
    
    setCurrentSpending(spending);
    setIsEditMode(true);
    setIsModalOpen(true);
  };
  
  const handleSubmit = async (data: SpendingFormData) => {
    try {
      if (isEditMode && currentSpending) {
        await updateSpendingMutation.mutateAsync({
          id: currentSpending.secureId,
          data: {
            description: data.description,
            amount: data.amount,
            classificationId: data.classificationId
          }
        });
        showToast('Spending updated successfully', 'success');
      } else {
        await createSpendingMutation.mutateAsync({
          periodId: activePeriodId,
          classificationId: data.classificationId,
          description: data.description,
          amount: data.amount
        });
        showToast('Spending created successfully', 'success');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving spending:', error);
      showToast('Failed to save spending', 'error');
    }
  };
  const handleDelete = async () => {
    if (!deleteConfirmationId) return;
    
    try {
      await deleteSpendingMutation.mutateAsync(deleteConfirmationId);
      showToast('Spending deleted successfully', 'success');
      setDeleteConfirmationId(null);
    } catch (error) {
      console.error('Error deleting spending:', error);
      showToast('Failed to delete spending', 'error');
    }
  };
  
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpending = spendings.reduce((sum, spending) => sum + spending.amount, 0);
  const totalRemaining = totalBudget - totalSpending;
  const percentSpent = totalBudget > 0 ? (totalSpending / totalBudget) * 100 : 0;
  
  return (
    <>
      <SpendingHeader
        onAddNew={handleAddNew}
        isLoading={isLoading}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalSpent={totalSpending}
        totalRemaining={totalRemaining}
        currency={currency}
        periodName={selectedPeriod ? `${getMonthName(selectedPeriod.month)} ${selectedPeriod.year}` : ''}
      />
      
      <SpendingBudgetSummary
        totalBudget={totalBudget}
        totalSpent={totalSpending}
        totalRemaining={totalRemaining}
        percentSpent={percentSpent}
        currency={currency}
      />
      
      {isLoading ? (
        <SpendingLoading />
      ) : spendings.length === 0 ? (
        <SpendingEmpty onAddNew={handleAddNew} />
      ) : (
        <TabGroup defaultIndex={viewMode === 'date' ? 0 : 1}>
          <TabList className="flex space-x-2 rounded-lg bg-base-200 p-1 mb-6">
            <Tab 
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium rounded-md focus:outline-none ${
                  selected ? 'bg-primary text-white' : 'text-gray-600 hover:bg-base-300'
                }`
              }
              onClick={() => setViewMode('date')}
            >
              By Date
            </Tab>
            <Tab 
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium rounded-md focus:outline-none ${
                  selected ? 'bg-primary text-white' : 'text-gray-600 hover:bg-base-300'
                }`
              }
              onClick={() => setViewMode('classification')}
            >
              By Budget
            </Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel>
              <SpendingDateView
                sortedDates={sortedDates}
                spendingsByDate={spendingsByDate}
                getClassification={getClassification}
                getBudget={getBudget}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteConfirmationId(id)}
                currency={currency}
              />
            </TabPanel>
            
            <TabPanel>
              <SpendingBudgetView
                spendingsByClassification={spendingsByClassification}
                onEdit={handleEdit}
                onDelete={(id: string) => setDeleteConfirmationId(id)}
                currency={currency}
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      )}
      
      <SpendingEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        onSubmit={handleFormSubmit(handleSubmit)}
        isLoading={createSpendingMutation.isPending || updateSpendingMutation.isPending}
        register={register}
        watch={watch}
        control={control}
        classifications={classifications}
        currency={currency}
      />
      
      <SpendingDeleteModal
        isOpen={deleteConfirmationId !== null}
        onClose={() => setDeleteConfirmationId(null)}
        onDelete={handleDelete}
        isLoading={deleteSpendingMutation.isPending}
      />
    </>
  );
}

function getMonthName(month: number) {
  return new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' });
}

export interface SpendingFormData {
  classificationId: string;
  description: string;
  amount: number;
}