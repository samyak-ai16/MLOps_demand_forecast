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
const ProductsPage = lazy(() => import("./pages/ProductsPage.tsx"));
const SalesAnalytics = lazy(() => import("./pages/SalesAnalyticsPage.tsx"));
const DataManagement = lazy(() => import("./pages/DataManagementPage.tsx"));
const ModelCenter = lazy(() => import("./pages/ModelCenterPage.tsx"));
const ModelCompare = lazy(() => import("./pages/ModelComparePage.tsx"));
const PipelinePage = lazy(() => import("./pages/PipelinePage.tsx"));
const MonitoringPage = lazy(() => import("./pages/MonitoringPage.tsx"));
const AnomalyPage = lazy(() => import("./pages/AnomalyPage.tsx"));
const WhatIfPage = lazy(() => import("./pages/WhatIfPage.tsx"));
const ReportsPage = lazy(() => import("./pages/ReportsPage.tsx"));
const LogsPage = lazy(() => import("./pages/LogsPage.tsx"));
const SettingsPage = lazy(() => import("./pages/SettingsPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="nb-card-static bg-card p-6 text-center">
        <div className="animate-pulse text-muted-foreground font-bold text-sm">Loading...</div>
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
          <div className="nb-card-static bg-card max-w-lg text-center p-6">
            <p className="text-sm font-bold">Runtime Error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">{this.state.message}</p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground max-h-40 overflow-auto border-2 border-border p-2">
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

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

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
              <Route path="/dashboard/products" element={<RequireAuth><ProductsPage /></RequireAuth>} />
              <Route path="/dashboard/analytics" element={<RequireAuth><SalesAnalytics /></RequireAuth>} />
              <Route path="/dashboard/data" element={<RequireAuth><DataManagement /></RequireAuth>} />
              <Route path="/dashboard/models" element={<RequireAuth><ModelCenter /></RequireAuth>} />
              <Route path="/dashboard/compare" element={<RequireAuth><ModelCompare /></RequireAuth>} />
              <Route path="/dashboard/pipeline" element={<RequireAuth><PipelinePage /></RequireAuth>} />
              <Route path="/dashboard/monitoring" element={<RequireAuth><MonitoringPage /></RequireAuth>} />
              <Route path="/dashboard/anomalies" element={<RequireAuth><AnomalyPage /></RequireAuth>} />
              <Route path="/dashboard/whatif" element={<RequireAuth><WhatIfPage /></RequireAuth>} />
              <Route path="/dashboard/reports" element={<RequireAuth><ReportsPage /></RequireAuth>} />
              <Route path="/dashboard/logs" element={<RequireAuth><LogsPage /></RequireAuth>} />
              <Route path="/dashboard/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
