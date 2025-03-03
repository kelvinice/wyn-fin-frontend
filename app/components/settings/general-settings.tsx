import { ThemeSwitcher } from "~/components/common/theme-switcher";
import { SettingsTab, SettingItem } from "./settings-tab";

interface GeneralSettingsProps {
  currency: string;
  setCurrency: (currency: string) => void;
  dateFormat: string;
  setDateFormat: (format: string) => void;
}

export function GeneralSettings({
  currency,
  setCurrency,
  dateFormat,
  setDateFormat
}: GeneralSettingsProps) {
  return (
    <SettingsTab title="General Settings">
      <SettingItem label="Theme">
        <div className="flex items-center">
          <span className="mr-4 text-sm">Toggle between light and dark mode:</span>
          <ThemeSwitcher />
        </div>
      </SettingItem>
      
      <SettingItem 
        label="Currency" 
        description="Currency used for all financial calculations"
      >
        <select 
          className="select select-bordered w-full md:w-64"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="IDR">IDR - Indonesian Rupiah (Rp)</option>
          <option value="USD">USD - US Dollar ($)</option>
          <option value="EUR">EUR - Euro (€)</option>
          <option value="GBP">GBP - British Pound (£)</option>
          <option value="JPY">JPY - Japanese Yen (¥)</option>
          <option value="CAD">CAD - Canadian Dollar (C$)</option>
          <option value="AUD">AUD - Australian Dollar (A$)</option>
        </select>
      </SettingItem>
      
      <SettingItem 
        label="Date Format" 
        description="Date format used throughout the application"
      >
        <select 
          className="select select-bordered w-full md:w-64"
          value={dateFormat}
          onChange={(e) => setDateFormat(e.target.value)}
        >
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </SettingItem>
    </SettingsTab>
  );
}