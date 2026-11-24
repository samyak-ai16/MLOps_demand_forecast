import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api, AlertItem } from "@/lib/api";
import {
  Bell, AlertTriangle, AlertCircle, CheckCircle2, ShieldCheck,
  Search, RefreshCw, Filter, ArrowUpRight
} from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await api.getAlerts();
      setAlerts(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  const filtered = alerts.filter((a) => {
    if (filterSeverity !== "all" && a.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/90 to-card/70 p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#00adb5]">
                <Bell className="size-4" /> Operational Intelligence Dispatch
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">
                Alerts, Stockout Warnings & Drift Notifications
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Automated event triggers for inventory stockouts, safety stock breaches, statistical feature drift, and MLOps pipeline status.
              </p>
            </div>
            <button
              onClick={loadAlerts}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-3">
          {["all", "critical", "high", "medium", "low"].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all ${
                filterSeverity === sev
                  ? "bg-[#00adb5] text-[#222831]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filtered.map((a) => {
            const isCrit = a.severity === "critical";
            const isHigh = a.severity === "high";
            const isMed = a.severity === "medium";
            return (
              <div
                key={a.id}
                className={`rounded-2xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCrit
                    ? "border-rose-300 dark:border-rose-950/80 bg-rose-50/40 dark:bg-rose-950/20"
                    : isHigh
                    ? "border-amber-300 dark:border-amber-950/80 bg-amber-50/40 dark:bg-amber-950/20"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isCrit
                        ? "bg-rose-100 text-rose-600 dark:bg-rose-900/40"
                        : isHigh
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40"
                        : "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40"
                    }`}
                  >
                    {isCrit || isHigh ? <AlertTriangle className="size-4" /> : <Bell className="size-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isCrit
                            ? "bg-rose-500 text-white"
                            : isHigh
                            ? "bg-amber-500 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {a.severity}
                      </span>
                      <span className="text-xs font-bold text-foreground">{a.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{a.message}</p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1.5">
                      <span>Source: {a.source}</span>
                      <span>•</span>
                      <span>{a.timestamp}</span>
                    </div>
                  </div>
                </div>

                {a.action_url && (
                  <Link
                    to={a.action_url}
                    className="self-end sm:self-center shrink-0 flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted transition-colors"
                  >
                    Take Action <ArrowUpRight className="size-3.5" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
