import { useState, useEffect } from "react";
import { useAuthUser, useIsAuthenticated } from "~/components/auth/components/auth-provider";
import { useToast } from "~/components/common/toast-context";
import type { User } from "~/components/auth/core/models";
import { useUsersService } from "~/hooks/use-service";
import type { Route } from "../+types/root";
import { WelcomeCard } from "~/components/dashboard/welcome-card";
import { ProfileCard } from "~/components/dashboard/profile-card";
import { QuickActionsCard } from "~/components/dashboard/quick-actions-card";
import { RecentActivityCard } from "~/components/dashboard/recent-activity-card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard | WinFin" },
    { name: "description", content: "WinFin Dashboard - Manage your finances" },
  ];
}

export default function DashboardPage() {
  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<User | null>(null);
  
  // Get the authenticated users service
  const usersService = useUsersService();
  
  // Fetch user profile data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      
      usersService.getMe()
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
  }, [isAuthenticated]);
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <WelcomeCard isLoading={isLoading} />
      <ProfileCard isLoading={isLoading} profileData={profileData} userEmail={auth?.email} />
      <QuickActionsCard />
      <RecentActivityCard />
    </div>
  );
}