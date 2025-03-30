import { useState } from "react";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { Modal } from "~/components/common/modal";
import { LoadingButton } from "~/components/auth/components/loading-button";
import { useForm } from "react-hook-form";
import { usePeriodService, type Period } from "~/hooks/use-period-service";

interface CopyBudgetButtonProps {
  currentPeriodId: string;
  onCopy: (sourcePeriodId: string) => Promise<void>;
  disabled?: boolean;
}

interface CopyFormData {
  sourcePeriodId: string;
}

// Function to format period name
function formatPeriodName(period: Period): string {
  const monthName = new Date(2000, period.month - 1).toLocaleString('default', { month: 'long' });
  return `${monthName} ${period.year}`;
}

export function CopyBudgetButton({ currentPeriodId, onCopy, disabled }: CopyBudgetButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch } = useForm<CopyFormData>({
    defaultValues: { sourcePeriodId: "" }
  });
  
  const { useGetAllPeriods } = usePeriodService();
  const { data: periods = [] } = useGetAllPeriods();
  
  // Filter out current period
  const availablePeriods = periods.filter(p => p.id !== currentPeriodId);
  
  // Format periods for display
  const formattedPeriods = availablePeriods.map(p => ({
    id: p.id,
    name: formatPeriodName(p)
  }));
  
  const handleCopySubmit = async (data: CopyFormData) => {
    if (!data.sourcePeriodId) return;
    
    setIsLoading(true);
    try {
      await onCopy(data.sourcePeriodId);
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <button
        className="btn btn-outline btn-sm"
        onClick={() => setIsModalOpen(true)}
        disabled={disabled || availablePeriods.length === 0}
      >
        <ClipboardDocumentListIcon className="w-4 h-4 mr-1" />
        Copy from Period
      </button>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isLoading && setIsModalOpen(false)}
        title="Copy Budget from Another Period"
        size="sm"
        footer={
          <>
            <button
              className="btn btn-ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
            <LoadingButton
              className="btn btn-primary"
              onClick={handleSubmit(handleCopySubmit)}
              isLoading={isLoading}
              loadingText="Copying..."
            >
              Copy Budget
            </LoadingButton>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Source Period</span>
            </label>
            <select
              className="select select-bordered w-full"
              {...register("sourcePeriodId", { required: true })}
            >
              <option value="" disabled>Select a period</option>
              {formattedPeriods.map(period => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="pt-2">
            <p className="text-sm text-gray-500">
              This will copy all budget allocations from the selected period. 
              Existing budget allocations for the current period will remain unchanged.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}