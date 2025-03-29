import { Link } from "react-router";
import { Logo } from "~/components/common/logo";

export function Footer() {
  return (
    <footer className="bg-base-300 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <Logo className="w-10 h-10 mr-3" />
              <span className="text-xl font-bold">WinFin</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              © {new Date().getFullYear()} WinFin. All rights reserved.
            </p>
          </div>
          
          <div className="flex gap-8">
            <div>
              <h3 className="font-semibold mb-2">Product</h3>
              <ul className="text-sm space-y-1">
                <li><Link to="/features" className="hover:text-primary">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
                <li><Link to="/test" className="hover:text-primary">Test Page</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Company</h3>
              <ul className="text-sm space-y-1">
                <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-primary">Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}