import { motion } from "framer-motion";
import { RequireAuth } from "~/components/auth/components/auth-provider";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { ClassificationManagement } from "~/components/classifications/classification-management";
import type { Route } from "../+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Classifications | WinFin" },
    { name: "description", content: "Manage your budget classifications" },
  ];
}

export default function ClassificationsPage() {
  return (
    <RequireAuth>
      <div className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Budget Classifications</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Create and manage classifications for organizing your budget items
              </p>
            </div>
          </div>

          <FancyCard className="p-6">
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Classifications help you organize your budget items into meaningful groups such as "Essential," 
              "Discretionary," or "Savings" to better understand your spending habits.
            </p>
            
            <ClassificationManagement />
          </FancyCard>
        </motion.div>
      </div>
    </RequireAuth>
  );
}