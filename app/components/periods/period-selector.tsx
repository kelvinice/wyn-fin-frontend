import { useState, useEffect, useMemo } from "react";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { CreatePeriodButton } from "./create-period-button";
import { usePeriodService, type Period } from "~/hooks/use-period-service";

interface PeriodSelectorProps {
  onPeriodChange: (period: Period) => void;
  selectedPeriodId?: string;
  className?: string;
  showCreateButton?: boolean;
}

export function PeriodSelector({ 
  onPeriodChange, 
  selectedPeriodId, 
  className = "",
  showCreateButton = true
}: PeriodSelectorProps) {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const { getAllPeriods } = usePeriodService();

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
    return Object.keys(periodsByYear).map(Number).sort((a, b) => b - a);
  }, [periodsByYear]);

  // Load periods on component mount
  useEffect(() => {
    loadPeriods();
  }, [selectedPeriodId]);

  const loadPeriods = async () => {
    try {
      setLoading(true);
      const data = await getAllPeriods();
      // Sort periods by year (descending) and then by month (descending)
      const sortedData = data.sort((a: Period, b: Period) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });
      
      setPeriods(sortedData);
      
      // If selectedPeriodId is provided, select that period
      if (selectedPeriodId) {
        const period = sortedData.find((p: Period) => p.id === selectedPeriodId);
        if (period) {
          setSelectedPeriod(period);
          onPeriodChange(period);
          return;
        }
      }
      
      // Otherwise select the most recent period, or null if none exists
      if (sortedData.length > 0) {
        setSelectedPeriod(sortedData[0]);
        onPeriodChange(sortedData[0]);
      } else {
        setSelectedPeriod(null);
      }
    } catch (error) {
      console.error('Error loading periods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
    onPeriodChange(period);
  };

  const navigateToPreviousPeriod = () => {
    if (!selectedPeriod || periods.length <= 1) return;
    
    const currentIndex = periods.findIndex(p => p.id === selectedPeriod.id);
    if (currentIndex < periods.length - 1) {
      handlePeriodChange(periods[currentIndex + 1]);
    }
  };

  const navigateToNextPeriod = () => {
    if (!selectedPeriod || periods.length <= 1) return;
    
    const currentIndex = periods.findIndex(p => p.id === selectedPeriod.id);
    if (currentIndex > 0) {
      handlePeriodChange(periods[currentIndex - 1]);
    }
  };

  // Format the period display
  const formatPeriod = (period: Period | null) => {
    if (!period) return 'No period available';
    
    const monthName = new Date(period.year, period.month - 1).toLocaleString('default', { month: 'long' });
    return `${monthName} ${period.year}`;
  };

  // Get month name utility
  const getMonthName = (month: number) => {
    return new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' });
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        className="btn btn-ghost btn-sm btn-circle"
        disabled={!selectedPeriod || periods.findIndex(p => p.id === selectedPeriod.id) === periods.length - 1}
        onClick={navigateToPreviousPeriod}
        aria-label="Previous period"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
      
      <div className="dropdown dropdown-bottom">
        <div tabIndex={0} role="button" className="btn min-w-40 flex items-center justify-between gap-2">
          <CalendarIcon className="w-5 h-5" />
          <span className="truncate">
            {loading ? 'Loading...' : formatPeriod(selectedPeriod)}
          </span>
        </div>
        
        <ul tabIndex={0} className="dropdown-content z-[1] menu shadow-lg bg-base-100 rounded-box w-64 max-h-96 overflow-y-auto p-0">
          {periods.length === 0 ? (
            <li className="menu-title p-4 text-center">
              <span>No periods available</span>
            </li>
          ) : (
            <>
              {years.map(year => (
                <li key={year} className="menu-section">
                  <div className="bg-base-200 px-4 py-2 font-semibold sticky top-0">
                    {year}
                  </div>
                  <ul className="p-0">
                    {periodsByYear[year]
                      .sort((a, b) => b.month - a.month)
                      .map(period => (
                        <li key={period.id}>
                          <a 
                            className={selectedPeriod?.id === period.id ? 'active' : ''}
                            onClick={() => handlePeriodChange(period)}
                          >
                            {getMonthName(period.month)}
                            {period.year === new Date().getFullYear() && 
                             period.month === new Date().getMonth() + 1 && (
                              <span className="badge badge-sm badge-primary ml-2">Current</span>
                            )}
                          </a>
                        </li>
                      ))
                    }
                  </ul>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
      
      <button
        className="btn btn-ghost btn-sm btn-circle"
        disabled={!selectedPeriod || periods.findIndex(p => p.id === selectedPeriod.id) === 0}
        onClick={navigateToNextPeriod}
        aria-label="Next period"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>

      {showCreateButton && (
        <CreatePeriodButton 
          onPeriodCreated={loadPeriods}
          size="sm"
          variant="outline"
          label="New"
        />
      )}
    </div>
  );
}