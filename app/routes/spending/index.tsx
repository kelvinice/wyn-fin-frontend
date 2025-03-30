import { useState } from "react";
import { useLoaderData, useNavigate, type LoaderFunction } from "react-router";

import { RequireAuth } from "~/components/auth/components/auth-provider";
import { SpendingManagement } from "~/components/spending/spending-management";
import { usePeriodService } from "~/hooks/use-period-service";
import { FancyCard } from "~/components/common/cards/fancy-card";
import type { Route } from "../+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Spending | WinFin" },
    { name: "description", content: "Track and manage your spending" },
  ];
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const periodId = url.searchParams.get("periodId") || "";
  return new Response(JSON.stringify({ periodId }));
};

export default function SpendingPage() {
  const { periodId } = useLoaderData<{ periodId: string }>();
  const [selectedPeriodId, setSelectedPeriodId] = useState(periodId);
  const navigate = useNavigate();

  // Get periods data
  const { useGetAllPeriods } = usePeriodService();
  const { data: periods = [], isLoading: isPeriodsLoading } = useGetAllPeriods();

  // Handle period change
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriodId = e.target.value;
    setSelectedPeriodId(newPeriodId);
    navigate(`/spending?periodId=${newPeriodId}`);
  };

  // Find the selected period to display its details
  const selectedPeriod = periods.find(p => p.id === selectedPeriodId);
  
  return (
    <RequireAuth>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Spending Tracker</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Track and manage your transactions
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <select 
              className="select select-bordered w-full md:w-auto"
              value={selectedPeriodId}
              onChange={handlePeriodChange}
              disabled={isPeriodsLoading}
            >
              <option value="" disabled>Select a financial period</option>
              {periods.map(period => (
                <option key={period.id} value={period.id}>
                  {new Date(2000, period.month - 1).toLocaleString('default', { month: 'long' })} {period.year}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {selectedPeriod ? (
          <FancyCard className="mb-6 p-5">
            <h2 className="text-xl font-semibold mb-4">
              Spending for {new Date(2000, selectedPeriod.month - 1).toLocaleString('default', { month: 'long' })} {selectedPeriod.year}
            </h2>
            
            <SpendingManagement periodId={selectedPeriodId} />
          </FancyCard>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Please select a financial period above to view spending</p>
            <a href="/periods" className="btn btn-outline btn-primary">
              Manage Periods
            </a>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}