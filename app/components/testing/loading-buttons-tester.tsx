import { useState } from "react";
import { LoadingButton } from "~/components/auth/components/loading-button";

export function LoadingButtonsTester() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to simulate loading state
  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };
  
  return (
    <div className="space-y-3">
      <LoadingButton 
        isLoading={isLoading} 
        className="btn btn-primary w-full"
        onClick={simulateLoading}
      >
        Primary Button
      </LoadingButton>
      
      <LoadingButton 
        isLoading={isLoading} 
        className="btn btn-outline w-full"
        onClick={simulateLoading}
      >
        Outline Button
      </LoadingButton>
      
      <LoadingButton 
        isLoading={isLoading} 
        className="btn btn-secondary w-full"
        onClick={simulateLoading}
        loadingText="Custom Loading Text..."
      >
        Custom Loading Text
      </LoadingButton>
    </div>
  );
}