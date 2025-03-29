import { useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { useToast } from "~/components/common/toast-context";
import { LoadingButton } from "~/components/auth/components/loading-button";
import { Modal } from "~/components/common/modal";
import { usePeriodService, type Period } from "~/hooks/use-period-service";

// Month name utility
const getMonthName = (month: number) => {
  return new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' });
};

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
          
          <div className="mt-4 md:mt-0">
            <button 
              className="btn btn-primary btn-sm"
              onClick={handleOpenCreateModal}
              disabled={isLoading}
            >
              <PlusIcon className="w-5 h-5 mr-1" />
              Add Period
            </button>
          </div>
        </div>
        
        <FancyCard className="p-6">
          {isLoading && periods.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading periods...</p>
            </div>
          ) : periods.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No financial periods have been added yet</p>
              <button 
                className="btn btn-outline btn-primary"
                onClick={handleOpenCreateModal}
              >
                Create your first period
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Period</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {periods.map((period) => (
                    <tr key={period.id}>
                      <td className="font-medium">
                        {getMonthName(period.month)} {period.year}
                      </td>
                      <td className="flex justify-end gap-2">
                        <button
                          className="btn btn-ghost btn-sm btn-circle"
                          onClick={() => handleOpenEditModal(period)}
                          disabled={isLoading}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm btn-circle text-error"
                          onClick={() => setDeleteConfirmationId(period.id)}
                          disabled={isLoading}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </FancyCard>
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