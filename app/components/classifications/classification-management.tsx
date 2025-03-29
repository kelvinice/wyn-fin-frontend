import { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { useToast } from "~/components/common/toast-context";
import { LoadingButton } from "~/components/auth/components/loading-button";
import { Modal } from "~/components/common/modal";
import { useClassificationService } from "~/hooks/use-classification-service";

export interface Classification {
  id: string;
  name: string;
  color?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function ClassificationManagement() {
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentClassification, setCurrentClassification] = useState<Classification | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    color: "#3b82f6" // Default blue color
  });
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  
  const { showToast } = useToast();
  const {
    getAllClassifications,
    createClassification,
    updateClassification,
    deleteClassification
  } = useClassificationService();
  
  // Load classifications on component mount
  useEffect(() => {
    loadClassifications();
  }, []);
  
  // Load all classifications
  const loadClassifications = async () => {
    try {
      setIsLoading(true);
      const response = await getAllClassifications();
      
      // Extract the classifications array from the response
      // Handle both possible response formats
      const data = Array.isArray(response) 
        ? response 
        : (response.data || []);
        
      setClassifications(data);
    } catch (error) {
      console.error('Error loading classifications:', error);
      showToast('Failed to load classifications', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Open modal to create new classification
  const handleAddNew = () => {
    setFormData({
      name: "",
      color: "#3b82f6"
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };
  
  // Open modal to edit classification
  const handleEdit = (classification: Classification) => {
    setFormData({
      name: classification.name,
      color: classification.color || "#3b82f6"
    });
    setCurrentClassification(classification);
    setIsEditMode(true);
    setIsModalOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (isEditMode && currentClassification) {
        // Update existing classification
        await updateClassification(currentClassification.id, {
          name: formData.name,
          color: formData.color
        });
        showToast('Classification updated successfully', 'success');
      } else {
        // Create new classification
        await createClassification({
          name: formData.name,
          color: formData.color
        });
        showToast('Classification created successfully', 'success');
      }
      
      // Reload classifications and close modal
      await loadClassifications();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving classification:', error);
      showToast('Failed to save classification', 'error');
    }
  };
  
  // Handle delete confirmation
  const handleDelete = async (id: string) => {
    try {
      await deleteClassification(id);
      showToast('Classification deleted successfully', 'success');
      await loadClassifications();
      setDeleteConfirmationId(null);
    } catch (error) {
      console.error('Error deleting classification:', error);
      showToast('Failed to delete classification', 'error');
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Classifications</h2>
        <button 
          className="btn btn-primary btn-sm"
          onClick={handleAddNew}
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          New Classification
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : classifications.length === 0 ? (
        <FancyCard className="p-6 text-center">
          <p className="text-gray-500">No classifications found</p>
          <button 
            className="btn btn-primary btn-sm mt-4"
            onClick={handleAddNew}
          >
            Create your first classification
          </button>
        </FancyCard>
      ) : (
        <div className="grid gap-4">
          {classifications.map((classification) => (
            <FancyCard key={classification.id} className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full" 
                    style={{ backgroundColor: classification.color || "#3b82f6" }}
                  ></div>
                  <span className="font-medium">{classification.name}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    className="btn btn-ghost btn-sm btn-square"
                    onClick={() => handleEdit(classification)}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  
                  <button 
                    className="btn btn-ghost btn-sm btn-square text-error"
                    onClick={() => setDeleteConfirmationId(classification.id)}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </FancyCard>
          ))}
        </div>
      )}
      
      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? "Edit Classification" : "New Classification"}
        size="sm"
        footer={
          <>
            <button
              className="btn btn-ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <LoadingButton
              className="btn btn-primary"
              onClick={handleSubmit}
              isLoading={false}
            >
              {isEditMode ? "Update" : "Create"}
            </LoadingButton>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label text-sm font-medium">Name</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Essential, Discretionary, Savings"
            />
          </div>
          
          <div>
            <label className="label text-sm font-medium">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="input h-10 w-16 p-1 cursor-pointer"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
              <input
                type="text"
                className="input input-bordered flex-1"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="#hex color"
              />
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-sm text-gray-500">
              {isEditMode 
                ? "Update this classification for categorizing budget items" 
                : "Create a new classification for categorizing budget items"}
            </p>
          </div>
        </div>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmationId !== null}
        onClose={() => setDeleteConfirmationId(null)}
        title="Confirm Delete"
        size="sm"
        footer={
          <>
            <button
              className="btn btn-ghost"
              onClick={() => setDeleteConfirmationId(null)}
            >
              Cancel
            </button>
            <LoadingButton
              className="btn btn-error"
              onClick={() => deleteConfirmationId && handleDelete(deleteConfirmationId)}
              isLoading={false}
            >
              Delete
            </LoadingButton>
          </>
        }
      >
        <p>Are you sure you want to delete this classification? This cannot be undone.</p>
      </Modal>
    </div>
  );
}