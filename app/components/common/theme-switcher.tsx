import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'
import { useTheme } from "./theme-context";

export function ThemeSwitcher() {
    const {toggleTheme, theme} = useTheme();

    return (
        <label className="swap swap-rotate btn btn-circle" >
            <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={() => toggleTheme()}
            />
            <MoonIcon className="swap-on fill-current w-6 h-6" />
            <SunIcon className="swap-off fill-current w-6 h-6" />
        </label>
    );
  }