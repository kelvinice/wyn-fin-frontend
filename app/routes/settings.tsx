import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { RequireAuth, useAuthUser } from "~/components/auth/components/auth-provider";
import { useToast } from "~/components/common/toast-context";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { LoadingButton } from "~/components/auth/components/loading-button";
import type { Route } from "../+types/root";
import { SettingsNav } from "~/components/settings/settings-nav";
import { GeneralSettings } from "~/components/settings/general-settings";
import { AccountSettings } from "~/components/settings/account-settings";
import { SecuritySettings } from "~/components/settings/security-settings";
import { NotificationsSettings } from "~/components/settings/notifications-settings";
import { DeleteAccountModal } from "~/components/settings/delete-account-modal";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings | WinFin" },
    { name: "description", content: "Manage your WinFin account settings" },
  ];
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const auth = useAuthUser();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'general' | 'account' | 'security' | 'notifications'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  
  // Settings states
  const [currency, setCurrency] = useState('USD');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [notifyBudgetAlerts, setNotifyBudgetAlerts] = useState(true);
  const [notifyPaymentReminders, setNotifyPaymentReminders] = useState(true);
  const [notifyNewFeatures, setNotifyNewFeatures] = useState(true);
  
  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      showToast("Settings saved successfully", "success");
      setIsLoading(false);
    }, 800);
  };
  
  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true);
  };
  
  const confirmDeleteAccount = async () => {
    if (deleteConfirmText !== 'delete my account') {
      showToast("Please type 'delete my account' to confirm", "error");
      return;
    }
    
    setIsDeletingAccount(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsDeletingAccount(false);
      setIsDeleteModalOpen(false);
      showToast("Account deletion feature is not implemented yet", "info");
      setDeleteConfirmText("");
    }, 1500);
  };
  
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteConfirmText("");
  };
  
  return (
    <RequireAuth>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your account preferences
            </p>
          </div>      
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="md:col-span-1">
            <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          
          {/* Settings Content */}
          <div className="md:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FancyCard className="p-6">
                {activeTab === 'general' && (
                  <GeneralSettings 
                    currency={currency}
                    setCurrency={setCurrency}
                    dateFormat={dateFormat}
                    setDateFormat={setDateFormat}
                  />
                )}
                
                {activeTab === 'account' && (
                  <AccountSettings 
                    email={auth?.email || ""}
                    onDeleteAccount={handleDeleteAccount}
                  />
                )}
                
                {activeTab === 'security' && (
                  <SecuritySettings />
                )}
                
                {activeTab === 'notifications' && (
                  <NotificationsSettings 
                    notifyBudgetAlerts={notifyBudgetAlerts}
                    setNotifyBudgetAlerts={setNotifyBudgetAlerts}
                    notifyPaymentReminders={notifyPaymentReminders}
                    setNotifyPaymentReminders={setNotifyPaymentReminders}
                    notifyNewFeatures={notifyNewFeatures}
                    setNotifyNewFeatures={setNotifyNewFeatures}
                  />
                )}
                
                <div className="mt-6 flex justify-end">
                  <LoadingButton 
                    className="btn btn-primary"
                    onClick={handleSaveSettings}
                    isLoading={isLoading}
                  >
                    Save Settings
                  </LoadingButton>
                </div>
              </FancyCard>
            </motion.div>
          </div>
        </div>
        
        <DeleteAccountModal 
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          deleteConfirmText={deleteConfirmText}
          setDeleteConfirmText={setDeleteConfirmText}
          onConfirm={confirmDeleteAccount}
          isDeleting={isDeletingAccount}
        />
      </div>
    </RequireAuth>
  );
}
