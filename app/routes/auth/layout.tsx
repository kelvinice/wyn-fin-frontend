import { Outlet, Link, useLocation } from "react-router";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { AuthLayout as BaseAuthLayout } from "~/components/auth/components/auth-layout";

export default function AuthLayoutPage() {
  const location = useLocation();
  const isLoginPage = location.pathname.includes('/login');
  const isRegisterPage = location.pathname.includes('/register');
  
  let title = "Access Your Account";
  let subtitle = "Financial manager and dashboard";
  let mobileTitleText = "Welcome Back";
  let mobileSubtitleText = "Sign in to continue";
  
  if (isRegisterPage) {
    title = "Create New Account";
    subtitle = "Start your financial journey with us";
    mobileTitleText = "Join WinFin";
    mobileSubtitleText = "Create your account to continue";
  }
  
  return (
    <div className="relative">
      <Link to="/" className="absolute top-4 left-4 z-50 btn btn-sm gap-2 group hover:text-primary">
        <ArrowLeftIcon className="w-4 h-4 group-hover:transform group-hover:-translate-x-0.5" />
        Back to Home
      </Link>
      
      <BaseAuthLayout
        title={title}
        subtitle={subtitle}
        mobileTitleText={mobileTitleText}
        mobileSubtitleText={mobileSubtitleText}
        footerText="By using this service, you agree to our Terms of Service and Privacy Policy."
      >
        <Outlet />
      </BaseAuthLayout>
    </div>
  );
}