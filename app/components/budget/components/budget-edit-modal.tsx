import { Modal } from "~/components/common/modal";
import { LoadingButton } from "~/components/auth/components/loading-button";
import { BudgetForm, type BudgetFormData } from "../budget-form";
import type { UseFormRegister, UseFormWatch } from "react-hook-form";
import type { Classification } from "~/models/classification";

interface BudgetEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  onSubmit: () => void;
  isLoading: boolean;
  register: UseFormRegister<BudgetFormData>;
  watch: UseFormWatch<BudgetFormData>;
  availableClassifications: Classification[];
  getClassification: (id: string | number | undefined) => Classification | undefined;
  currency: string;
}

export function BudgetEditModal({
  isOpen,
  onClose,
  isEditMode,
  onSubmit,
  isLoading,
  register,
  watch,
  availableClassifications,
  getClassification,
  currency
}: BudgetEditModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Budget Allocation" : "New Budget Allocation"}
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
            loadingText={isEditMode ? "Updating..." : "Creating..."}
          >
            {isEditMode ? "Update" : "Create"}
          </LoadingButton>
        </>
      }
    >
      <BudgetForm 
        register={register}
        watch={watch}
        availableClassifications={availableClassifications}
        currentClassificationId={watch("classificationId")}
        isEditMode={isEditMode}
        getClassification={getClassification}
        currency={currency}
        isLoading={isLoading}
      />
    </Modal>
  );
}