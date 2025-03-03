import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { LoadingButton } from "~/components/auth/components/loading-button";

interface WelcomeCardProps {
  isLoading: boolean;
}

export function WelcomeCard({ isLoading }: WelcomeCardProps) {
  const navigate = useNavigate();
  
  return (
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
            onClick={() => navigate("/spending/new")}
          >
            Add Transaction
          </LoadingButton>
        </div>
      </FancyCard>
    </motion.div>
  );
}