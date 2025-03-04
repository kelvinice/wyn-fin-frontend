import { Link } from "react-router";
import type { Route } from "./+types/home";
import { ThemeSwitcher } from "~/components/common/theme-switcher";
import { TestSection } from "~/components/testing/test-section";
import { TestCard } from "~/components/testing/test-card";
import { ToastTester } from "~/components/testing/toast-tester";
import { LoadingButtonsTester } from "~/components/testing/loading-buttons-tester";
import { TiltTester } from "~/components/testing/tilt-tester";
import { ThemeSwitcherTester } from "~/components/testing/theme-switcher-tester";
import { ModalTester } from "~/components/testing/modal-tester";
import { ApiActionTester, ApiTester } from "~/components/testing/api-tester";
import { AuthTester } from "~/components/testing/auth-tester";
import { BaseColorsTester, ColorPaletteTester } from "~/components/testing/color-palette-tester";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "UI Component Testing | WynFin" },
    { name: "description", content: "Test page for UI components" },
  ];
}

export default function TestPage() {
  return (
    <div className="min-h-screen bg-base-100 mt-[40px]">
      {/* Header with navigation and theme switcher */}
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
          <TestSection title="UI Components">
            <TestCard title="Toast Notifications">
              <ToastTester />
            </TestCard>
            
            <TestCard title="Loading Buttons">
              <LoadingButtonsTester />
            </TestCard>
            
            <TestCard title="Tilt Effect">
              <TiltTester />
            </TestCard>
            
            <TestCard title="Theme Switcher">
              <ThemeSwitcherTester />
            </TestCard>
            
            <TestCard title="Modal Components">
              <ModalTester />
            </TestCard>
          </TestSection>
          
          {/* API Testing Section */}
          <TestSection title="API Testing">
            <TestCard title="API Connection Test (GET)">
              <ApiTester />
            </TestCard>
            
            <TestCard title="API Action Test (POST)">
              <ApiActionTester />
            </TestCard>
            
            <TestCard title="User Authentication Test">
              <AuthTester />
            </TestCard>
          </TestSection>
          
          {/* Design System Section */}
          <TestSection title="Design System">
            <TestCard title="Color Palette">
              <ColorPaletteTester />
            </TestCard>
            
            <TestCard title="Base Colors">
              <BaseColorsTester />
            </TestCard>
          </TestSection>
        </div>
      </div>
    </div>
  );
}