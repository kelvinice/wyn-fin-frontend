import { useState, useEffect } from "react";
import { useNavigate, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { RequireAuth } from "~/components/auth/components/auth-provider";
import { BudgetManagement } from "~/components/budget/budget-management";
import { EnhancedPeriodSelector } from "~/components/periods/enhanced-period-selector";
import { usePeriodService, type Period } from "~/hooks/use-period-service";
import type { Route } from "./+types";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const periodId = url.searchParams.get("periodId") || "";
  return { periodId };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Budget Management | WinFin" },
    { name: "description", content: "Manage your monthly budget" },
  ];
}

export default function BudgetPage() {
  const { periodId } = useLoaderData<{ periodId: string }>();
  const [selectedPeriodId, setSelectedPeriodId] = useState(periodId || "");
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const navigate = useNavigate();

  const { useGetAllPeriods } = usePeriodService();
  const { data: periods = [], isLoading: isPeriodsLoading } = useGetAllPeriods();

  useEffect(() => {
    if (!isPeriodsLoading && periods.length > 0) {
      if (periodId) {
        const period = periods.find(p => p.id === periodId);
        if (period) {
          setSelectedPeriod(period);
          setSelectedPeriodId(periodId);
          return;
        }
      }
      
      const fallbackPeriod = periods[0];
      setSelectedPeriod(fallbackPeriod);
      setSelectedPeriodId(fallbackPeriod.id);
    }
  }, [periods, isPeriodsLoading, periodId, navigate]);

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
    setSelectedPeriodId(period.id);
    navigate(`/budget?periodId=${period.id}`);
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
          
          <div className="mt-4 md:mt-0 w-full md:w-64">
            <EnhancedPeriodSelector
              periods={periods}
              selectedPeriod={selectedPeriod}
              onPeriodChange={handlePeriodChange}
              isLoading={isPeriodsLoading}
            />
          </div>
        </div>

        {selectedPeriod ? (
          <BudgetManagement periodId={selectedPeriodId} />
        ) : (
          <FancyCard className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">No Period Selected</h2>
            <p>Please select a period to view and manage your budget allocations.</p>
          </FancyCard>
        )}
      </div>
    </RequireAuth>
  );
}