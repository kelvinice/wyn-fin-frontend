import { Link } from "react-router";
import { RequireAuth } from "~/components/auth/components/auth-provider";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { UnderConstruction } from "~/components/common/under-construction";
import type { Route } from "../+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Spending | WynFin" },
    { name: "description", content: "Track and manage your spending" },
  ];
}

export default function SpendingPage() {
  return (
    <RequireAuth>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Spending Management</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Track and manage your transactions
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-2">
            <Link to="/dashboard" className="btn btn-outline btn-sm">
              Back to Dashboard
            </Link>
            <Link to="/spending/new" className="btn btn-primary btn-sm">
              Add Transaction
            </Link>
          </div>
        </div>
        
        <FancyCard className="p-6">
          <UnderConstruction message="Spending management features are coming soon!" />
        </FancyCard>
      </div>
    </RequireAuth>
  );
}