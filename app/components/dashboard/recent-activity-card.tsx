import { motion } from "framer-motion";
import { FancyCard } from "~/components/common/cards/fancy-card";

export function RecentActivityCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <FancyCard className="p-6 h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Recent Activity</h3>
        </div>
        
        <div className="p-4 text-center text-gray-500">
          No recent activity to display
        </div>
      </FancyCard>
    </motion.div>
  );
}