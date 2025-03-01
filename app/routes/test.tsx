import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/home";
import { useToast } from "~/components/common/toast-context";
import { LoadingButton } from "~/components/auth/components/loading-button";
import { FancyCard } from "~/components/common/cards/card";
import { TiltAble } from "~/components/common/tiltable";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "UI Component Testing | WynFin" },
    { name: "description", content: "Test page for UI components" },
  ];
}

export default function TestPage() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to simulate loading state
  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };
  
  return (
    <div className="min-h-screen p-8 bg-base-100">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">UI Component Testing</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Use this page to test various UI components in isolation
          </p>
          <div className="mt-4">
            <Link to="/" className="btn btn-sm btn-outline">
              ← Back to home
            </Link>
          </div>
        </header>
        
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
        </div>
      </div>
    </div>
  );
}