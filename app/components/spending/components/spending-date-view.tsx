import type { Spending } from "~/models/spending";

import { SpendingList } from "../spending-list";
import { formatDate } from "~/utils/date-utils";

interface SpendingDateViewProps {
  sortedDates: string[];
  spendingsByDate: Record<string, Spending[]>;
  getClassification: (id: string | number | undefined) => any;
  getBudget: (id: string | number | undefined) => any;
  onEdit: (spending: Spending) => void;
  onDelete: (id: string) => void;
  currency: string;
}

export function SpendingDateView({
  sortedDates,
  spendingsByDate,
  getClassification,
  getBudget,
  onEdit,
  onDelete,
  currency
}: SpendingDateViewProps) {
  return (
    <div className="space-y-8">
      {sortedDates.map(date => (
        <div key={date} className="space-y-3">
          <h3 className="text-xl font-semibold pl-2 border-l-4 border-primary">
            {formatDate(date)}
          </h3>
          <SpendingList
            spendings={spendingsByDate[date]}
            getClassification={getClassification}
            getBudget={getBudget}
            onEdit={onEdit}
            onDelete={onDelete}
            currency={currency}
          />
        </div>
      ))}
    </div>
  );
}