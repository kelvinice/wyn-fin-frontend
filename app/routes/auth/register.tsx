import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import type { RegisterFormData } from "~/components/auth/core/models";
import { useRegister } from "~/components/auth/components/hooks/useRegister";
import { AuthLayout } from "~/components/auth/components/auth-layout";
import { EmailInput } from "~/components/auth/components/email-input";
import { PasswordInput } from "~/components/auth/components/password-input";
import { LoadingButton } from "~/components/auth/components/loading-button";
import { ErrorAlert } from "~/components/auth/components/error-alert";
import { useToast } from "~/components/common/toast-context";
import type { Route } from "../+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Register | WynFin" },
    { name: "description", content: "Create a new WynFin account" },
  ];
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { mutate: register, isPending: isLoading, error: registerError } = useRegister();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple validation
    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const registerData: RegisterFormData = {
      email,
      password,
      passwordConfirm,
    };

    register(registerData, {
      onSuccess: () => {
        showToast(
          "Account created successfully! You can now sign in.",
          "success"
        );
        navigate("/auth/login");
      },
      onError: (err) => {
        setError(err instanceof Error ? err.message : "Registration failed");
      }
    });
  };

  return (
    <div className="relative">
      <ErrorAlert message={error} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="fieldset bg-base-200/50 border border-base-300 p-6 rounded-box">
          <legend className="fieldset-legend bg-primary text-primary-content px-3 py-1 rounded-lg font-medium">
            New Account
          </legend>

          <div className="space-y-4">
            <div>
              <label className="fieldset-label text-sm font-medium mb-1 block">Email Address</label>
              <EmailInput
                value={email}
                onChange={setEmail}
                useEnvelopeIcon={true}
                label=""
              />
            </div>

            <div>
              <label className="fieldset-label text-sm font-medium mb-1 block">Password</label>
              <PasswordInput
                value={password}
                onChange={setPassword}
                placeholder="Create a password"
                minLength={8}
                label=""
              />
            </div>

            <div>
              <label className="fieldset-label text-sm font-medium mb-1 block">Confirm Password</label>
              <PasswordInput
                value={passwordConfirm}
                onChange={setPasswordConfirm}
                placeholder="Confirm your password"
                label=""
                minLength={8}
              />
            </div>
          </div>

          <LoadingButton
            isLoading={isLoading}
            loadingText="Creating Account"
            className="btn btn-primary w-full mt-6"
          >
            Create Account
          </LoadingButton>
        </fieldset>

        <div className="divider text-sm text-gray-500">Already have an account?</div>

        <LoadingButton
          type="button"
          className="btn btn-outline w-full"
          isLoading={false}
          onClick={() => navigate("/auth/login")}
        >
          Sign In Instead
        </LoadingButton>
      </form>
    </div>
  );
}