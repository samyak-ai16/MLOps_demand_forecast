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

function KPICard({ label, value, change, icon: Icon, color }: {
  label: string; value: string | number; change?: string;
  icon: React.ComponentType<{ className?: string }>; color: string;
}) {
  const isPositive = change?.startsWith("+");
  return (
    <div className="nb-card-static bg-card p-4">
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 border-2 border-border ${color}`}>
          <Icon className="size-4" />
        </div>
        {change && (
          <span className={`nb-badge text-[10px] px-1.5 py-0.5 flex items-center gap-0.5 ${isPositive ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300" : "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300"}`}>
            {isPositive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
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
        <div className="nb-card-static bg-primary text-primary-foreground p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold">Good Morning, Admin 👋</h1>
              <p className="text-primary-foreground/80 mt-1">Here is today's demand forecasting overview.</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: "Pipeline", value: kpiData.pipelineStatus, ok: true },
                { label: "Drift", value: kpiData.driftStatus, ok: true },
                { label: "Health", value: kpiData.modelHealth, ok: true },
              ].map((s) => (
                <span key={s.label} className="nb-badge bg-primary-foreground/20 text-primary-foreground px-2 py-1 text-xs">
                  {s.label}: {s.value}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPICard label="Forecast Accuracy" value={`${kpiData.forecastAccuracy}%`} change="+0.5%" icon={Target} color="bg-blue-100 dark:bg-blue-900/50" />
          <KPICard label="Predicted Demand" value={`${kpiData.predictedDemand.toLocaleString()}`} change="+3.2%" icon={TrendingUp} color="bg-indigo-100 dark:bg-indigo-900/50" />
          <KPICard label="Stockout Risk" value={`${kpiData.stockoutRisk}%`} change="-1.1%" icon={AlertTriangle} color="bg-amber-100 dark:bg-amber-900/50" />
          <KPICard label="Active Model" value={kpiData.activeModel} icon={Zap} color="bg-green-100 dark:bg-green-900/50" />
          <KPICard label="Data Quality" value={`${kpiData.dataQuality}%`} change="+1.0%" icon={ShieldCheck} color="bg-cyan-100 dark:bg-cyan-900/50" />
          <KPICard label="Total Products" value={kpiData.totalProducts} icon={Package} color="bg-purple-100 dark:bg-purple-900/50" />
          <KPICard label="Total Sales" value={`${(kpiData.totalSales / 1000).toFixed(0)}K`} change="+8.4%" icon={DollarSign} color="bg-pink-100 dark:bg-pink-900/50" />
          <KPICard label="MAE" value={kpiData.mae} change="-0.3" icon={BarChart3} color="bg-orange-100 dark:bg-orange-900/50" />
          <KPICard label="RMSE" value={kpiData.rmse} change="-0.5" icon={Activity} color="bg-teal-100 dark:bg-teal-900/50" />
          <KPICard label="Last Training" value="Today" icon={Clock} color="bg-violet-100 dark:bg-violet-900/50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Monthly Sales Trend */}
          <Card className="nb-card-static">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">Monthly Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0F172A" strokeOpacity={0.1} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ border: "2px solid #0F172A", borderRadius: 0, fontSize: 12 }} />
                  <Area type="monotone" dataKey="sales" stroke="#2563EB" fill="#2563EB" fillOpacity={0.1} strokeWidth={2} />
                  <Area type="monotone" dataKey="revenue" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.05} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Sales */}
          <Card className="nb-card-static">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">Daily Sales (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={dailySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0F172A" strokeOpacity={0.1} />
                  <XAxis dataKey="date" tick={{ fontSize: 8 }} interval={4} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ border: "2px solid #0F172A", borderRadius: 0, fontSize: 12 }} />
                  <Bar dataKey="sales" fill="#06B6D4" stroke="#0F172A" strokeWidth={1} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Category Performance */}
          <Card className="nb-card-static">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={categoryPerf} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#0F172A" strokeOpacity={0.1} />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 9 }} width={100} />
                  <Tooltip contentStyle={{ border: "2px solid #0F172A", borderRadius: 0, fontSize: 12 }} />
                  <Bar dataKey="revenue" fill="#4F46E5" stroke="#0F172A" strokeWidth={1} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="nb-card-static">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">Top Products by Demand</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between text-sm border-b border-border pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="nb-badge bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">{i + 1}</span>
                    <span className="font-medium truncate">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">{p.predictedDemand} units</span>
                    {p.demandTrend === "up" ? (
                      <TrendingUp className="size-3 text-green-600" />
                    ) : p.demandTrend === "down" ? (
                      <TrendingDown className="size-3 text-red-600" />
                    ) : null}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="nb-card-static">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <Sparkles className="size-4 text-amber-500" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiInsights.slice(insightIdx, insightIdx + 4).map((insight, i) => (
                <div key={i} className="text-sm p-2 bg-muted border-l-4 border-primary font-medium">
                  {insight}
                </div>
              ))}
              <button
                onClick={() => setInsightIdx((prev) => (prev + 1) % (aiInsights.length - 3))}
                className="nb-btn bg-card px-3 py-1 text-xs"
              >
                Next Insight →
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Demand Alerts */}
        {anomalies.filter((a) => a.severity === "critical" || a.severity === "high").length > 0 && (
          <Card className="nb-card-static border-destructive">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-destructive">
                <AlertTriangle className="size-4" />
                Active Demand Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {anomalies.filter((a) => a.severity === "critical" || a.severity === "high").map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-2 bg-destructive/5 border-2 border-destructive/20 text-sm">
                    <div>
                      <span className="font-bold">{a.productName}</span>
                      <span className="text-muted-foreground ml-2">— {a.description}</span>
                    </div>
                    <span className={`nb-badge text-[10px] px-1.5 py-0.5 ${
                      a.severity === "critical" ? "bg-red-200 text-red-900" : "bg-orange-200 text-orange-900"
                    }`}>
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
