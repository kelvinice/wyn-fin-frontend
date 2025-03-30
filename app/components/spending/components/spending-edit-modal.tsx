import { Modal } from "~/components/common/modal";
import { LoadingButton } from "~/components/auth/components/loading-button";

import type { UseFormRegister, UseFormWatch, Control } from "react-hook-form";
import type { Classification } from "~/hooks/use-classification-service";
import type { SpendingFormData } from "../spending-management";
import { SpendingForm } from "../spending-form";

interface SpendingEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  onSubmit: () => void;
  isLoading: boolean;
  register: UseFormRegister<SpendingFormData>;
  watch: UseFormWatch<SpendingFormData>;
  control: Control<SpendingFormData>;
  classifications: Classification[];
  currency: string;
}

export function SpendingEditModal({
  isOpen,
  onClose,
  isEditMode,
  onSubmit,
  isLoading,
  register,
  watch,
  control,
  classifications,
  currency
}: SpendingEditModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Spending" : "Add Spending"}
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
            onClick={onSubmit}
            isLoading={isLoading}
            loadingText={isEditMode ? "Updating..." : "Adding..."}
          >
            {isEditMode ? "Update" : "Add"}
          </LoadingButton>
        </>
      }
    >
      <SpendingForm 
        register={register}
        watch={watch}
        control={control}
        classifications={classifications}
        isLoading={isLoading}
        currency={currency}
      />
    </Modal>
  );
}