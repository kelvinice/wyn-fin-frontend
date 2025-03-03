import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { FancyCard } from "~/components/common/cards/fancy-card";
import type { User } from "~/components/auth/core/models";

interface ProfileCardProps {
  isLoading: boolean;
  profileData: User | null;
  userEmail: string | undefined;
}

export function ProfileCard({ isLoading, profileData, userEmail }: ProfileCardProps) {
  const navigate = useNavigate();
  
  return (
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
              <span className="font-medium">{profileData?.email || userEmail || "Not available"}</span>
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
  );
}