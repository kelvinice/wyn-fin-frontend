import { Link, useLocation } from "react-router";

export function NavLinkItem({
  to,
  children,
  className,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li className={className} onClick={onClick}>
      <Link
        to={to}
        className={`
          px-4 py-2 rounded-lg font-medium 
          transition-all duration-200 
          outline-hidden focus:bg-primary/10 focus:text-primary
          ${
            isActive
              ? "text-primary"
              : "text-gray-500 hover:text-primary hover:bg-primary/5"
          }
        `}
      >
        {children}
      </Link>
    </li>
  );
}
