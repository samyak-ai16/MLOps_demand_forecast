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
  Sparkles,
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
    <div className="flex flex-col h-full bg-card/70 backdrop-blur-md">
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="size-9 rounded-xl flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 border border-indigo-200/60 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-400 shrink-0 shadow-sm">
            <Zap className="size-4 fill-indigo-500/20 text-indigo-600 dark:text-indigo-400" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-foreground truncate">
                MLOps Forecast
              </span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                <Sparkles className="size-2.5 text-indigo-400" /> Predictive AI
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-150",
                active
                  ? "bg-indigo-50/90 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 shadow-sm border border-indigo-100 dark:border-indigo-900/50"
                  : "text-muted-foreground hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-foreground",
                collapsed && "justify-center px-2 py-2"
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0 transition-transform duration-150",
                  active
                    ? "text-indigo-600 dark:text-indigo-300 scale-105"
                    : "text-slate-400 group-hover:text-foreground"
                )}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="p-3 border-t border-border/60">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl text-muted-foreground hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-foreground transition-all duration-150"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-50 lg:hidden p-2 rounded-xl bg-card/90 backdrop-blur-md border border-border/70 shadow-sm text-foreground hover:bg-muted"
      >
        <Menu className="size-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 h-full bg-card border-r border-border/70 shadow-xl animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
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
          "hidden lg:block h-screen sticky top-0 bg-card/50 backdrop-blur-sm border-r border-border/60 overflow-hidden transition-all duration-200 z-30",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
