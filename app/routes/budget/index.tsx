import { useState } from "react";
import { RequireAuth } from "~/components/auth/components/auth-provider";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { PeriodSelector } from "~/components/periods/period-selector";
import { BudgetManagement } from "~/components/budget/budget-management";
import type { Route } from "../+types/home";
import type { Period } from "~/hooks/use-period-service";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Budget Management | WinFin" },
    { name: "description", content: "Manage your monthly budget" },
  ];
}

export default function BudgetPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
  };

  return (
    <RequireAuth>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Budget Management</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Plan your income and expenses for each period
            </p>
          </div>
        </div>

        <div className="mb-6">
          <PeriodSelector 
            onPeriodChange={handlePeriodChange} 
            selectedPeriodId={selectedPeriod?.id}
          />
        </div>

        {selectedPeriod ? (
          <FancyCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Budget for {new Date(2000, selectedPeriod.month - 1).toLocaleString('default', { month: 'long' })} {selectedPeriod.year}
            </h2>
            
            <BudgetManagement periodId={selectedPeriod.id} />
          </FancyCard>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Please select a financial period above to manage its budget</p>
            <a href="/periods" className="btn btn-outline btn-primary">
              Manage Periods
            </a>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}