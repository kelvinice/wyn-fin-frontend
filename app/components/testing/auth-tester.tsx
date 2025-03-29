import { useState } from "react";
import clsx from "clsx";
import { LoadingButton } from "~/components/auth/components/loading-button";
import { useToast } from "~/components/common/toast-context";
import { useTestService } from "~/hooks/use-service";

export function AuthTester() {
  const { showToast } = useToast();
  const [userData, setUserData] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [tokenStatus, setTokenStatus] = useState<string | null>(null);
  
  // Use the service hook instead of creating a new service with explicit token
  const testService = useTestService();
  
  // Function to test the me endpoint
  const testMeEndpoint = async () => {
    setUserLoading(true);
    setUserError(null);
    setUserData(null);
    setTokenStatus(null);
    
    try {
      const response = await testService.getMe();
      setUserData(response.user);
      setTokenStatus(response.tokenStatus);
      
      if (response.tokenStatus === 'valid') {
        showToast('Successfully retrieved user data', 'success');
      } else if (response.tokenStatus === 'expired') {
        showToast('Your token has expired. Please login again.', 'warning');
      } else {
        showToast('Authentication status unknown', 'info');
      }
    } catch (error) {
      console.error('User data endpoint error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve user data';
      setUserError(errorMessage);
      showToast(`Authentication failed: ${errorMessage}`, 'error');
    } finally {
      setUserLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-300">Test endpoint:</span>
        <code className="bg-base-200 px-2 py-1 rounded text-sm">/me</code>
      </div>
      
      {tokenStatus && (
        <div className={`
          ${tokenStatus === 'valid' 
            ? 'bg-success/10 dark:bg-success/20 border-success/30 dark:border-success/40' 
            : 'bg-warning/10 dark:bg-warning/20 border-warning/30 dark:border-warning/40'} 
          border rounded-lg p-3`}>
          <p className="text-sm font-medium">Token Status:</p>
          <div className="mt-1 flex items-center gap-2">
            {/* Status indicator dot */}
            <div className={clsx(
              "w-2.5 h-2.5 rounded-full relative",
              {
                "bg-success": tokenStatus === 'valid',
                "bg-warning": tokenStatus !== 'valid'
              }
            )}>
              {/* Animated ping effect */}
              <span className={clsx(
                "absolute inline-flex h-full w-full rounded-full opacity-75",
                {
                  "animate-ping bg-success/50": tokenStatus === 'valid',
                  "animate-ping bg-warning/50": tokenStatus !== 'valid'
                }
              )}></span>
            </div>
            
            {/* Status text */}
            <span className={clsx(
              "font-medium",
              {
                "text-success": tokenStatus === 'valid',
                "text-warning": tokenStatus !== 'valid'
              }
            )}>
              {tokenStatus === 'valid' ? 'Valid' : tokenStatus === 'expired' ? 'Expired' : tokenStatus}
            </span>
          </div>
        </div>
      )}
      
      {userData && (
        <div className="bg-info/10 border border-info/30 rounded-lg p-3">
          <p className="text-sm font-medium">User Data:</p>
          <pre className="mt-1 bg-info/5 p-2 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      )}
      
      {userError && (
        <div className="bg-error/10 border border-error/30 rounded-lg p-3">
          <p className="text-sm font-medium">Error:</p>
          <code className="block mt-1 text-error-content bg-error/5 p-2 rounded">
            {userError}
          </code>
        </div>
      )}
      
      <LoadingButton 
        isLoading={userLoading} 
        loadingText="Authenticating..."
        className="btn btn-primary w-full"
        onClick={testMeEndpoint}
      >
        Test Authentication
      </LoadingButton>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        This will attempt to retrieve the current user's data using the auth token
      </p>
    </div>
  );
}