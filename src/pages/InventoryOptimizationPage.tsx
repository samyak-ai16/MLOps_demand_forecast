import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api, InventoryRecommendation, Warehouse } from "@/lib/api";
import {
  Boxes, AlertTriangle, ShieldCheck, TrendingUp, RefreshCw,
  Search, ArrowDownRight, ArrowUpRight, HelpCircle, CheckCircle2,
  Calendar, Layers, Filter
} from "lucide-react";
import { toast } from "sonner";

export default function InventoryOptimizationPage() {
  const [recommendations, setRecommendations] = useState<InventoryRecommendation[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWh, setSelectedWh] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeBreakdown, setActiveBreakdown] = useState<InventoryRecommendation | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedWh, selectedCategory]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [whList, recList] = await Promise.all([
        api.getWarehouses("comp_abc"),
        api.getInventoryRecommendations({
          warehouse_id: selectedWh !== "all" ? selectedWh : undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
        }),
      ]);
      setWarehouses(whList);
      setRecommendations(recList);
    } catch (e) {
      console.error(e);
      toast.error("Error loading inventory optimization recommendations");
    } finally {
      setLoading(false);
    }
  };

  const filtered = recommendations.filter((r) =>
    r.product_name.toLowerCase().includes(search.toLowerCase()) ||
    r.warehouse_name.toLowerCase().includes(search.toLowerCase())
  );

  const criticalCount = recommendations.filter((r) => r.stockout_risk === "Critical").length;
  const highCount = recommendations.filter((r) => r.stockout_risk === "High").length;
  const optimalCount = recommendations.filter((r) => r.stockout_risk === "Low").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/90 to-card/70 p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#00adb5]">
                <Boxes className="size-4" /> Predictive Replenishment Engine
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">
                AI Inventory Optimization & Safety Stock
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Calculate dynamic Reorder Points (ROP), Safety Stock (SS), and Economic Order Quantities (EOQ) using ML forecasted demand and supplier lead times.
              </p>
            </div>
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Recalculate
            </button>
          </div>
        </div>

        {/* Risk Overview Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/50 dark:bg-rose-950/20 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                Critical Stockouts Imminent
              </span>
              <AlertTriangle className="size-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="text-3xl font-extrabold text-rose-900 dark:text-rose-200 mt-2">
              {criticalCount} SKUs
            </div>
            <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">Current on-hand stock below lead time demand</p>
          </div>

          <div className="rounded-2xl border border-amber-200 dark:border-amber-950/60 bg-amber-50/50 dark:bg-amber-950/20 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                Reorder Triggered (Below ROP)
              </span>
              <Boxes className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-900 dark:text-amber-200 mt-2">
              {highCount} SKUs
            </div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Inventory breached threshold; purchase orders recommended</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                Optimal Stock Buffer
              </span>
              <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-2">
              {optimalCount} SKUs
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Adequate coverage for current demand horizon</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-3 rounded-2xl">
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <select
              value={selectedWh}
              onChange={(e) => setSelectedWh(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-[#00adb5]"
            >
              <option value="all">All Warehouses</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.city})
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-[#00adb5]"
            >
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="FMCG">FMCG & Food</option>
              <option value="Apparel">Apparel</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search product or warehouse..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-[#00adb5]"
            />
          </div>
        </div>

        {/* Recommendations Table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3.5">Product & Facility</th>
                  <th className="p-3.5">Current Stock</th>
                  <th className="p-3.5">Predicted Demand (7d)</th>
                  <th className="p-3.5">Safety Stock (SS)</th>
                  <th className="p-3.5">Reorder Point (ROP)</th>
                  <th className="p-3.5">Suggested Order</th>
                  <th className="p-3.5">Days Left</th>
                  <th className="p-3.5">Risk Level</th>
                  <th className="p-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r) => {
                  return (
                    <tr key={`${r.product_id}-${r.warehouse_id}`} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3.5 font-medium">
                        <div className="font-bold text-foreground">{r.product_name}</div>
                        <div className="text-[11px] text-muted-foreground">{r.warehouse_name}</div>
                      </td>
                      <td className="p-3.5 font-semibold text-foreground">{r.current_stock} units</td>
                      <td className="p-3.5 text-[#00adb5] font-bold">{r.predicted_demand_7d} units</td>
                      <td className="p-3.5 text-muted-foreground">{r.safety_stock} units</td>
                      <td className="p-3.5 font-bold text-foreground">{r.reorder_point} units</td>
                      <td className="p-3.5 font-semibold text-indigo-600 dark:text-indigo-400">
                        {r.reorder_quantity} units
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`font-bold ${
                            r.days_of_inventory_remaining < 7
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-foreground"
                          }`}
                        >
                          {r.days_of_inventory_remaining} days
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            r.stockout_risk === "Critical"
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300"
                              : r.stockout_risk === "High"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300"
                          }`}
                        >
                          {r.stockout_risk}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setActiveBreakdown(r)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-border hover:bg-[#00adb5] hover:text-[#222831] hover:border-[#00adb5] transition-all"
                        >
                          Formula
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Calculation Breakdown */}
        {activeBreakdown && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-start justify-between border-b border-border pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#00adb5]">
                    Inventory Optimization Breakdown
                  </span>
                  <h3 className="text-base font-bold text-foreground mt-0.5">
                    {activeBreakdown.product_name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{activeBreakdown.warehouse_name}</p>
                </div>
                <button
                  onClick={() => setActiveBreakdown(null)}
                  className="text-muted-foreground hover:text-foreground text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-muted/50 border border-border">
                  <div className="font-semibold text-foreground mb-1">Mathematical Formula:</div>
                  <code className="text-[11px] text-[#00adb5] font-mono">
                    ROP = (Average Daily Demand × Lead Time) + Safety Stock
                  </code>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Safety Stock (SS) = Z × sqrt(Lead Time) × σ_demand (Service Level: 95%, Z=1.65)
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border">
                  <div className="font-semibold text-foreground mb-1">Audit Trail Breakdown:</div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {activeBreakdown.calculation_breakdown}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-900/50">
                  <div className="font-semibold text-indigo-700 dark:text-indigo-300 mb-0.5">
                    Recommended Action:
                  </div>
                  <p className="text-xs text-indigo-900 dark:text-indigo-200">
                    {activeBreakdown.suggested_action}
                  </p>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setActiveBreakdown(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#00adb5] text-[#222831] hover:bg-[#00adb5]/90 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
