import { Outlet, useLocation } from "react-router";
import { PublicLayout } from "~/components/layout/public-layout";

export default function PublicRootLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/home";
  
  // Only the homepage gets the transparent header
  return (
    <PublicLayout transparentHeader={false}>
      <Outlet />
    </PublicLayout>
  );
}