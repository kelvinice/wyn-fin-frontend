import React from "react";
import { Modal } from "~/components/common/modal";
import { LoadingButton } from "~/components/auth/components/loading-button";

interface BudgetCopyFromPreviousModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  previousPeriodName?: string;
  currentPeriodName?: string;
}

export function BudgetCopyFromPreviousModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  previousPeriodName = "previous period",
  currentPeriodName = "current period"
}: BudgetCopyFromPreviousModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isLoading && onClose()}
      title="Copy Budget From Previous Month"
      size="sm"
      footer={
        <>
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <LoadingButton
            className="btn btn-primary"
            onClick={handleConfirm}
            isLoading={isLoading}
            loadingText="Copying..."
          >
            Copy Budget
          </LoadingButton>
        </>
      }
    >
      <div>
        <p>
          Are you sure you want to copy all budget allocations from {previousPeriodName} to {currentPeriodName}?
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Existing budget allocations for the current period will remain unchanged.
        </p>
      </div>
    </Modal>
  );
}