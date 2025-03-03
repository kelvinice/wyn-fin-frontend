import { EmailInput } from "~/components/auth/components/email-input";
import { SettingsTab, SettingItem } from "./settings-tab";

interface AccountSettingsProps {
  email: string;
  onDeleteAccount: () => void;
}

export function AccountSettings({ email, onDeleteAccount }: AccountSettingsProps) {
  return (
    <SettingsTab title="Account Settings">
      <SettingItem 
        label="Email" 
        description="Email address associated with your account"
      >
        <EmailInput
            value={email}
            readOnly
            label=""
        />
      </SettingItem>
      
      <SettingItem 
        label="Password" 
        description="Password for your account"
      >
        <input 
          type="password" 
          className="input input-bordered w-full md:w-64" 
          placeholder="Password" 
        />
      </SettingItem>
      
      <SettingItem 
        label="Delete Account" 
        description="Permanently delete your account and all your data"
      >
        <button 
          className="btn btn-error btn-sm"
          onClick={onDeleteAccount}
        >
          Delete Account
        </button>
      </SettingItem>
    </SettingsTab>
  );
}