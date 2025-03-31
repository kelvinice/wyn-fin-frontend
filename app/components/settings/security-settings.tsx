import { useState } from "react";
import { SettingsTab, SettingItem } from "./settings-tab";
import { LoadingButton } from "~/components/auth/components/loading-button";
import { useToast } from "~/components/common/toast-context";
import { useRefreshToken } from '~/components/auth/components/auth-provider';

export function SecuritySettings() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshToken = useRefreshToken();
  const { showToast } = useToast();

  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    try {
      const success = await refreshToken();
      if (success) {
        showToast("Token refreshed successfully", "success");
      } else {
        showToast("Failed to refresh token", "error");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      showToast("An error occurred while refreshing the token", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <SettingsTab title="Security Settings">
      <SettingItem 
        label="Two-Factor Authentication" 
        description="Add an extra layer of security to your account"
      >
        <button className="btn btn-primary btn-sm">Enable 2FA</button>
      </SettingItem>

      <SettingItem 
        label="Authentication Token" 
        description="Refresh your authentication token manually if needed"
      >
        <LoadingButton 
          className="btn btn-secondary btn-sm" 
          onClick={handleRefreshToken}
          isLoading={isRefreshing}
          loadingText="Refreshing..."
        >
          Refresh Token
        </LoadingButton>
      </SettingItem>
    </SettingsTab>
  );
}