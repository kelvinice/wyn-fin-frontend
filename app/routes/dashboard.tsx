import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { RequireAuth, useAuthUser, useIsAuthenticated, useSignOut } from "~/components/auth/components/auth-provider";
import { useToast } from "~/components/common/toast-context";
import { FancyCard } from "~/components/common/cards/card";
import { LoadingButton } from "~/components/auth/components/loading-button";
import type { User } from "~/components/auth/core/models";
import UsersService from "~/services/users-service";
import type { Route } from "../+types/root";
import { ThemeSwitcher } from "~/components/common/theme-switcher";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard | WynFin" },
    { name: "description", content: "WynFin Dashboard - Manage your finances" },
  ];
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<User | null>(null);
  
  // Client-side only effect
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Fetch user profile data - only run on client side after mount
  useEffect(() => {
    if (!mounted) return; // Skip during SSR
    
    if (isAuthenticated) {
      const userService = new UsersService();
      setIsLoading(true);
      
      userService.getMe()
        .then(user => {
          setProfileData(user);
        })
        .catch(error => {
          showToast("Error loading profile data", "error");
          console.error("Profile error:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [mounted, isAuthenticated]);
  
  const handleSignOut = () => {
    signOut();
    showToast("You have been signed out successfully", "info");
    navigate("/auth/login");
  };
  
  // Get user data from auth state
  const user = auth;
  
  return (
    <RequireAuth>
      <div className="min-h-screen bg-base-100">
        {/* Top Navigation */}
        <header className="bg-primary text-primary-content shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">WynFin Dashboard</h1>
            
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <span className="text-sm hidden md:inline-block">
                Welcome, {user?.email || "User"}
              </span>
              
              <LoadingButton 
                isLoading={false} 
                className="btn btn-sm btn-outline border-primary-content/30 text-primary-content hover:bg-primary-content/20 hover:border-primary-content"
                onClick={handleSignOut}
              >
                Sign Out
              </LoadingButton>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Welcome Card */}
            <motion.div
              className="md:col-span-2 lg:col-span-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FancyCard className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Welcome to your dashboard</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      {isLoading 
                        ? "Loading your financial summary..." 
                        : "Here's your financial overview for today"}
                    </p>
                  </div>
                  
                  <LoadingButton
                    isLoading={false}
                    className="btn btn-primary self-start"
                    onClick={() => navigate("/transactions/new")}
                  >
                    Add Transaction
                  </LoadingButton>
                </div>
              </FancyCard>
            </motion.div>
            
            {/* User Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <FancyCard className="p-6 h-full">
                <h3 className="text-xl font-semibold mb-4">Your Profile</h3>
                
                {isLoading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-base-300 rounded w-3/4"></div>
                    <div className="h-4 bg-base-300 rounded w-1/2"></div>
                    <div className="h-4 bg-base-300 rounded w-5/6"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Email</span>
                      <span className="font-medium">{profileData?.email || user?.email || "Not available"}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Member Since</span>
                      <span className="font-medium">
                        {profileData?.createdAt 
                          ? new Date(profileData.createdAt).toLocaleDateString() 
                          : "Not available"}
                      </span>
                    </div>
                    
                    <div className="pt-4">
                      <button 
                        className="btn btn-sm btn-outline w-full"
                        onClick={() => navigate("/profile")}
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                )}
              </FancyCard>
            </motion.div>
            
            {/* Quick Actions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <FancyCard className="p-6 h-full">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    className="btn btn-outline btn-info w-full"
                    onClick={() => navigate("/transactions")}
                  >
                    View Transactions
                  </button>
                  
                  <button 
                    className="btn btn-outline btn-success w-full"
                    onClick={() => navigate("/budgets")}
                  >
                    Manage Budgets
                  </button>
                  
                  <button 
                    className="btn btn-outline btn-warning w-full"
                    onClick={() => navigate("/reports")}
                  >
                    Generate Reports
                  </button>
                </div>
              </FancyCard>
            </motion.div>
            
            {/* Financial Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <FancyCard className="p-6 h-full">
                <h3 className="text-xl font-semibold mb-4">Financial Summary</h3>
                
                {isLoading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-base-300 rounded w-3/4"></div>
                    <div className="h-4 bg-base-300 rounded w-1/2"></div>
                    <div className="h-4 bg-base-300 rounded w-5/6"></div>
                  </div>
                ) : (
                  <div>
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      Connect your accounts to see your financial summary
                    </p>
                    
                    <button 
                      className="btn btn-primary w-full"
                      onClick={() => navigate("/accounts/connect")}
                    >
                      Connect Accounts
                    </button>
                  </div>
                )}
              </FancyCard>
            </motion.div>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}