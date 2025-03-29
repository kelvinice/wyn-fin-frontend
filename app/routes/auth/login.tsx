import { useState } from "react";
import { useNavigate, Link, redirect } from "react-router";
import type { Route } from "../+types/home";
import type { SignInFormData } from "~/components/auth/core/models";
import { useLogin } from "~/components/auth/components/hooks/useLogin";
import { EmailInput } from "~/components/auth/components/email-input";
import { PasswordInput } from "~/components/auth/components/password-input";
import { LoadingButton } from "~/components/auth/components/loading-button";
import { ErrorAlert } from "~/components/auth/components/error-alert";
import { authTokenCookie } from "~/cookies.server";

export async function loader({ request }: { request: Request }) {
  const cookieHeader = request.headers.get("Cookie");
  const token = await authTokenCookie.parse(cookieHeader);
  if (token) {
    return redirect("/dashboard");
  }
  return null;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login | WinFin" },
    { name: "description", content: "Login to access your WinFin account" },
  ];
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending: isLoading} = useLogin();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const loginData: SignInFormData = {
      email: email,
      password: password
    };
    
    login(loginData, {
      onSuccess: () => {
        navigate("/dashboard");
      },
      onError: (err: any) => {
        const errorMsg = err?.response?.data?.message || 
                         err?.message || 
                         "Invalid email or password";
        setError(errorMsg);
      }
    });
  };

  return (
    <div>
      <ErrorAlert message={error} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="fieldset bg-base-200/50 border border-base-300 p-6 rounded-box">
          <legend className="fieldset-legend bg-primary text-primary-content px-3 py-1 rounded-lg font-medium">
            Sign in to your account
          </legend>
          <div className="space-y-4">
            <div>
              <label className="fieldset-label text-sm font-medium mb-1 block">Email Address</label>
              <div className="relative">
                <EmailInput 
                  value={email}
                  onChange={setEmail}
                  label=""
                />
              </div>
            </div>
            
            <div>
              <label className="fieldset-label text-sm font-medium mb-1 block">Password</label>
              <PasswordInput 
                value={password}
                onChange={setPassword}
                label=""
              />
              <div className="flex justify-end mt-1">
                <Link to="/auth/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>
          
          <LoadingButton 
            isLoading={isLoading}
            loadingText="Signing in"
            className="btn btn-primary w-full mt-6"
          >
            Sign in
          </LoadingButton>
        </fieldset>
        
        <div className="divider text-sm text-gray-500">Don't have an account?</div>
        
        <LoadingButton 
          type="button"
          className="btn btn-outline w-full"
          isLoading={false}
          onClick={() => navigate("/auth/register")}
        >
          Create Account
        </LoadingButton>
      </form>
    </div>
  );
}