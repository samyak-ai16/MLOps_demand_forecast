import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SupplyChain3DScene } from "@/components/3d/SupplyChain3DScene";
import { Network, Activity, Truck, AlertTriangle, ArrowRight, ShieldCheck, MapPin } from "lucide-react";

export default function SupplyChainPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/90 to-card/70 p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#00adb5]">
                <Network className="size-4" /> Global Logistics Topology
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">
                Multi-Echelon Supply Chain & Bottleneck Network
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Live visualization of product flow: Suppliers → Central Hub (Nagpur) → Regional Distribution (Mumbai, Pune, Nashik) → Channels.
              </p>
            </div>
          </div>
        </div>

        {/* 3D Scene */}
        <SupplyChain3DScene />

        {/* Operational Bottlenecks & KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span>Primary Supply Route</span>
              <Truck className="size-4 text-[#00adb5]" />
            </div>
            <div className="text-lg font-bold text-foreground">Chennai (Foxconn) → Nagpur Central</div>
            <p className="text-xs text-muted-foreground">Lead time: 7 days • Frequency: Bi-weekly container dispatch</p>
            <div className="pt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="size-3.5" /> Normal Transit Velocity
            </div>
          </div>

          <div className="rounded-2xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-400">
              <span>Active Congestion Alert</span>
              <AlertTriangle className="size-4 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="text-lg font-bold text-rose-900 dark:text-rose-200">Mumbai Harbor Fulfillment Port</div>
            <p className="text-xs text-rose-700 dark:text-rose-300">Dock congestion delaying inbound transfers by 1.8 days</p>
            <div className="pt-2 text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
              Reroute recommended via Pune distribution lanes
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span>Strategic Buffer Hub</span>
              <MapPin className="size-4 text-indigo-500" />
            </div>
            <div className="text-lg font-bold text-foreground">Nagpur Central Distribution Hub</div>
            <p className="text-xs text-muted-foreground">Geographic center of India with 78.4% capacity utilization</p>
            <div className="pt-2 text-[11px] text-[#00adb5] font-semibold flex items-center gap-1">
              Cross-dock turnaround: 14.2 hours average
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
