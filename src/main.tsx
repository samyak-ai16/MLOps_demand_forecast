import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Lazy load route components
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const DashboardOverview = lazy(() => import("./pages/Dashboard.tsx"));
const ForecastPage = lazy(() => import("./pages/ForecastPage.tsx"));
const DataManagement = lazy(() => import("./pages/DataManagementPage.tsx"));
const WarehouseManagementPage = lazy(() => import("./pages/WarehouseManagementPage.tsx"));
const ProductsPage = lazy(() => import("./pages/ProductsPage.tsx"));
const InventoryOptimizationPage = lazy(() => import("./pages/InventoryOptimizationPage.tsx"));
const SupplyChainPage = lazy(() => import("./pages/SupplyChainPage.tsx"));
const ModelCenter = lazy(() => import("./pages/ModelCenterPage.tsx"));
const ExperimentTrackingPage = lazy(() => import("./pages/ExperimentTrackingPage.tsx"));
const ModelRegistryPage = lazy(() => import("./pages/ModelRegistryPage.tsx"));
const PipelinePage = lazy(() => import("./pages/PipelinePage.tsx"));
const MonitoringPage = lazy(() => import("./pages/MonitoringPage.tsx"));
const AlertsPage = lazy(() => import("./pages/AlertsPage.tsx"));
const ReportsPage = lazy(() => import("./pages/ReportsPage.tsx"));
const SettingsPage = lazy(() => import("./pages/SettingsPage.tsx"));
const SalesAnalytics = lazy(() => import("./pages/SalesAnalyticsPage.tsx"));
const ModelCompare = lazy(() => import("./pages/ModelComparePage.tsx"));
const AnomalyPage = lazy(() => import("./pages/AnomalyPage.tsx"));
const WhatIfPage = lazy(() => import("./pages/WhatIfPage.tsx"));
const LogsPage = lazy(() => import("./pages/LogsPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#222831]">
      <div className="p-6 text-center space-y-3">
        <div className="size-10 rounded-2xl bg-[#00adb5]/20 border border-[#00adb5] flex items-center justify-center mx-auto text-[#00adb5] animate-spin">
          ✦
        </div>
        <div className="text-gray-300 font-bold text-sm tracking-wider">DemandFlow AI Loading...</div>
      </div>
    </div>
  );
}

class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode }, { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: Error) { console.warn("[VlyToolbar] Caught error:", err.message); }
  render() { return this.state.hasError ? null : this.props.children; }
}

class RootErrorBoundary extends React.Component<
  { children: React.ReactNode }, { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message || "Unknown error", stack: error.stack || "" };
  }
  componentDidCatch(err: Error) { console.error("[Root crash]:", err); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="bg-card max-w-lg text-center p-6 rounded-3xl border border-border">
            <p className="text-sm font-bold">Runtime Error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">{this.state.message}</p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground max-h-40 overflow-auto border border-border p-2 rounded-xl">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const FALLBACK_CONVEX_URL = "https://keen-cod-459.convex.cloud";
const convexUrl =
  (typeof import.meta.env.VITE_CONVEX_URL === "string" && import.meta.env.VITE_CONVEX_URL.trim() !== "")
    ? import.meta.env.VITE_CONVEX_URL.trim()
    : FALLBACK_CONVEX_URL;

let convex: ConvexReactClient;
try {
  convex = new ConvexReactClient(convexUrl);
} catch (e) {
  console.error("[Convex] Failed to initialize ConvexReactClient with URL:", convexUrl, e);
  convex = new ConvexReactClient(FALLBACK_CONVEX_URL);
}

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage({ type: "iframe-route-change", path: location.pathname }, "*");
  }, [location.pathname]);
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <RouteSyncer />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<AuthPage redirectAfterAuth="/dashboard" />} />
              <Route path="/dashboard" element={<RequireAuth><DashboardOverview /></RequireAuth>} />
              <Route path="/dashboard/forecast" element={<RequireAuth><ForecastPage /></RequireAuth>} />
              <Route path="/dashboard/data" element={<RequireAuth><DataManagement /></RequireAuth>} />
              <Route path="/dashboard/warehouses" element={<RequireAuth><WarehouseManagementPage /></RequireAuth>} />
              <Route path="/dashboard/products" element={<RequireAuth><ProductsPage /></RequireAuth>} />
              <Route path="/dashboard/inventory" element={<RequireAuth><InventoryOptimizationPage /></RequireAuth>} />
              <Route path="/dashboard/supply-chain" element={<RequireAuth><SupplyChainPage /></RequireAuth>} />
              <Route path="/dashboard/models" element={<RequireAuth><ModelCenter /></RequireAuth>} />
              <Route path="/dashboard/experiments" element={<RequireAuth><ExperimentTrackingPage /></RequireAuth>} />
              <Route path="/dashboard/registry" element={<RequireAuth><ModelRegistryPage /></RequireAuth>} />
              <Route path="/dashboard/pipeline" element={<RequireAuth><PipelinePage /></RequireAuth>} />
              <Route path="/dashboard/monitoring" element={<RequireAuth><MonitoringPage /></RequireAuth>} />
              <Route path="/dashboard/alerts" element={<RequireAuth><AlertsPage /></RequireAuth>} />
              <Route path="/dashboard/reports" element={<RequireAuth><ReportsPage /></RequireAuth>} />
              <Route path="/dashboard/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
              <Route path="/dashboard/analytics" element={<RequireAuth><SalesAnalytics /></RequireAuth>} />
              <Route path="/dashboard/compare" element={<RequireAuth><ModelCompare /></RequireAuth>} />
              <Route path="/dashboard/anomalies" element={<RequireAuth><AnomalyPage /></RequireAuth>} />
              <Route path="/dashboard/whatif" element={<RequireAuth><WhatIfPage /></RequireAuth>} />
              <Route path="/dashboard/logs" element={<RequireAuth><LogsPage /></RequireAuth>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
