import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, Package, DollarSign, Target,
  Activity, Zap, Clock, ShieldCheck, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Sparkles, BarChart3,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  kpiData, products, getMonthlySales, getDailySales,
  getCategoryPerformance, aiInsights, anomalies,
} from "@/lib/demo-data";

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  boxShadow: "0 8px 30px -4px rgba(0, 0, 0, 0.08)",
  fontSize: "12px",
  padding: "8px 12px",
};

function KPICard({ label, value, change, icon: Icon, color }: {
  label: string; value: string | number; change?: string;
  icon: React.ComponentType<{ className?: string }>; color: string;
}) {
  const isPositive = change?.startsWith("+");
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150">
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
      <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5 font-medium">{label}</div>
    </div>
  );
}

export default function DashboardOverview() {
  const [insightIdx, setInsightIdx] = useState(0);
  const monthlySales = getMonthlySales();
  const dailySales = getDailySales(30);
  const categoryPerf = getCategoryPerformance();

  const topProducts = [...products].sort((a, b) => b.predictedDemand - a.predictedDemand).slice(0, 6);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Greeting */}
        <div className="rounded-3xl border border-indigo-100/80 dark:border-indigo-950/60 bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-pink-50/40 dark:from-slate-900/90 dark:via-indigo-950/30 dark:to-slate-900 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Good Morning, Admin 👋
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1">
                Here is your MLOps demand forecasting overview for today.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: "Pipeline", value: kpiData.pipelineStatus, color: "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-300" },
                { label: "Drift", value: kpiData.driftStatus, color: "bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-950/50 dark:text-sky-300" },
                { label: "Health", value: kpiData.modelHealth, color: "bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/50 dark:text-indigo-300" },
              ].map((s) => (
                <span
                  key={s.label}
                  className={`rounded-full px-3 py-1 text-xs font-semibold border shadow-2xs ${s.color}`}
                >
                  {s.label}: {s.value}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <KPICard label="Forecast Accuracy" value={`${kpiData.forecastAccuracy}%`} change="+0.5%" icon={Target} color="bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" />
          <KPICard label="Predicted Demand" value={`${kpiData.predictedDemand.toLocaleString()}`} change="+3.2%" icon={TrendingUp} color="bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300" />
          <KPICard label="Stockout Risk" value={`${kpiData.stockoutRisk}%`} change="-1.1%" icon={AlertTriangle} color="bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300" />
          <KPICard label="Active Model" value={kpiData.activeModel} icon={Zap} color="bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300" />
          <KPICard label="Data Quality" value={`${kpiData.dataQuality}%`} change="+1.0%" icon={ShieldCheck} color="bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300" />
          <KPICard label="Total Products" value={kpiData.totalProducts} icon={Package} color="bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300" />
          <KPICard label="Total Sales" value={`${(kpiData.totalSales / 1000).toFixed(0)}K`} change="+8.4%" icon={DollarSign} color="bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300" />
          <KPICard label="MAE" value={kpiData.mae} change="-0.3" icon={BarChart3} color="bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300" />
          <KPICard label="RMSE" value={kpiData.rmse} change="-0.5" icon={Activity} color="bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300" />
          <KPICard label="Last Training" value="Today" icon={Clock} color="bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Monthly Sales Trend */}
          <Card className="rounded-2xl border border-border/70 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center justify-between">
                <span>Monthly Sales Trend</span>
                <span className="text-xs font-normal text-muted-foreground">Historical vs Forecast</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthlySales}>
                  <defs>
                    <linearGradient id="pastelSalesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#818CF8" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="pastelRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F472B6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#F472B6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.4} />
                  <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.4} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="sales" stroke="#818CF8" fill="url(#pastelSalesGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="revenue" stroke="#F472B6" fill="url(#pastelRevGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Sales */}
          <Card className="rounded-2xl border border-border/70 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center justify-between">
                <span>Daily Sales (Last 30 Days)</span>
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
                  <Bar dataKey="sales" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Category Performance */}
          <Card className="rounded-2xl border border-border/70 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground">Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={categoryPerf} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis type="number" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.4} />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 9 }} width={90} stroke="currentColor" strokeOpacity={0.4} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="revenue" fill="#A78BFA" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="rounded-2xl border border-border/70 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground">Top Products by Demand</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between text-xs sm:text-sm border-b border-border/40 pb-2 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="size-5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50">
                      {i + 1}
                    </span>
                    <span className="font-medium text-foreground truncate max-w-[130px]">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">{p.predictedDemand} units</span>
                    {p.demandTrend === "up" ? (
                      <TrendingUp className="size-3.5 text-emerald-500" />
                    ) : p.demandTrend === "down" ? (
                      <TrendingDown className="size-3.5 text-rose-500" />
                    ) : null}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="rounded-2xl border border-border/70 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="size-4 text-amber-500" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {aiInsights.slice(insightIdx, insightIdx + 4).map((insight, i) => (
                <div
                  key={i}
                  className="text-xs p-2.5 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/70 dark:border-indigo-900/40 font-medium text-foreground leading-relaxed"
                >
                  {insight}
                </div>
              ))}
              <button
                onClick={() => setInsightIdx((prev) => (prev + 1) % (aiInsights.length - 3))}
                className="w-full mt-1 py-1.5 px-3 rounded-xl border border-border/70 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs font-medium text-muted-foreground hover:text-foreground transition-all cursor-pointer text-center"
              >
                Next Insight →
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Demand Alerts */}
        {anomalies.filter((a) => a.severity === "critical" || a.severity === "high").length > 0 && (
          <Card className="rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="size-4" />
                Active Demand Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {anomalies.filter((a) => a.severity === "critical" || a.severity === "high").map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-rose-200/60 dark:border-rose-900/30 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-foreground">{a.productName}</span>
                      <span className="text-muted-foreground ml-2">— {a.description}</span>
                    </div>
                    <span
                      className={`rounded-full text-[10px] font-semibold px-2 py-0.5 ${
                        a.severity === "critical"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}
                    >
                      {a.severity.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
