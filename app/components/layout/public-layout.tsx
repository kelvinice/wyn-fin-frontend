import { type ReactNode } from "react";
import { useLocation } from "react-router";
import { Header } from "./header";
import { Footer } from "./footer";

interface PublicLayoutProps {
  children: ReactNode;
  transparentHeader?: boolean;
}

export function PublicLayout({ children, transparentHeader = false }: PublicLayoutProps) {
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/home";
  
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Header 
        transparentBg={transparentHeader} 
        homePage={isHomePage}
      />
      <main className="flex-grow mt-[-60px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}