import { Link } from "react-router";
import { RequireAuth } from "~/components/auth/components/auth-provider";

import { UnderConstruction } from "~/components/common/under-construction";
import type { Route } from "../+types/home";
import { FancyCard } from "~/components/common/cards/fancy-card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Budget Management | WinFin" },
    { name: "description", content: "Set and manage your budgets" },
  ];
}

export default function BudgetPage() {
  return (
    <RequireAuth>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Budget Management</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Set and track your monthly budgets
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-2">
            
            <button className="btn btn-primary btn-sm">
              Create New Budget
            </button>
          </div>
        </div>
        
        <FancyCard className="p-6">
          <UnderConstruction message="Budget management functionality is coming soon!" />
        </FancyCard>
      </div>
    </RequireAuth>
  );
}