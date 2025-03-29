import { useState, useEffect } from "react";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { CreatePeriodButton } from "./create-period-button";
import { usePeriodService, type Period } from "~/hooks/use-period-service";

interface PeriodSelectorProps {
  onPeriodChange: (period: Period) => void;
  selectedPeriodId?: string;
  className?: string;
}

export function PeriodSelector({ onPeriodChange, selectedPeriodId, className = "" }: PeriodSelectorProps) {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const { getAllPeriods } = usePeriodService();

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

  const handlePeriodChange = (period: Period | null) => {
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

  return (
    <div className={`flex items-center ${className}`}>
      <button
        className="btn btn-ghost btn-sm btn-circle"
        disabled={!selectedPeriod || periods.findIndex(p => p.id === selectedPeriod.id) === periods.length - 1}
        onClick={navigateToPreviousPeriod}
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
      
      <div className="dropdown dropdown-bottom">
        <div tabIndex={0} role="button" className="btn btn-sm min-w-40 flex items-center justify-between gap-1">
          <CalendarIcon className="w-4 h-4" />
          <span className="truncate">
            {loading ? 'Loading...' : formatPeriod(selectedPeriod)}
          </span>
        </div>
        
        <ul tabIndex={0} className="dropdown-content z-[1] menu shadow-lg bg-base-100 rounded-box w-52 max-h-60 overflow-y-auto">
          {periods.length === 0 ? (
            <li className="menu-title">
              <span>No periods available</span>
            </li>
          ) : (
            periods.map(period => (
              <li key={period.id}>
                <a 
                  className={selectedPeriod?.id === period.id ? 'active' : ''}
                  onClick={() => handlePeriodChange(period)}
                >
                  {formatPeriod(period)}
                </a>
              </li>
            ))
          )}
        </ul>
      </div>
      
      <button
        className="btn btn-ghost btn-sm btn-circle"
        disabled={!selectedPeriod || periods.findIndex(p => p.id === selectedPeriod.id) === 0}
        onClick={navigateToNextPeriod}
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
}