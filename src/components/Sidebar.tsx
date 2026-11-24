import { useState } from "react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingUp,
  Database,
  Building2,
  Package,
  Boxes,
  Network,
  Brain,
  FlaskConical,
  Layers,
  Workflow,
  Activity,
  Bell,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Sparkles,
} from "lucide-react";

export const navItems = [
  { label: "Overview Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Demand Forecasting", path: "/dashboard/forecast", icon: TrendingUp },
  { label: "Data Management", path: "/dashboard/data", icon: Database },
  { label: "Warehouse Management", path: "/dashboard/warehouses", icon: Building2 },
  { label: "Product Management", path: "/dashboard/products", icon: Package },
  { label: "Inventory Management", path: "/dashboard/inventory", icon: Boxes },
  { label: "Supply Chain Analytics", path: "/dashboard/supply-chain", icon: Network },
  { label: "ML Models", path: "/dashboard/models", icon: Brain },
  { label: "Experiment Tracking", path: "/dashboard/experiments", icon: FlaskConical },
  { label: "Model Registry", path: "/dashboard/registry", icon: Layers },
  { label: "Pipeline Management", path: "/dashboard/pipeline", icon: Workflow },
  { label: "Model Monitoring", path: "/dashboard/monitoring", icon: Activity },
  { label: "Alerts & Notifications", path: "/dashboard/alerts", icon: Bell },
  { label: "Reports & Exports", path: "/dashboard/reports", icon: FileText },
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
    <div className="flex flex-col h-full bg-[#222831] text-white">
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#393e46]">
        <Link to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="size-9 rounded-xl flex items-center justify-center bg-[#00adb5] text-[#222831] font-black shrink-0 shadow-sm">
            <Zap className="size-5 fill-[#222831]" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-white truncate">
                DemandFlow AI
              </span>
              <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                <Sparkles className="size-2.5 text-[#00adb5]" /> Enterprise MLOps
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Links */}
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
                "flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150",
                active
                  ? "bg-[#00adb5] text-[#222831] font-bold shadow-md shadow-[#00adb5]/20"
                  : "text-gray-300 hover:bg-[#393e46] hover:text-white",
                collapsed && "justify-center px-2 py-2"
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0 transition-transform duration-150",
                  active ? "text-[#222831] scale-105" : "text-gray-400"
                )}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User info */}
      <div className="p-3 border-t border-[#393e46] flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2 truncate text-xs text-gray-400">
            <span className="size-2 rounded-full bg-[#00adb5] animate-pulse" />
            <span className="truncate font-medium">ABC Retail • Online</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-[#393e46] text-gray-400 hover:text-white transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-[#393e46] h-screen sticky top-0 transition-all duration-300 z-30 shrink-0",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="size-9 rounded-xl bg-[#222831] border border-[#393e46] text-white flex items-center justify-center shadow-lg"
        >
          <Zap className="size-4 text-[#00adb5]" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full z-50 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
