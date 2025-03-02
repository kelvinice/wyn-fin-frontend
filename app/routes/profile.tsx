import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { RequireAuth, useAuthUser, useIsAuthenticated } from "~/components/auth/components/auth-provider";
import { useToast } from "~/components/common/toast-context";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { LoadingButton } from "~/components/auth/components/loading-button";
import { EmailInput } from "~/components/auth/components/email-input";
import { useUsersService } from "~/hooks/use-service";
import type { Route } from "../+types/root";
import type { User } from "~/components/auth/core/models";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profile | WynFin" },
    { name: "description", content: "Manage your WynFin user profile" },
  ];
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // Get the authenticated users service
  const usersService = useUsersService();
  
  // Initialize form with user data
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      
      usersService.getMe()
        .then(user => {
          setProfileData(user);
          setEmail(user.email || "");
          setName(user.name || "");
        })
        .catch(error => {
          showToast("Error loading profile data", "error");
          console.error("Profile error:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isAuthenticated, usersService, showToast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    
    try {
      const updatedProfile = await usersService.updateProfile({
        name
      });
      
      setProfileData(updatedProfile);
      showToast("Profile updated successfully", "success");
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError(error instanceof Error ? error.message : "Failed to update profile");
      showToast("Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <RequireAuth>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">User Profile</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Update your account information
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link to="/dashboard" className="btn btn-outline btn-sm gap-2">
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FancyCard className="p-6">
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                
                {error && (
                  <div className="alert alert-error mb-6">
                    <span>{error}</span>
                  </div>
                )}
                
                {isLoading ? (
                  <div className="animate-pulse space-y-6">
                    <div className="h-12 bg-base-300 rounded w-full"></div>
                    <div className="h-12 bg-base-300 rounded w-full"></div>
                    <div className="h-12 bg-base-300 rounded w-1/3"></div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <label className="label text-sm font-medium">Email Address</label>
                        <EmailInput 
                          value={email}
                          onChange={setEmail}
                          disabled={true}
                          label=""
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Email address cannot be changed
                        </p>
                      </div>
                      
                      <div>
                        <label className="label text-sm font-medium">Full Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="input input-bordered w-full"
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <LoadingButton
                        isLoading={isSaving}
                        loadingText="Saving..."
                        className="btn btn-primary"
                        type="submit"
                      >
                        Save Changes
                      </LoadingButton>
                    </div>
                  </form>
                )}
              </FancyCard>
            </motion.div>
          </div>
          
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <FancyCard className="p-6 h-full">
                <div className="text-center mb-6">
                  <div className="avatar">
                    <div className="w-24 h-24 rounded-full bg-primary-content/20 mx-auto flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary">
                        {name ? name.charAt(0).toUpperCase() : email ? email.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold mt-4">{name || "User"}</h3>
                  <p className="text-sm text-gray-500">{email}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Account Type</span>
                    <span className="font-medium">Standard</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Member Since</span>
                    <span className="font-medium">
                      {profileData?.createdAt 
                        ? new Date(profileData.createdAt).toLocaleDateString() 
                        : "Not available"}
                    </span>
                  </div>
                  
                  <div className="pt-6">
                    <button 
                      className="btn btn-outline btn-sm w-full"
                      onClick={() => navigate("/settings")}
                    >
                      Account Settings
                    </button>
                  </div>
                </div>
              </FancyCard>
            </motion.div>
          </div>
        </div>
        
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <FancyCard className="p-6">
            <h2 className="text-xl font-semibold mb-6">Security</h2>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">Change Password</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Update your password to keep your account secure
                </p>
              </div>
              
              <button 
                className="btn btn-outline"
                onClick={() => navigate("/settings/security")}
              >
                Change Password
              </button>
            </div>
          </FancyCard>
        </motion.div>
      </div>
    </RequireAuth>
  );
}