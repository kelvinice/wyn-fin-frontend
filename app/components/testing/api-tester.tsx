import { useState, useEffect } from "react";
import { useFetcher } from "react-router";
import { LoadingButton } from "~/components/auth/components/loading-button";
import { useToast } from "~/components/common/toast-context";
import TestService from "~/services/test-service";

export function ApiTester() {
  const { showToast } = useToast();
  const [pingResponse, setPingResponse] = useState<string | null>(null);
  const [pingLoading, setPingLoading] = useState(false);
  const [pingError, setPingError] = useState<string | null>(null);
  
  // For the action ping test
  const pingFetcher = useFetcher();
  const [pingActionResponse, setPingActionResponse] = useState<string | null>(null);
  
  // Function to test the ping endpoint via GET
  const testPingEndpoint = async () => {
    setPingLoading(true);
    setPingError(null);
    setPingResponse(null);
    
    try {
      const testService = new TestService();
      const response = await testService.ping();
      setPingResponse(response.message || 'Response received but no message');
      showToast(`API responded: ${response.message}`, 'success');
    } catch (error) {
      console.error('Ping endpoint error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to API';
      setPingError(errorMessage);
      showToast(`API connection failed: ${errorMessage}`, 'error');
    } finally {
      setPingLoading(false);
    }
  };
  
  // Function to test the ping endpoint via POST (action)
  const testPingAction = () => {
    setPingActionResponse(null);
    
    pingFetcher.submit(
      {}, // Empty form data
      { method: 'post', action: '/api/ping' }
    );
  };
  
  // Update state when ping action response changes
  useEffect(() => {
    if (pingFetcher.data && pingFetcher.state === 'idle') {
      setPingActionResponse(JSON.stringify(pingFetcher.data, null, 2));
    }
  }, [pingFetcher.data, pingFetcher.state]);
  
  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">Test endpoint:</span>
          <code className="bg-base-200 px-2 py-1 rounded text-sm">/ping</code>
        </div>
        
        {pingResponse && (
          <div className="bg-success/10 border border-success/30 rounded-lg p-3">
            <p className="text-sm font-medium">Response:</p>
            <code className="block mt-1 text-success-content bg-success/5 dark:bg-success p-2 rounded">
              {pingResponse}
            </code>
          </div>
        )}
        
        {pingError && (
          <div className="bg-error/10 border border-error/30 rounded-lg p-3">
            <p className="text-sm font-medium">Error:</p>
            <code className="block mt-1 text-error-content bg-error/5 dark:bg-error p-2 rounded">
              {pingError}
            </code>
          </div>
        )}
        
        <LoadingButton 
          isLoading={pingLoading} 
          loadingText="Connecting..."
          className="btn btn-primary w-full"
          onClick={testPingEndpoint}
        >
          Test API Connection (GET)
        </LoadingButton>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          This will attempt to connect to the backend API at {import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/'}
        </p>
      </div>
    </>
  );
}

export function ApiActionTester() {
  const pingFetcher = useFetcher();
  const [pingActionResponse, setPingActionResponse] = useState<string | null>(null);
  
  // Function to test the ping endpoint via POST (action)
  const testPingAction = () => {
    setPingActionResponse(null);
    
    pingFetcher.submit(
      {}, // Empty form data
      { method: 'post', action: '/api/ping' }
    );
  };
  
  // Update state when ping action response changes
  useEffect(() => {
    if (pingFetcher.data && pingFetcher.state === 'idle') {
      setPingActionResponse(JSON.stringify(pingFetcher.data, null, 2));
    }
  }, [pingFetcher.data, pingFetcher.state]);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-300">Test action endpoint:</span>
        <code className="bg-base-200 px-2 py-1 rounded text-sm">/api/ping</code>
      </div>
      
      {pingActionResponse && (
        <div className="bg-info/10 border border-info/30 rounded-lg p-3">
          <p className="text-sm font-medium">Response:</p>
          <pre className="block mt-1 bg-info/3 p-2 rounded text-xs overflow-auto">
            {pingActionResponse}
          </pre>
        </div>
      )}
      
      <LoadingButton 
        isLoading={pingFetcher.state !== 'idle'} 
        loadingText="Submitting..."
        className="btn btn-accent w-full"
        onClick={testPingAction}
      >
        Test React Router Action (POST)
      </LoadingButton>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        This will test the action handler in the /api/ping route using React Router's action system
      </p>
    </div>
  );
}