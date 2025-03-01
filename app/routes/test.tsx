import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/home";
import { useToast } from "~/components/common/toast-context";
import { LoadingButton } from "~/components/auth/components/loading-button";
import { FancyCard } from "~/components/common/cards/card";
import { TiltAble } from "~/components/common/tiltable";
import TestService from "~/services/test-service";
import { ThemeSwitcher } from "~/components/common/theme-switcher";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "UI Component Testing | WynFin" },
    { name: "description", content: "Test page for UI components" },
  ];
}

export default function TestPage() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pingResponse, setPingResponse] = useState<string | null>(null);
  const [pingLoading, setPingLoading] = useState(false);
  const [pingError, setPingError] = useState<string | null>(null);
  
  // States for user data
  const [userData, setUserData] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [tokenStatus, setTokenStatus] = useState<string | null>(null);
  
  // Function to simulate loading state
  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };
  
  // Function to test the ping endpoint
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
  
  // Function to test the me endpoint
  const testMeEndpoint = async () => {
    setUserLoading(true);
    setUserError(null);
    setUserData(null);
    setTokenStatus(null);
    
    try {
      const testService = new TestService();
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
    <div className="min-h-screen bg-base-100">
      {/* Header with navigation and theme switcher */}
      <header className="bg-base-200 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="btn btn-sm btn-outline">
              ← Back to home
            </Link>
            <h1 className="text-xl font-bold hidden md:block">UI Component Testing</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </header>
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 md:hidden">UI Component Testing</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
            Use this page to test various UI components in isolation. You can also use the theme switcher in the header to toggle between light and dark mode.
          </p>
        </div>
        
        {/* Sections divided by category */}
        <div className="space-y-12">
          {/* UI Components Section */}
          <section>
            <div className="border-b border-base-300 pb-2 mb-6">
              <h2 className="text-2xl font-bold">UI Components</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Toast notifications section */}
              <FancyCard className="p-6">
                <h2 className="text-xl font-semibold mb-4">Toast Notifications</h2>
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
              </FancyCard>
              
              {/* Loading buttons section */}
              <FancyCard className="p-6">
                <h2 className="text-xl font-semibold mb-4">Loading Buttons</h2>
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
              </FancyCard>
              
              {/* TiltAble section */}
              <FancyCard className="p-6">
                <h2 className="text-xl font-semibold mb-4">Tilt Effect</h2>
                <div className="flex justify-center">
                  <TiltAble className="w-48 h-48" tiltMaxDegrees={20}>
                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center p-4 text-primary-content">
                      <p className="text-center font-medium">Hover over me to see the tilt effect</p>
                    </div>
                  </TiltAble>
                </div>
              </FancyCard>
              
              {/* Theme Switcher Testing */}
              <FancyCard className="p-6">
                <h2 className="text-xl font-semibold mb-4">Theme Switcher</h2>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Test the theme switcher component in isolated context:
                  </p>
                  <div className="flex justify-center items-center bg-base-200 rounded-lg p-6">
                    <ThemeSwitcher className="scale-150" />
                  </div>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Click to toggle between light and dark mode
                  </p>
                </div>
              </FancyCard>
            </div>
          </section>
          
          {/* API Testing Section */}
          <section>
            <div className="border-b border-base-300 pb-2 mb-6">
              <h2 className="text-2xl font-bold">API Testing</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* API Test section */}
              <FancyCard className="p-6">
                <h2 className="text-xl font-semibold mb-4">API Connection Test</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Test endpoint:</span>
                    <code className="bg-base-200 px-2 py-1 rounded text-sm">/ping</code>
                  </div>
                  
                  {pingResponse && (
                    <div className="bg-success/10 border border-success/30 rounded-lg p-3">
                      <p className="text-sm font-medium">Response:</p>
                      <code className="block mt-1 text-success-content bg-success/5 p-2 rounded">
                        {pingResponse}
                      </code>
                    </div>
                  )}
                  
                  {pingError && (
                    <div className="bg-error/10 border border-error/30 rounded-lg p-3">
                      <p className="text-sm font-medium">Error:</p>
                      <code className="block mt-1 text-error-content bg-error/5 p-2 rounded">
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
                    Test API Connection
                  </LoadingButton>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    This will attempt to connect to the backend API at {import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/'}
                  </p>
                </div>
              </FancyCard>
              
              {/* User Authentication Test section */}
              <FancyCard className="p-6">
                <h2 className="text-xl font-semibold mb-4">User Authentication Test</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Test endpoint:</span>
                    <code className="bg-base-200 px-2 py-1 rounded text-sm">/me</code>
                  </div>
                  
                  {tokenStatus && (
                    <div className={`
                      ${tokenStatus === 'valid' ? 'bg-success/10 border-success/30' : 'bg-warning/10 border-warning/30'} 
                      border rounded-lg p-3`}>
                      <p className="text-sm font-medium">Token Status:</p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${tokenStatus === 'valid' ? 'bg-success' : 'bg-warning'}`}></div>
                        <span className={tokenStatus === 'valid' ? 'text-success' : 'text-warning'}>
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
              </FancyCard>
            </div>
          </section>
          
          {/* Design System Section */}
          <section>
            <div className="border-b border-base-300 pb-2 mb-6">
              <h2 className="text-2xl font-bold">Design System</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Color palette section */}
              <FancyCard className="p-6">
                <h2 className="text-xl font-semibold mb-4">Color Palette</h2>
                <div className="grid grid-cols-2 gap-2">
                  {["primary", "secondary", "accent", "info", "success", "warning", "error"].map((color) => (
                    <div key={color} className={`btn btn-${color} p-3 rounded-md text-${color}-content`}>
                      {color}
                    </div>
                  ))}
                </div>
              </FancyCard>
              
              {/* Base colors */}
              <FancyCard className="p-6">
                <h2 className="text-xl font-semibold mb-4">Base Colors</h2>
                <div className="space-y-2">
                  {["base-100", "base-200", "base-300", "neutral"].map((color) => (
                    <div key={color} className={`bg-${color} p-3 rounded-md border border-base-content/10 flex justify-between`}>
                      <span>{color}</span>
                      <span className="opacity-60 text-sm">Background color</span>
                    </div>
                  ))}
                </div>
              </FancyCard>
            </div>
          </section>
        </div>
        
        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-base-300 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>WynFin UI Component Testing Page</p>
          <p className="mt-1">Use this page to test UI components in isolation</p>
        </footer>
      </div>
    </div>
  );
}