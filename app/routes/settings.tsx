import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { RequireAuth, useAuthUser } from "~/components/auth/components/auth-provider";
import { useToast } from "~/components/common/toast-context";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { LoadingButton } from "~/components/auth/components/loading-button";
import { useUsersService } from "~/hooks/use-service";
import type { Route } from "../+types/root";
import { ArrowLeftIcon, BellIcon, ShieldCheckIcon, UserCircleIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { ThemeSwitcher } from "~/components/common/theme-switcher";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings | WynFin" },
    { name: "description", content: "Manage your WynFin account settings" },
  ];
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const auth = useAuthUser();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  
  // Settings states
  const [currency, setCurrency] = useState('USD');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [notifyBudgetAlerts, setNotifyBudgetAlerts] = useState(true);
  const [notifyPaymentReminders, setNotifyPaymentReminders] = useState(true);
  const [notifyNewFeatures, setNotifyNewFeatures] = useState(true);
  
  // Get the authenticated users service
  const usersService = useUsersService();
  
  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      showToast("Settings saved successfully", "success");
      setIsLoading(false);
    }, 800);
    
    // In a real implementation, you would call your API
    // try {
    //   await usersService.updateSettings({
    //     currency,
    //     dateFormat,
    //     notifications: {
    //       budgetAlerts: notifyBudgetAlerts,
    //       paymentReminders: notifyPaymentReminders,
    //       newFeatures: notifyNewFeatures
    //     }
    //   });
    //   showToast("Settings saved successfully", "success");
    // } catch (error) {
    //   showToast("Failed to save settings", "error");
    // } finally {
    //   setIsLoading(false);
    // }
  };
  
  const handleDeleteAccount = () => {
    // Show confirmation dialog
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      showToast("Account deletion feature is not implemented yet", "info");
    }
  };
  
  return (
    <RequireAuth>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Manage your account preferences
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link to="/dashboard" className="btn btn-outline btn-sm gap-2">
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FancyCard className="p-4">
                <div className="flex flex-col space-y-1">
                  <button 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'general' ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}`}
                    onClick={() => setActiveTab('general')}
                  >
                    <WrenchScrewdriverIcon className="w-5 h-5" />
                    <span>General</span>
                  </button>
                  <button 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'account' ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}`}
                    onClick={() => setActiveTab('account')}
                  >
                    <UserCircleIcon className="w-5 h-5" />
                    <span>Account</span>
                  </button>
                  <button 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'security' ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}`}
                    onClick={() => setActiveTab('security')}
                  >
                    <ShieldCheckIcon className="w-5 h-5" />
                    <span>Security</span>
                  </button>
                  <button 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'notifications' ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}`}
                    onClick={() => setActiveTab('notifications')}
                  >
                    <BellIcon className="w-5 h-5" />
                    <span>Notifications</span>
                  </button>
                </div>
              </FancyCard>
            </motion.div>
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
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">General Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="font-medium mb-2 block">Theme</label>
                        <div className="flex items-center">
                          <span className="mr-4 text-sm">Toggle between light and dark mode:</span>
                          <ThemeSwitcher />
                        </div>
                      </div>
                      
                      <div>
                        <label className="font-medium mb-2 block">Currency</label>
                        <select 
                          className="select select-bordered w-full md:w-64"
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                        >
                          <option value="USD">USD - US Dollar ($)</option>
                          <option value="EUR">EUR - Euro (€)</option>
                          <option value="GBP">GBP - British Pound (£)</option>
                          <option value="JPY">JPY - Japanese Yen (¥)</option>
                          <option value="CAD">CAD - Canadian Dollar (C$)</option>
                          <option value="AUD">AUD - Australian Dollar (A$)</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-1">Currency used for all financial calculations</p>
                      </div>
                      
                      <div>
                        <label className="font-medium mb-2 block">Date Format</label>
                        <select 
                          className="select select-bordered w-full md:w-64"
                          value={dateFormat}
                          onChange={(e) => setDateFormat(e.target.value)}
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-1">Date format used throughout the application</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Account Settings */}
                {activeTab === 'account' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="font-medium mb-2 block">Email</label>
                        <input 
                          type="email" 
                          className="input input-bordered w-full md:w-64" 
                          value={auth.user.email} 
                          readOnly 
                        />
                        <p className="text-sm text-gray-500 mt-1">Email address associated with your account</p>
                      </div>
                      
                      <div>
                        <label className="font-medium mb-2 block">Password</label>
                        <input 
                          type="password" 
                          className="input input-bordered w-full md:w-64" 
                          value="********" 
                          readOnly 
                        />
                        <p className="text-sm text-gray-500 mt-1">Password for your account</p>
                      </div>
                      
                      <div>
                        <label className="font-medium mb-2 block">Delete Account</label>
                        <button 
                          className="btn btn-error btn-sm"
                          onClick={handleDeleteAccount}
                        >
                          Delete Account
                        </button>
                        <p className="text-sm text-gray-500 mt-1">Permanently delete your account</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="font-medium mb-2 block">Two-Factor Authentication</label>
                        <button className="btn btn-primary btn-sm">Enable 2FA</button>
                        <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Notifications Settings */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Notifications Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="font-medium mb-2 block">Budget Alerts</label>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary" 
                            checked={notifyBudgetAlerts} 
                            onChange={(e) => setNotifyBudgetAlerts(e.target.checked)} 
                          />
                          <span className="ml-2 text-sm">Receive alerts when you exceed your budget</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="font-medium mb-2 block">Payment Reminders</label>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary" 
                            checked={notifyPaymentReminders} 
                            onChange={(e) => setNotifyPaymentReminders(e.target.checked)} 
                          />
                          <span className="ml-2 text-sm">Receive reminders for upcoming payments</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="font-medium mb-2 block">New Features</label>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary" 
                            checked={notifyNewFeatures} 
                            onChange={(e) => setNotifyNewFeatures(e.target.checked)} 
                          />
                          <span className="ml-2 text-sm">Receive notifications about new features</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
      </div>
    </RequireAuth>
  );
}
