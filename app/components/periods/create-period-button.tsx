import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Modal } from "~/components/common/modal";
import { LoadingButton } from "~/components/auth/components/loading-button";
import { useToast } from "~/components/common/toast-context";
import { usePeriodService } from "~/hooks/use-period-service";

interface CreatePeriodButtonProps {
  onPeriodCreated?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "ghost" | "outline";
  label?: string;
  showIcon?: boolean;
}

export function CreatePeriodButton({
  onPeriodCreated,
  className = "",
  size = "md",
  variant = "primary",
  label = "Add Period",
  showIcon = true,
}: CreatePeriodButtonProps) {
  const { showToast } = useToast();
  const { createPeriod } = usePeriodService();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const handleOpenModal = () => {
    setFormData({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreatePeriod = async () => {
    try {
      setLoading(true);
      
      // Validate input
      if (formData.year < 1970 || formData.year > 9999) {
        showToast('Year must be between 1970 and 9999', 'error');
        return;
      }
      
      if (formData.month < 1 || formData.month > 12) {
        showToast('Month must be between 1 and 12', 'error');
        return;
      }

      await createPeriod(formData);
      
      showToast('Period created successfully', 'success');
      handleCloseModal();
      
      if (onPeriodCreated) {
        onPeriodCreated();
      }
    } catch (error) {
      console.error('Error creating period:', error);
      showToast('Failed to create period', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Get month name utility
  const getMonthName = (month: number) => {
    return new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' });
  };

  const buttonSizeClass = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  }[size];

  const buttonVariantClass = {
    primary: "btn-primary",
    ghost: "btn-ghost",
    outline: "btn-outline btn-primary",
  }[variant];

  return (
    <>
      <button 
        className={`btn ${buttonSizeClass} ${buttonVariantClass} ${className}`}
        onClick={handleOpenModal}
      >
        {showIcon && <PlusIcon className="w-5 h-5 mr-1" />}
        {label}
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create New Period"
        size="sm"
        closeOnClickOutside={!loading}
        footer={
          <>
            <button
              className="btn btn-ghost"
              onClick={handleCloseModal}
              disabled={loading}
            >
              Cancel
            </button>
            <LoadingButton
              className="btn btn-primary"
              onClick={handleCreatePeriod}
              isLoading={loading}
              loadingText="Creating..."
            >
              Create
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
            Create a new financial period for budgeting and expense tracking
          </p>
        </div>
      </Modal>
    </>
  );
}