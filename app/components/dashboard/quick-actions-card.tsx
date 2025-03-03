import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { FancyCard } from "~/components/common/cards/fancy-card";

export function QuickActionsCard() {
  const navigate = useNavigate();
  
  return (
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
            onClick={() => navigate("/spending")}
          >
            Manage Spending
          </button>
          
          <button 
            className="btn btn-outline btn-success w-full"
            onClick={() => navigate("/budget")}
          >
            Manage Budgets
          </button>
          
          <button 
            className="btn btn-outline btn-warning w-full"
            onClick={() => navigate("/categories")}
          >
            Manage Categories
          </button>
        </div>
      </FancyCard>
    </motion.div>
  );
}