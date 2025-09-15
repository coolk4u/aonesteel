import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  User,
  Bell,
  Users,
  Warehouse,
  ClipboardCheck,
  UserCircle,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import logo from './assets/LOGO.png';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const distributorName =
    localStorage.getItem("distributorName") || "Distributor";

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Set initial sidebar state based on screen size
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("distributorAuth");
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("distributorAuth");
    localStorage.removeItem("distributorName");
    localStorage.removeItem("cart");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Package, label: "Product Catalog", path: "/catalog" },
    { icon: ShoppingCart, label: "My Cart", path: "/cart" },
    { icon: FileText, label: "Orders", path: "/orders" },
    { icon: Users, label: "Project Site", path: "/retailers" },
    { icon: Warehouse, label: 'Stock Management', path: '/stocks' },
    { icon: ClipboardCheck, label: 'GRN Management', path: '/grn' },
    { icon: UserCircle, label: "My Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-sidebar-background via-sidebar-accent to-sidebar-background transition-all duration-300 flex flex-col shadow-lg border-r border-sidebar-border ${
          isMobile
            ? `fixed left-0 top-0 h-full z-50 ${
                sidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"
              }`
            : `${sidebarOpen ? "w-64" : "w-16"}`
        }`}
      >
        {/* Mobile Close Button */}
        {isMobile && (
          <div className="flex justify-end p-4 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-gray-800 hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Logo Section */}
        <div className="p-4 lg:p-6 border-b border-sidebar-border/30">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl flex-shrink-0">
              <img
                src={logo}
                alt="A-One Steel Group Logo"
                className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 object-contain rounded-md"
              />
            </div>
            {(sidebarOpen || isMobile) && (
              <div>
                <h1 className="font-bold text-lg lg:text-xl text-gray-800">A-One Steel</h1>
                <p className="text-xs lg:text-sm text-gray-700">
                  Distributor Portal
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 lg:p-4 overflow-y-auto">
          <ul className="space-y-1 lg:space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center justify-between p-2.5 lg:p-3 rounded-xl transition-all duration-200 group ${
                    isActivePath(item.path)
                      ? "bg-white/20 backdrop-blur-sm text-gray-800 border-r-2 border-gray-800 shadow-lg"
                      : "hover:bg-white/10 text-gray-700 hover:text-gray-800"
                  }`}
                  title={!sidebarOpen && !isMobile ? item.label : ""}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon
                      className={`h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0 ${
                        isActivePath(item.path) ? "text-gray-800" : "text-gray-600"
                      }`}
                    />
                    {(sidebarOpen || isMobile) && (
                      <span
                        className={`font-medium text-sm lg:text-base ${
                          isActivePath(item.path)
                            ? "text-gray-800"
                            : "text-gray-700"
                        }`}
                      >
                        {item.label}
                      </span>
                    )}
                  </div>
                  {(sidebarOpen || isMobile) && isActivePath(item.path) && (
                    <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4 text-gray-800" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-3 lg:p-4 border-t border-sidebar-border/30">
          <div className="flex items-center space-x-3 mb-3 lg:mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-1.5 lg:p-2 rounded-full flex-shrink-0">
              <User className="h-4 w-4 lg:h-5 lg:w-5 text-gray-800" />
            </div>
            {(sidebarOpen || isMobile) && (
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm font-medium text-gray-800 truncate">
                  {distributorName}
                </p>
                <p className="text-xs text-gray-600">Active Distributor</p>
              </div>
            )}
          </div>

          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className={`w-full text-gray-700 hover:text-gray-800 hover:bg-white/10 border border-gray-400 text-xs lg:text-sm ${
              sidebarOpen || isMobile ? "justify-start" : "justify-center"
            }`}
            title={!sidebarOpen && !isMobile ? "Logout" : ""}
          >
            <LogOut className="h-3 w-3 lg:h-4 lg:w-4" />
            {(sidebarOpen || isMobile) && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-card/80 backdrop-blur-sm shadow-soft border-b border-border p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 lg:p-2 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              >
                <Menu className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>

              <div className="min-w-0 flex-1">
                <h2 className="text-lg lg:text-xl font-semibold text-foreground truncate">
                  {menuItems.find((item) => isActivePath(item.path))?.label ||
                    "Dashboard"}
                </h2>
                <p className="text-xs lg:text-sm text-muted-foreground truncate">
                  Welcome back, {distributorName}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-muted/50 p-1.5 lg:p-2 text-muted-foreground hover:text-foreground"
              >
                <Bell className="h-4 w-4 lg:h-5 lg:w-5 " />
                <span className="absolute bottom-5 left-4 bg-gradient-to-br from-red-800 via-red-600 to-red-900 text-destructive-foreground text-xs rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center">
                  3
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
