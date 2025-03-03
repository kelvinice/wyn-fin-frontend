import { useToast } from "~/components/common/toast-context";

export function ToastTester() {
  const { showToast } = useToast();
  
  return (
    <div className="grid grid-cols-2 gap-3">
      <button 
        className="btn btn-success btn-sm"
        onClick={() => showToast("Success notification example", "success")}
      >
        Success Toast
      </button>
      
      <button 
        className="btn btn-error btn-sm"
        onClick={() => showToast("Error notification example", "error")}
      >
        Error Toast
      </button>
      
      <button 
        className="btn btn-warning btn-sm"
        onClick={() => showToast("Warning notification example", "warning")}
      >
        Warning Toast
      </button>
      
      <button 
        className="btn btn-info btn-sm"
        onClick={() => showToast("Information notification example", "info", 6000)}
      >
        Info Toast
      </button>
      
      <button 
        className="btn btn-primary btn-sm col-span-2"
        onClick={() => showToast("This is a long notification message that will demonstrate how text wrapping works in toast messages.", "info", 6000)}
      >
        Long Toast Message
      </button>
    </div>
  );
}