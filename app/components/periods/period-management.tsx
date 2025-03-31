import { useState, useMemo } from "react";
import { PlusIcon, PencilIcon, TrashIcon, ChartBarIcon, ChevronRightIcon, CalendarIcon, ChartPieIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { useToast } from "~/components/common/toast-context";
import { LoadingButton } from "~/components/auth/components/loading-button";
import { Modal } from "~/components/common/modal";
import { usePeriodService, type Period } from "~/hooks/use-period-service";
import { Link } from "react-router";
import { getMonthName } from "~/utils/date-utils";

function PeriodStatus({ isCurrentPeriod }: { isCurrentPeriod: boolean }) {
  return (
    <div className={`px-2 py-1 rounded-md text-xs font-medium inline-flex items-center ${
      isCurrentPeriod ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    }`}>
      {isCurrentPeriod ? 'Current' : 'Past'}
    </div>
  );
}

export function PeriodManagement() {
  const { showToast } = useToast();
  const { useGetAllPeriods, useCreatePeriod, useUpdatePeriod, useDeletePeriod } = usePeriodService();
  
  // Use React Query hooks
  const { data: periods = [], refetch } = useGetAllPeriods();
  const createPeriodMutation = useCreatePeriod();
  const updatePeriodMutation = useUpdatePeriod();
  const deletePeriodMutation = useDeletePeriod();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<Period | null>(null);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [expandedPeriodId, setExpandedPeriodId] = useState<string | null>(null);

  // Current date info
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Determine if a period is the current month/year
  const isCurrentPeriod = (period: Period) => {
    return period.month === currentMonth && period.year === currentYear;
  };
  
  // Check if current month period exists
  const hasCurrentMonthPeriod = useMemo(() => {
    return periods.some(period => isCurrentPeriod(period));
  }, [periods, currentMonth, currentYear]);
  
  // Sort periods by date (newest first)
  const sortedPeriods = [...periods].sort((a, b) => {
    // Sort by year descending, then by month descending
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
  
  // Group periods by year
  const periodsByYear = sortedPeriods.reduce<Record<number, Period[]>>((acc, period) => {
    if (!acc[period.year]) {
      acc[period.year] = [];
    }
    acc[period.year].push(period);
    return acc;
  }, {});
  
  // Sort years descending
  const years = Object.keys(periodsByYear).map(Number).sort((a, b) => b - a);

  const handleCreateOrUpdate = async () => {
    try {
      // Validate input
      if (formData.year < 1970 || formData.year > 9999) {
        showToast('Year must be between 1970 and 9999', 'error');
        return;
      }
      
      if (formData.month < 1 || formData.month > 12) {
        showToast('Month must be between 1 and 12', 'error');
        return;
      }
      
      if (isEditMode && currentPeriod) {
        await updatePeriodMutation.mutateAsync({ id: currentPeriod.id, data: formData });
        showToast('Period updated successfully', 'success');
      } else {
        // Check for duplicates
        const existingPeriod = periods.find(
          p => p.year === formData.year && p.month === formData.month
        );
        
        if (existingPeriod) {
          showToast('This period already exists', 'error');
          return;
        }
        
        await createPeriodMutation.mutateAsync(formData);
        showToast('Period created successfully', 'success');
      }
      
      // Reset and close modal
      handleCloseModal();
    } catch (error) {
      console.error('Error saving period:', error);
      showToast('Failed to save period', 'error');
    }
  };

  // Quick add current month period
  const handleAddCurrentMonth = async () => {
    try {
      await createPeriodMutation.mutateAsync({
        year: currentYear,
        month: currentMonth
      });
      showToast(`${getMonthName(currentMonth)} ${currentYear} added successfully`, 'success');
    } catch (error) {
      console.error('Error adding current month:', error);
      showToast('Failed to add current month period', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePeriodMutation.mutateAsync(id);
      showToast('Period deleted successfully', 'success');
      setDeleteConfirmationId(null);
    } catch (error) {
      console.error('Error deleting period:', error);
      showToast('Failed to delete period', 'error');
    }
  };

  const handleOpenCreateModal = () => {
    setFormData({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    });
    setIsEditMode(false);
    setCurrentPeriod(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (period: Period) => {
    setFormData({
      year: period.year,
      month: period.month,
    });
    setIsEditMode(true);
    setCurrentPeriod(period);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset after animation completes
    setTimeout(() => {
      setFormData({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      });
      setIsEditMode(false);
      setCurrentPeriod(null);
    }, 300);
  };

  // Toggle expanded state of a period
  const togglePeriodExpanded = (periodId: string) => {
    setExpandedPeriodId(expandedPeriodId === periodId ? null : periodId);
  };

  // Determine if any mutation is in progress
  const isLoading = 
    createPeriodMutation.isPending || 
    updatePeriodMutation.isPending || 
    deletePeriodMutation.isPending;

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Financial Periods</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Manage your monthly financial periods
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            {!hasCurrentMonthPeriod && (
              <button 
                className="btn btn-outline btn-success"
                onClick={handleAddCurrentMonth}
                disabled={isLoading}
              >
                <CalendarIcon className="w-5 h-5 mr-2" />
                Add Current Month
              </button>
            )}
            <button 
              className="btn btn-primary"
              onClick={handleOpenCreateModal}
              disabled={isLoading}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Period
            </button>
          </div>
        </div>
        
        {isLoading && periods.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading periods...</p>
          </div>
        ) : periods.length === 0 ? (
          <div className="text-center py-16 bg-base-100 rounded-lg shadow">
            <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-primary/10">
              <CalendarIcon className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No periods yet</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Create your first financial period to start budgeting and tracking your expenses
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button 
                className="btn btn-success"
                onClick={handleAddCurrentMonth}
                disabled={isLoading}
              >
                <CalendarIcon className="w-5 h-5 mr-2" />
                Add Current Month
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleOpenCreateModal}
                disabled={isLoading}
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Custom Period
              </button>
            </div>
          </div>
        ) : (
          <>
            {!hasCurrentMonthPeriod && (
              <div className="mb-6">
                <FancyCard className="border-l-4 border-info p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Current Month Not Found</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {getMonthName(currentMonth)} {currentYear} is not set up yet
                    </p>
                  </div>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={handleAddCurrentMonth}
                    disabled={isLoading}
                  >
                    Add Now
                  </button>
                </FancyCard>
              </div>
            )}
            
            <div className="space-y-6">
              {years.map(year => (
                <div key={year} className="space-y-3">
                  <h2 className="text-2xl font-semibold dark:text-gray-200 pl-1">{year}</h2>
                  
                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {periodsByYear[year].sort((a, b) => b.month - a.month).map((period) => (
                      <motion.div 
                        key={period.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                      >
                        <FancyCard className={`p-5 ${isCurrentPeriod(period) ? 'border-2 border-primary' : ''}`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-xl font-semibold">
                                {getMonthName(period.month)}
                              </h3>
                              {isCurrentPeriod(period) && (
                                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded">Current</span>
                              )}
                            </div>
                            <button
                              className={`btn btn-sm btn-circle btn-ghost transition-transform ${
                                expandedPeriodId === period.id ? 'rotate-90' : ''
                              }`}
                              onClick={() => togglePeriodExpanded(period.id)}
                            >
                              <ChevronRightIcon className="w-4 h-4" />
                            </button>
                          </div>

                          <AnimatePresence>
                            {expandedPeriodId === period.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-2 pb-4 space-y-3">
                                  <Link 
                                    to={`/budget?periodId=${period.id}`}
                                    className="flex items-center p-2 rounded-md hover:bg-base-200 transition"
                                  >
                                    <ChartBarIcon className="w-5 h-5 mr-2" />
                                    <span>Manage Budget</span>
                                  </Link>
                                  
                                  <Link 
                                    to={`/transactions?periodId=${period.id}`}
                                    className="flex items-center p-2 rounded-md hover:bg-base-200 transition"
                                  >
                                    <ArrowsRightLeftIcon className="w-5 h-5 mr-2" />
                                    <span>View Transactions</span>
                                  </Link>
                                  
                                  <Link 
                                    to={`/reports?periodId=${period.id}`}
                                    className="flex items-center p-2 rounded-md hover:bg-base-200 transition"
                                  >
                                    <ChartPieIcon className="w-5 h-5 mr-2" />
                                    <span>View Reports</span>
                                  </Link>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <div className="flex justify-between pt-2 mt-2 border-t border-base-300">
                            <div className="space-x-2">
                              <button
                                className="btn btn-sm btn-ghost"
                                onClick={() => handleOpenEditModal(period)}
                                disabled={isLoading}
                              >
                                <PencilIcon className="w-4 h-4 mr-1" />
                                Edit
                              </button>
                            </div>
                            
                            <button
                              className="btn btn-sm btn-ghost text-error"
                              onClick={() => setDeleteConfirmationId(period.id)}
                              disabled={isLoading}
                            >
                              <TrashIcon className="w-4 h-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </FancyCard>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Create/Edit Period Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditMode ? "Edit Period" : "Create New Period"}
        size="sm"
        closeOnClickOutside={!isLoading}
        footer={
          <>
            <button
              className="btn btn-ghost"
              onClick={handleCloseModal}
              disabled={isLoading}
            >
              Cancel
            </button>
            <LoadingButton
              className="btn btn-primary"
              onClick={handleCreateOrUpdate}
              isLoading={createPeriodMutation.isPending || updatePeriodMutation.isPending}
              loadingText={isEditMode ? "Updating..." : "Creating..."}
            >
              {isEditMode ? "Update" : "Create"}
            </LoadingButton>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Year</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2000 })}
              min="1970"
              max="9999"
            />
          </div>
          
          <div>
            <label className="label">
              <span className="label-text font-medium">Month</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {getMonthName(month)}
                </option>
              ))}
            </select>
          </div>
          
          <p className="text-sm text-gray-500 mt-2">
            {isEditMode 
              ? "Update this financial period for your records" 
              : "Create a new financial period for budgeting and expense tracking"}
          </p>
        </div>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmationId !== null}
        onClose={() => setDeleteConfirmationId(null)}
        title="Confirm Delete"
        size="sm"
        closeOnClickOutside={!deletePeriodMutation.isPending}
        footer={
          <>
            <button
              className="btn btn-ghost"
              onClick={() => setDeleteConfirmationId(null)}
              disabled={deletePeriodMutation.isPending}
            >
              Cancel
            </button>
            <LoadingButton
              className="btn btn-error"
              onClick={() => deleteConfirmationId && handleDelete(deleteConfirmationId)}
              isLoading={deletePeriodMutation.isPending}
              loadingText="Deleting..."
            >
              Delete
            </LoadingButton>
          </>
        }
      >
        <div className="py-2">
          <p>Are you sure you want to delete this period? This action cannot be undone.</p>
          <p className="text-sm text-error mt-2">
            Note: Deleting a period may affect associated budgets and transactions.
          </p>
        </div>
      </Modal>
    </>
  );
}