import { SettingsTab, SettingItem } from "./settings-tab";

interface NotificationsSettingsProps {
  notifyBudgetAlerts: boolean;
  setNotifyBudgetAlerts: (value: boolean) => void;
  notifyPaymentReminders: boolean;
  setNotifyPaymentReminders: (value: boolean) => void;
  notifyNewFeatures: boolean;
  setNotifyNewFeatures: (value: boolean) => void;
}

export function NotificationsSettings({
  notifyBudgetAlerts,
  setNotifyBudgetAlerts,
  notifyPaymentReminders,
  setNotifyPaymentReminders,
  notifyNewFeatures,
  setNotifyNewFeatures
}: NotificationsSettingsProps) {
  return (
    <SettingsTab title="Notifications Settings">
      <SettingItem label="Budget Alerts">
        <div className="flex items-center">
          <input 
            type="checkbox" 
            className="toggle toggle-primary" 
            checked={notifyBudgetAlerts} 
            onChange={(e) => setNotifyBudgetAlerts(e.target.checked)} 
          />
          <span className="ml-2 text-sm">Receive alerts when you exceed your budget</span>
        </div>
      </SettingItem>
      
      <SettingItem label="Payment Reminders">
        <div className="flex items-center">
          <input 
            type="checkbox" 
            className="toggle toggle-primary" 
            checked={notifyPaymentReminders} 
            onChange={(e) => setNotifyPaymentReminders(e.target.checked)} 
          />
          <span className="ml-2 text-sm">Receive reminders for upcoming payments</span>
        </div>
      </SettingItem>
      
      <SettingItem label="New Features">
        <div className="flex items-center">
          <input 
            type="checkbox" 
            className="toggle toggle-primary" 
            checked={notifyNewFeatures} 
            onChange={(e) => setNotifyNewFeatures(e.target.checked)} 
          />
          <span className="ml-2 text-sm">Receive notifications about new features</span>
        </div>
      </SettingItem>
    </SettingsTab>
  );
}