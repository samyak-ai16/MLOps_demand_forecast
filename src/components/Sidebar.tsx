import { useState } from "react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  BarChart3,
  Database,
  Brain,
  GitCompare,
  Workflow,
  Activity,
  AlertTriangle,
  FlaskConical,
  FileText,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { label: "Demand Forecast", path: "/dashboard/forecast", icon: TrendingUp },
  { label: "Products", path: "/dashboard/products", icon: Package },
  { label: "Sales Analytics", path: "/dashboard/analytics", icon: BarChart3 },
  { label: "Data Management", path: "/dashboard/data", icon: Database },
  { label: "Model Center", path: "/dashboard/models", icon: Brain },
  { label: "Model Comparison", path: "/dashboard/compare", icon: GitCompare },
  { label: "MLOps Pipeline", path: "/dashboard/pipeline", icon: Workflow },
  { label: "Model Monitoring", path: "/dashboard/monitoring", icon: Activity },
  { label: "Anomaly Detection", path: "/dashboard/anomalies", icon: AlertTriangle },
  { label: "What-If Analysis", path: "/dashboard/whatif", icon: FlaskConical },
  { label: "Reports", path: "/dashboard/reports", icon: FileText },
  { label: "System Logs", path: "/dashboard/logs", icon: ScrollText },
  { label: "Settings", path: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="nb-card-static p-3 flex items-center gap-2 bg-primary text-primary-foreground border-2">
        <Zap className="size-5 shrink-0" />
        {!collapsed && (
          <span className="font-bold text-sm tracking-tight truncate">MLOps Forecast</span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all border-2 border-transparent",
                active
                  ? "bg-primary text-primary-foreground border-border shadow-[2px_2px_0px] shadow-border"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex items-center justify-center p-2 border-t-2 border-border text-muted-foreground hover:bg-muted transition-colors"
      >
        {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-50 lg:hidden nb-btn bg-card p-2"
      >
        <Menu className="size-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full bg-card border-r-2 border-border shadow-[4px_0_0] shadow-border">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 p-1"
            >
              <X className="size-4" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:block h-screen sticky top-0 bg-card border-r-2 border-border overflow-hidden transition-all duration-200",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
