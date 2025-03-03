import { SettingsTab, SettingItem } from "./settings-tab";

export function SecuritySettings() {
  return (
    <SettingsTab title="Security Settings">
      <SettingItem 
        label="Two-Factor Authentication" 
        description="Add an extra layer of security to your account"
      >
        <button className="btn btn-primary btn-sm">Enable 2FA</button>
      </SettingItem>
    </SettingsTab>
  );
}