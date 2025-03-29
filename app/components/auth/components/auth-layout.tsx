import { motion } from "framer-motion";
import { Link } from "react-router";
import { Logo } from "~/components/common/logo";
import { TiltAble } from "~/components/common/tiltable";
import { FancyCard } from "~/components/common/cards/fancy-card";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  mobileTitleText?: string;
  mobileSubtitleText?: string;
  footerText?: string;
  showDecorativeImages?: boolean;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  mobileTitleText = "Welcome",
  mobileSubtitleText = "Please sign in to continue",
  footerText = "By using this service, you agree to our Terms of Service and Privacy Policy.",
  showDecorativeImages = true,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - decorative */}
      <motion.div 
        className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary/90 via-primary to-primary-focus p-8 justify-center items-center relative overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Abstract decoration */}
        {showDecorativeImages && (
          <>
            <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary-focus/50 blur-3xl" />
            <div className="absolute top-[30%] left-[10%] w-[20%] h-[20%] rounded-full bg-white/5 blur-xl" />
          </>
        )}
        
        <div className="max-w-md text-base-100 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <TiltAble className="w-56 h-56 mx-auto" tiltMaxDegrees={20}>
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl">
                <Logo />
              </div>
            </TiltAble>
          </motion.div>
          <motion.h1
            className="text-4xl font-bold mt-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            WinFin
          </motion.h1>
          <motion.p
            className="mt-4 text-lg opacity-90 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            {subtitle}
          </motion.p>
          
          {/* Feature highlights */}
          <motion.div
            className="mt-10 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.7 }}
          >
            {["Track finances effortlessly", "Gain meaningful insights", "Plan your financial future"].map((feature, index) => (
              <motion.div 
                key={index}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + (index * 0.2), duration: 0.5 }}
              >
                <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <p className="text-sm">{feature}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - form area */}
      <div className="grow flex items-center justify-center p-6 bg-base-100">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center md:hidden">
            <div className="inline-block p-3 bg-primary/5 rounded-full mb-3">
              <Logo className="w-16 h-16" />
            </div>
            <h1 className="text-3xl font-bold mt-3">{mobileTitleText}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{mobileSubtitleText}</p>
          </div>

          <FancyCard className="p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">{title}</h2>
            {children}
          </FancyCard>
          
          <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
            {footerText.includes("Terms") ? (
              <>
                {footerText.split("Terms")[0]}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                {footerText.split("Policy")[1] || "."}
              </>
            ) : (
              footerText
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}