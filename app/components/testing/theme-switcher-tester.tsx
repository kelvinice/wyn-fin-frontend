import { ThemeSwitcher } from "~/components/common/theme-switcher";

export function ThemeSwitcherTester() {
  return (
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
  );
}