import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { EyeIcon, EyeSlashIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";
import { Logo } from "../components/common/logo";
import type { Route } from "./+types/home";
import { FancyCard } from "~/components/common/cards/card";
import { TiltAble } from "~/components/common/tiltable";
import type { SignInFormData } from "~/components/auth/core/models";
import { useLogin } from "~/components/auth/components/hooks/useLogin";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login | WynFin" },
    { name: "description", content: "Login to access your WynFin account" },
  ];
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending: isLoading, error: loginError } = useLogin();
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
        navigate("/");
      },
      onError: (err) => {
        setError(err instanceof Error ? err.message : "Invalid email or password");
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - decorative */}
      <motion.div 
        className="hidden md:flex md:w-1/2 bg-linear-to-br from-primary to-primary-focus p-8 justify-center items-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="max-w-md text-base-100">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <TiltAble className="w-56 h-56 mx-auto" tiltMaxDegrees={30}>
                <Logo />
            </TiltAble>
          </motion.div>
          <motion.h1
            className="text-4xl font-bold mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            WynFin
          </motion.h1>
          <motion.p
            className="mt-4 text-lg opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Financial manager and dashboard.
          </motion.p>
        </div>
      </motion.div>

      {/* Right side - login form */}
      <div className="grow flex items-center justify-center p-6 bg-base-100">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center md:hidden">
            <Logo />
            <h1 className="text-3xl font-bold mt-6">Welcome Back</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Sign in to continue</p>
          </div>

          <FancyCard className="p-8">
            <h2 className="text-2xl font-bold mb-6">Sign In</h2>
            
            {error && (
              <motion.div 
                className="alert alert-error mb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <span>{error}</span>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <div className="relative">
                  <UserIcon className="text-secondary absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input input-bordered pl-10 w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="input input-bordered pl-10 pr-10 w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <label className="label">
                  <Link to="/auth/forgot-password" className="label-text-alt link link-hover text-primary">
                    Forgot password?
                  </Link>
                </label>
              </div>
              
              <motion.button
                type="submit"
                className={`btn btn-primary w-full relative overflow-hidden`}
                disabled={isLoading}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      className="flex items-center justify-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span>Signing in</span>
                      <motion.div
                        className="flex space-x-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {[0, 1, 2].map((dot) => (
                          <motion.span
                            key={dot}
                            className="h-1.5 w-1.5 rounded-full bg-current"
                            animate={{
                              y: ["0%", "-30%", "0%"]
                            }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              repeatType: "loop",
                              delay: dot * 0.1
                            }}
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                  ) : (
                    <span>
                      Sign in
                    </span>
                  )}
                </AnimatePresence>
              </motion.button>
              
              <div className="divider">OR</div>
              
              <button
                type="button"
                className="btn btn-outline w-full"
                onClick={() => navigate("/auth/register")}
              >
                Create Account
              </button>
            </form>
          </FancyCard>
          
          <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}