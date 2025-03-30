import { useState, useMemo } from "react";
import { CalendarIcon, ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import { CreatePeriodButton } from "./create-period-button";
import { type Period } from "~/hooks/use-period-service";

interface EnhancedPeriodSelectorProps {
  periods: Period[];
  selectedPeriod: Period | null;
  onPeriodChange: (period: Period) => void;
  isLoading?: boolean;
  showCreateButton?: boolean;
}

export function EnhancedPeriodSelector({
  periods,
  selectedPeriod,
  onPeriodChange,
  isLoading = false,
  showCreateButton = true
}: EnhancedPeriodSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Group periods by year
  const periodsByYear = useMemo(() => {
    return periods.reduce<Record<number, Period[]>>((acc, period) => {
      if (!acc[period.year]) {
        acc[period.year] = [];
      }
      acc[period.year].push(period);
      return acc;
    }, {});
  }, [periods]);

  // Sort years descending
  const years = useMemo(() => {
    return Object.keys(periodsByYear)
      .map(Number)
      .sort((a, b) => b - a);
  }, [periodsByYear]);

  // Format the period display
  const formatPeriod = (period: Period | null) => {
    if (!period) return 'Select period';
    
    const monthName = getMonthName(period.month);
    return `${monthName} ${period.year}`;
  };

  const handlePeriodSelect = (period: Period) => {
    onPeriodChange(period);
    setIsDropdownOpen(false);
  };

  const isCurrentPeriod = (period: Period) => {
    const now = new Date();
    return period.year === now.getFullYear() && period.month === now.getMonth() + 1;
  };

  return (
    <div className="flex items-center gap-2">
      <div className="dropdown dropdown-bottom w-full max-w-xs relative">
        <button 
          className="btn btn-outline w-full flex justify-between items-center"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={isLoading}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <span className="truncate">
              {isLoading ? 'Loading...' : formatPeriod(selectedPeriod)}
            </span>
          </div>
          <ChevronDownIcon className="h-4 w-4" />
        </button>
        
        {isDropdownOpen && (
          <div className="dropdown-content z-[1] mt-1 p-2 shadow-lg bg-base-100 rounded-box w-full max-h-96 overflow-y-auto">
            {periods.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No periods available
              </div>
            ) : (
              <div className="space-y-2">
                {years.map(year => (
                  <div key={year} className="space-y-1">
                    <div className="font-semibold text-sm px-3 py-1 bg-base-200 sticky top-0">
                      {year}
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {periodsByYear[year]
                        .sort((a, b) => a.month - b.month)
                        .map(period => (
                          <button
                            key={period.id}
                            className={`btn btn-sm w-full justify-start ${
                              selectedPeriod?.id === period.id 
                                ? 'btn-primary' 
                                : 'btn-ghost'
                            }`}
                            onClick={() => handlePeriodSelect(period)}
                          >
                            <span className="truncate">
                              {getMonthName(period.month)}
                              {isCurrentPeriod(period) && (
                                <span className="badge badge-xs badge-primary ml-2">
                                  Current
                                </span>
                              )}
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {showCreateButton && (
        <CreatePeriodButton 
          onPeriodCreated={() => setIsDropdownOpen(false)}
          size="md"
          variant="primary"
          label="New"
          showIcon={true}
        />
      )}
    </div>
  );
}

// Helper function to get month name
function getMonthName(month: number) {
  return new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' });
}