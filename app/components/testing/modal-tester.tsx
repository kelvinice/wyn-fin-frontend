import { useState } from "react";
import { Modal } from "~/components/common/modal";
import { DeleteAccountModal } from "~/components/settings/delete-account-modal";
import { useToast } from "~/components/common/toast-context";

export function ModalTester() {
  const { showToast } = useToast();
  // Basic modal states
  const [isSimpleModalOpen, setIsSimpleModalOpen] = useState(false);
  const [isLargeModalOpen, setIsLargeModalOpen] = useState(false);
  
  // Delete account modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDeleteConfirm = async () => {
    if (deleteConfirmText !== 'delete my account') {
      showToast("Please type 'delete my account' to confirm", "error");
      return;
    }
    
    setIsDeleting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      showToast("Account deletion simulated!", "success");
      setDeleteConfirmText("");
    }, 2000);
  };
  
  return (
    <div className="space-y-4">
      <p className="text-gray-600 dark:text-gray-300">
        Test various modal components and configurations:
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        <button 
          className="btn btn-primary"
          onClick={() => setIsSimpleModalOpen(true)}
        >
          Simple Modal
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={() => setIsLargeModalOpen(true)}
        >
          Large Modal
        </button>
        
        <button
          className="btn btn-error col-span-2"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete Account Modal
        </button>
      </div>
      
      {/* Simple Modal */}
      <Modal
        isOpen={isSimpleModalOpen}
        onClose={() => setIsSimpleModalOpen(false)}
        title="Simple Modal"
        size="sm"
        footer={
          <button 
            className="btn btn-primary"
            onClick={() => setIsSimpleModalOpen(false)}
          >
            Close
          </button>
        }
      >
        <p>This is a simple modal with basic content.</p>
      </Modal>
      
      {/* Large Modal with proper scrolling */}
      <Modal
        isOpen={isLargeModalOpen}
        onClose={() => setIsLargeModalOpen(false)}
        title="Large Modal with Scrollable Content"
        size="lg"
        maxHeight="70vh"
        footer={
          <>
            <button 
              className="btn btn-ghost"
              onClick={() => setIsLargeModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => {
                showToast("Action confirmed!", "success");
                setIsLargeModalOpen(false);
              }}
            >
              Confirm Action
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p>This is a larger modal with scrollable content.</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam 
            pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet 
            hendrerit risus, sed porttitor quam.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam 
            pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet 
            hendrerit risus, sed porttitor quam.
          </p>
          <p>
            Aenean vel leo eget massa sollicitudin venenatis eu id nibh. Donec 
            lorem ipsum, rhoncus a dui eget, facilisis molestie ipsum.
          </p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora, ut ad! Necessitatibus, expedita repudiandae nostrum doloremque placeat ut? Reprehenderit ea non maxime delectus earum deleniti eveniet consequatur quia obcaecati consectetur.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita doloremque inventore ducimus nemo. Et, ratione quia. Impedit labore velit modi pariatur soluta aliquid temporibus ex molestias fugiat, sequi tenetur quidem.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam possimus minus ab expedita ducimus accusantium porro molestias, fugiat, minima ad animi dolorum laborum saepe eligendi dicta aperiam pariatur nam ea.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. A accusantium voluptates fugiat aliquid quae ad, maxime ut omnis enim facere libero. Iste iusto eveniet perferendis in error facere soluta quasi.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Temporibus velit fuga aspernatur reiciendis modi et odio, adipisci numquam veniam error, eaque deleniti enim iure quibusdam fugiat necessitatibus nam nulla. Saepe!
          </p>
          <p>
            Try scrolling this content to test the modal's scrollable behavior.
          </p>
        </div>
      </Modal>
      
      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteConfirmText("");
        }}
        deleteConfirmText={deleteConfirmText}
        setDeleteConfirmText={setDeleteConfirmText}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}