import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, Package, DollarSign, Target,
  Activity, Zap, Clock, ShieldCheck, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Sparkles, BarChart3,
  Building2, Layers, Network, Boxes, ArrowRight
} from "lucide-react";
import { Link } from "react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  kpiData, products, getMonthlySales, getDailySales,
  getCategoryPerformance, aiInsights, anomalies,
} from "@/lib/demo-data";
import { api, Warehouse } from "@/lib/api";

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "14px",
  boxShadow: "0 8px 30px -4px rgba(0, 0, 0, 0.12)",
  fontSize: "12px",
  padding: "8px 12px",
};

function KPICard({ label, value, change, icon: Icon, color }: {
  label: string; value: string | number; change?: string;
  icon: React.ComponentType<{ className?: string }>; color: string;
}) {
  const isPositive = change?.startsWith("+");
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 hover:shadow-md hover:border-[#00adb5]/50 transition-all duration-150">
      <div className="flex items-start justify-between mb-3">
        <div className={`size-8 rounded-xl flex items-center justify-center ${color} shadow-xs`}>
          <Icon className="size-4" />
        </div>
        {change && (
          <span
            className={`rounded-full text-[10px] font-semibold px-2 py-0.5 flex items-center gap-0.5 ${
              isPositive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/50"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/50"
            }`}
          >
            {isPositive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-black tracking-tight text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5 font-semibold">{label}</div>
    </div>
  );
}

export default function DashboardOverview() {
  const [insightIdx, setInsightIdx] = useState(0);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWh, setSelectedWh] = useState("all");

  useEffect(() => {
    api.getWarehouses("comp_abc").then(setWarehouses).catch(console.error);
  }, []);

  const monthlySales = getMonthlySales();
  const dailySales = getDailySales(30);
  const categoryPerf = getCategoryPerformance();
  const topProducts = [...products].sort((a, b) => b.predictedDemand - a.predictedDemand).slice(0, 6);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Executive Header Banner */}
        <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/90 to-card/70 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#00adb5] uppercase tracking-wider">
                <Building2 className="size-4" /> ABC Retail Distribution • Enterprise Overview
              </div>
              <h1 className="text-2xl font-black tracking-tight text-foreground mt-1">
                DemandFlow AI Command Center
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                Real-time MLOps demand predictions, 3D warehouse twin metrics, and multi-echelon replenishment.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={selectedWh}
                onChange={(e) => setSelectedWh(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border bg-card font-semibold focus:ring-2 focus:ring-[#00adb5]"
              >
                <option value="all">All Hubs (Maharashtra Network)</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.city})
                  </option>
                ))}
              </select>

              <div className="flex gap-1.5">
                {[
                  { label: "Pipeline", value: kpiData.pipelineStatus, color: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300" },
                  { label: "Drift", value: kpiData.driftStatus, color: "bg-[#00adb5]/10 text-[#00adb5] border-[#00adb5]/30" },
                  { label: "Health", value: kpiData.modelHealth, color: "bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-950/50 dark:text-indigo-300" },
                ].map((s) => (
                  <span
                    key={s.label}
                    className={`rounded-full px-3 py-1 text-xs font-bold border shadow-2xs ${s.color}`}
                  >
                    {s.label}: {s.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3D Visual Navigation Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/dashboard/warehouses"
            className="group rounded-2xl border border-border/80 bg-card p-5 hover:border-[#00adb5] hover:shadow-lg transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-[#00adb5]/10 text-[#00adb5] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Layers className="size-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#00adb5]">Spatial Intelligence</span>
                <h3 className="text-base font-bold text-foreground mt-0.5">3D Warehouse Digital Twin</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Inspect multi-level rack occupancy, low stock alerts, and storage zones in 3D.
                </p>
              </div>
            </div>
            <ArrowRight className="size-5 text-muted-foreground group-hover:text-[#00adb5] group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/dashboard/supply-chain"
            className="group rounded-2xl border border-border/80 bg-card p-5 hover:border-indigo-500 hover:shadow-lg transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Network className="size-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-500">Network Flow</span>
                <h3 className="text-base font-bold text-foreground mt-0.5">3D Supply Chain Topology</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Suppliers → Central Nagpur Hub → Mumbai, Pune, Nashik Regional Warehouses.
                </p>
              </div>
            </div>
            <ArrowRight className="size-5 text-muted-foreground group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Primary KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <KPICard label="Forecast Accuracy" value={`${kpiData.forecastAccuracy}%`} change="+0.5%" icon={Target} color="bg-[#00adb5]/10 text-[#00adb5]" />
          <KPICard label="Predicted Demand" value={`${kpiData.predictedDemand.toLocaleString()}`} change="+3.2%" icon={TrendingUp} color="bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300" />
          <KPICard label="Stockout Risk" value={`${kpiData.stockoutRisk}%`} change="-1.1%" icon={AlertTriangle} color="bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300" />
          <KPICard label="Active Model" value="Ensemble v2.4" icon={Zap} color="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" />
          <KPICard label="Data Quality" value={`${kpiData.dataQuality}%`} change="+1.0%" icon={ShieldCheck} color="bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300" />
          <KPICard label="Total SKUs" value={kpiData.totalProducts} icon={Package} color="bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300" />
          <KPICard label="Daily Revenue" value={`₹${(kpiData.totalSales / 1000).toFixed(0)}K`} change="+8.4%" icon={DollarSign} color="bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300" />
          <KPICard label="Model MAE" value={kpiData.mae} change="-0.3" icon={BarChart3} color="bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300" />
          <KPICard label="Model RMSE" value={kpiData.rmse} change="-0.5" icon={Activity} color="bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300" />
          <KPICard label="Last Retrained" value="2h ago" icon={Clock} color="bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Monthly Sales Trend */}
          <Card className="rounded-2xl border border-border/80 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-foreground flex items-center justify-between">
                <span>Monthly Demand & Revenue Progression</span>
                <span className="text-xs font-normal text-muted-foreground">Historical vs Forecast</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthlySales}>
                  <defs>
                    <linearGradient id="tealSalesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00adb5" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#00adb5" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="purpleRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.4} />
                  <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.4} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="sales" stroke="#00adb5" fill="url(#tealSalesGrad)" strokeWidth={2.5} name="Demand Units" />
                  <Area type="monotone" dataKey="revenue" stroke="#818cf8" fill="url(#purpleRevGrad)" strokeWidth={2} name="Revenue (₹)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Sales */}
          <Card className="rounded-2xl border border-border/80 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-foreground flex items-center justify-between">
                <span>Daily Sales Run-Rate (Last 30 Days)</span>
                <span className="text-xs font-normal text-muted-foreground">Volume Units</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={dailySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis dataKey="date" tick={{ fontSize: 8 }} interval={4} stroke="currentColor" strokeOpacity={0.4} />
                  <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.4} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="sales" fill="#00adb5" radius={[4, 4, 0, 0]} name="Daily Volume" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Category Performance & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="rounded-2xl border border-border/80 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-foreground">Category Demand Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={categoryPerf} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis type="number" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.4} />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 9 }} width={90} stroke="currentColor" strokeOpacity={0.4} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="revenue" fill="#393e46" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/80 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-foreground">Top Predicted Demand Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between text-xs border-b border-border/40 pb-2 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="size-5 rounded-full bg-[#00adb5]/20 text-[#00adb5] text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-foreground truncate max-w-[130px]">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-mono">{p.predictedDemand} units</span>
                    {p.demandTrend === "up" ? (
                      <TrendingUp className="size-3.5 text-emerald-500" />
                    ) : (
                      <TrendingDown className="size-3.5 text-rose-500" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/80 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="size-4 text-[#00adb5]" />
                ML Operational Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {aiInsights.slice(insightIdx, insightIdx + 3).map((insight, i) => (
                <div
                  key={i}
                  className="text-xs p-2.5 rounded-xl bg-card border border-border font-medium text-foreground leading-relaxed"
                >
                  {insight}
                </div>
              ))}
              <button
                onClick={() => setInsightIdx((prev) => (prev + 1) % (aiInsights.length - 2))}
                className="w-full mt-1 py-1.5 px-3 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer text-center"
              >
                Next Insight →
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
