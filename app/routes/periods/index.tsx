import { RequireAuth } from "~/components/auth/components/auth-provider";
import { PeriodManagement } from "~/components/periods/period-management";
import type { Route } from "../+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Financial Periods | WinFin" },
    { name: "description", content: "Manage your monthly financial periods" },
  ];
}

export default function PeriodsPage() {
  return (
    <RequireAuth>
      <PeriodManagement />
    </RequireAuth>
  );
}