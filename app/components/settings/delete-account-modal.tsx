import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Modal } from "~/components/common/modal";
import { LoadingButton } from "~/components/auth/components/loading-button";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  deleteConfirmText: string;
  setDeleteConfirmText: (text: string) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  deleteConfirmText,
  setDeleteConfirmText,
  onConfirm,
  isDeleting
}: DeleteAccountModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isDeleting) {
          onClose();
        }
      }}
      title="Delete Account"
      size="md"
      closeOnClickOutside={!isDeleting}
      footer={
        <>
          <button 
            className="btn btn-ghost"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <LoadingButton
            className="btn btn-error"
            onClick={onConfirm}
            isLoading={isDeleting}
            loadingText="Deleting..."
          >
            Delete Permanently
          </LoadingButton>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-error/10 border border-error/20 rounded-lg">
          <ExclamationTriangleIcon className="w-6 h-6 text-error flex-shrink-0" />
          <p className="text-sm">
            This action cannot be undone. All your data, including financial records, budgets, and preferences will be permanently deleted.
          </p>
        </div>
        
        <p className="text-sm">
          To confirm, please type <span className="font-mono font-medium">delete my account</span> below:
        </p>
        
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="delete my account"
          value={deleteConfirmText}
          onChange={(e) => setDeleteConfirmText(e.target.value)}
          disabled={isDeleting}
        />
      </div>
    </Modal>
  );
}