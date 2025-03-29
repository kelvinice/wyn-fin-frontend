import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation, Outlet } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { RequireAuth, useAuthUser, useIsAuthenticated, useSignOut } from "~/components/auth/components/auth-provider";
import { useToast } from "~/components/common/toast-context";
import { LoadingButton } from "~/components/auth/components/loading-button";
import { ThemeSwitcher } from "~/components/common/theme-switcher";
import { useUsersService } from "~/hooks/use-service";
import type { User } from "~/components/auth/core/models";
import { 
  HomeIcon, 
  ChartPieIcon, 
  DocumentTextIcon,
  Cog6ToothIcon,
  BanknotesIcon,
  ArchiveBoxIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  BellIcon,
  ChevronDownIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";

// Define notification type
type Notification = {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  date: Date;
};

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Sample notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Budget Alert",
      message: "You've reached 80% of your monthly budget for Groceries",
      type: "warning",
      read: false,
      date: new Date(Date.now() - 3600000) // 1 hour ago
    },
    {
      id: 2,
      title: "Payment Due",
      message: "Credit card payment due in 3 days",
      type: "info",
      read: false,
      date: new Date(Date.now() - 86400000) // 1 day ago
    },
    {
      id: 3,
      title: "Budget Created",
      message: "March 2025 budget created successfully",
      type: "success",
      read: true,
      date: new Date(Date.now() - 259200000) // 3 days ago
    }
  ]);
  
  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? {...notification, read: true} : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({...notification, read: true}))
    );
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Get the authenticated users service
  const usersService = useUsersService();
  
  // Track expanded state for nested menu items
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    finances: true,
  });

  const toggleExpand = (key: string) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  // Fetch user profile data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      
      usersService.getMe()
        .then(user => {
          setProfileData(user);
        })
        .catch(error => {
          showToast("Error loading profile data", "error");
          console.error("Profile error:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isAuthenticated]);
  
  const handleSignOut = () => {
    signOut();
    showToast("You have been signed out successfully", "info");
    navigate("/auth/login");
  };
  
  // Get user data from auth state
  const user = auth;
  
  // Navigation items for sidebar with nesting support
  const navigationItems = [
    { path: "/", icon: <HomeIcon className="w-5 h-5" />, label: "Home" },
    { path: "/dashboard", icon: <ChartPieIcon className="w-5 h-5" />, label: "Dashboard" },
    { 
      key: "finances",
      icon: <CurrencyDollarIcon className="w-5 h-5" />,
      label: "Finances",
      children: [
        { path: "/budget", icon: <BanknotesIcon className="w-4 h-4" />, label: "Budget" },
        { path: "/spending", icon: <DocumentTextIcon className="w-4 h-4" />, label: "Spending" },
        { path: "/categories", icon: <ArchiveBoxIcon className="w-4 h-4" />, label: "Categories" },
      ]
    },
    { path: "/profile", icon: <UserCircleIcon className="w-5 h-5" />, label: "Profile" },
    { path: "/settings", icon: <Cog6ToothIcon className="w-5 h-5" />, label: "Settings" },
  ];
  
  // Function to check if path is active
  const isPathActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Function to check if a parent menu should be highlighted
  const isParentActive = (children: {path: string}[]) => {
    return children.some(child => isPathActive(child.path));
  };

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };
  
  return (
    <RequireAuth>
      <div className="flex min-h-screen bg-base-100">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex flex-col bg-base-200 w-64 border-r border-base-300 shadow-sm">
          <div className="p-4 border-b border-base-300 bg-base-200/80 backdrop-blur-sm sticky top-0 z-20">
            <Link to="/" className="flex items-center gap-2 text-lg font-bold">
              <span className="text-primary">WinFin</span>
            </Link>
          </div>
          
          <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
            {navigationItems.map((item, idx) => 
              'children' in item ? (
                <div key={item.key || idx} className="mb-1">
                  <button 
                    onClick={() => toggleExpand(item.key)} 
                    className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition-colors ${
                      isParentActive((item as any).children) 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-base-300 text-base-content"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isParentActive((item as any).children) ? "text-primary" : "text-gray-500"}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronDownIcon 
                      className={`w-4 h-4 transition-transform ${expandedItems[item.key] ? 'transform rotate-180' : ''}`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {expandedItems[item.key] && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-4 mt-1"
                      >
                        {(item as any).children.map((child: any) => (
                          <Link 
                            key={child.path} 
                            to={child.path}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors mb-0.5 ${
                              isPathActive(child.path) 
                                ? "bg-primary/10 text-primary" 
                                : "hover:bg-base-300 text-base-content"
                            }`}
                          >
                            <span className={isPathActive(child.path) ? "text-primary" : "text-gray-500"}>
                              {child.icon}
                            </span>
                            <span className="text-sm">{child.label}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isPathActive(item.path) 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-base-300 text-base-content"
                  }`}
                >
                  <span className={isPathActive(item.path) ? "text-primary" : "text-gray-500"}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            )}
          </nav>
        </aside>
        
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <header className="bg-primary text-primary-content shadow-md sticky top-0 z-30">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              {/* Mobile menu button */}
              <button 
                className="md:hidden btn btn-ghost btn-sm"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              
              <div className="flex items-center">
                <h1 className="text-2xl font-bold">WinFin</h1>
                <div className="hidden md:flex ml-8 items-center gap-1">
                  <span className="text-xs text-primary-content/70">
                    {location.pathname === '/dashboard' 
                      ? 'Dashboard'
                      : location.pathname.split('/').filter(Boolean).map(p => 
                          p.charAt(0).toUpperCase() + p.slice(1)
                        ).join(' > ')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Notifications dropdown */}
                <div className="dropdown dropdown-end">
                  <div 
                    tabIndex={0} 
                    role="button" 
                    className="btn btn-ghost btn-circle"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                  >
                    <div className="indicator">
                      <BellIcon className="w-6 h-6" />
                      {unreadCount > 0 && (
                        <span className="badge badge-sm badge-error indicator-item">{unreadCount}</span>
                      )}
                    </div>
                  </div>
                  
                  <div 
                    tabIndex={0} 
                    className={`dropdown-content z-[1] menu shadow-lg rounded-box w-80 bg-base-100 text-base-content mt-3 ${
                      notificationsOpen ? 'block' : 'hidden'
                    }`}
                  >
                    <div className="p-3 border-b border-base-300 flex justify-between items-center">
                      <h3 className="font-medium">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          className="btn btn-ghost btn-xs"
                          onClick={markAllAsRead}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div 
                            key={notification.id}
                            className={`px-4 py-3 border-b border-base-200 cursor-pointer hover:bg-base-200 transition-colors ${
                              !notification.read ? 'bg-base-200/50' : ''
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 mt-2 rounded-full ${
                                !notification.read 
                                  ? notification.type === 'warning' 
                                    ? 'bg-warning' 
                                    : notification.type === 'error' 
                                      ? 'bg-error' 
                                      : notification.type === 'success' 
                                        ? 'bg-success' 
                                        : 'bg-info' 
                                  : 'bg-transparent'
                              }`}></div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h4 className="font-medium text-sm">{notification.title}</h4>
                                  <span className="text-xs text-gray-500">{formatRelativeTime(notification.date)}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No notifications
                        </div>
                      )}
                    </div>
                    
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-base-300 text-center">
                        <button className="btn btn-ghost btn-xs w-full">View all notifications</button>
                      </div>
                    )}
                  </div>
                </div>
                
                <ThemeSwitcher />
                <span className="text-sm hidden md:inline-block">
                  Welcome, {user?.email || "User"}
                </span>
                
                {/* Profile dropdown - mobile */}
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full bg-primary-content/20 flex items-center justify-center">
                      <UserCircleIcon className="w-full h-full" />
                    </div>
                  </div>
                  <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 text-base-content rounded-box w-52">
                    <li>
                      <Link to="/profile" className="justify-between">
                        Profile
                      </Link>
                    </li>
                    <li><Link to="/settings">Settings</Link></li>
                    <li><button onClick={handleSignOut}>Sign Out</button></li>
                  </ul>
                </div>
              </div>
            </div>
          </header>
          
          {/* Mobile Navigation Drawer */}
          <AnimatePresence>
            {mobileNavOpen && (
              <>
                <motion.div 
                  className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setMobileNavOpen(false)}
                />
                <motion.div 
                  className="fixed inset-y-0 left-0 max-w-xs w-full bg-base-100 shadow-xl z-50 md:hidden"
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  transition={{ duration: 0.3 }}
                  onClick={e => e.stopPropagation()}
                >
                  <div className="p-4 border-b border-base-300 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-lg font-bold" onClick={() => setMobileNavOpen(false)}>
                      <span className="text-primary">WinFin</span>
                    </Link>
                    <button className="btn btn-ghost btn-sm" onClick={() => setMobileNavOpen(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-4 border-b border-base-300 flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 rounded-full bg-primary-content/20 flex items-center justify-center">
                        <UserCircleIcon className="w-full h-full" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{user?.email || "User"}</p>
                      <p className="text-xs text-gray-500">Account Settings</p>
                    </div>
                  </div>
                  
                  <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto max-h-[calc(100vh-200px)]">
                    {navigationItems.map((item, idx) => 
                      'children' in item ? (
                        <div key={item.key || idx} className="mb-1">
                          <button 
                            onClick={() => toggleExpand(item.key)} 
                            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors ${
                              isParentActive((item as any).children) 
                                ? "bg-primary/10 text-primary" 
                                : "hover:bg-base-300 text-base-content"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={isParentActive((item as any).children) ? "text-primary" : "text-gray-500"}>
                                {item.icon}
                              </span>
                              <span className="font-medium">{item.label}</span>
                            </div>
                            <ChevronDownIcon 
                              className={`w-4 h-4 transition-transform ${expandedItems[item.key] ? 'transform rotate-180' : ''}`}
                            />
                          </button>
                          
                          <AnimatePresence>
                            {expandedItems[item.key] && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden pl-4 mt-1"
                              >
                                {(item as any).children.map((child: any) => (
                                  <Link 
                                    key={child.path} 
                                    to={child.path}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors mb-0.5 ${
                                      isPathActive(child.path) 
                                        ? "bg-primary/10 text-primary" 
                                        : "hover:bg-base-300 text-base-content"
                                    }`}
                                    onClick={() => setMobileNavOpen(false)}
                                  >
                                    <span className={isPathActive(child.path) ? "text-primary" : "text-gray-500"}>
                                      {child.icon}
                                    </span>
                                    <span className="text-sm">{child.label}</span>
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link 
                          key={item.path} 
                          to={item.path}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            isPathActive(item.path) 
                              ? "bg-primary/10 text-primary" 
                              : "hover:bg-base-300 text-base-content"
                          }`}
                          onClick={() => setMobileNavOpen(false)}
                        >
                          <span className={isPathActive(item.path) ? "text-primary" : "text-gray-500"}>
                            {item.icon}
                          </span>
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      )
                    )}
                  </nav>
                  
                  <div className="p-4 border-t border-base-300 sticky bottom-0">
                    <button 
                      className="flex items-center w-full gap-3 px-4 py-3 rounded-lg text-error hover:bg-error/10 transition-colors"
                      onClick={() => {
                        setMobileNavOpen(false);
                        handleSignOut();
                      }}
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
          
          {/* This is where child routes will be rendered */}
          <main className="container mx-auto p-6 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}