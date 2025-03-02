import { Outlet } from "react-router";
import { RequireAuth } from "~/components/auth/components/auth-provider";

export default function AppLayout() {
  return (
    <RequireAuth>
      {/* This layout could include shared navigation, sidebar, etc. */}
      <div className="app-layout">
        <Outlet />
      </div>
    </RequireAuth>
  );
}