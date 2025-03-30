import { Modal } from "~/components/common/modal";
import { LoadingButton } from "~/components/auth/components/loading-button";

interface BudgetDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  isLoading: boolean;
}

export function BudgetDeleteModal({
  isOpen,
  onClose,
  onDelete,
  isLoading
}: BudgetDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Delete"
      size="sm"
      closeOnClickOutside={!isLoading}
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
            className="btn btn-error"
            onClick={onDelete}
            isLoading={isLoading}
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
  );
}