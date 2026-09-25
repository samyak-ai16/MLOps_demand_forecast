import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  getMonthlySales, getDailySales, getCategoryPerformance,
  getRegionPerformance, getTopProducts,
} from "@/lib/demo-data";

const COLORS = ["#818CF8", "#F472B6", "#38BDF8", "#34D399", "#FBBF24", "#FB7185", "#A78BFA", "#F9A8D4"];

export default function SalesAnalytics() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("monthly");
  const monthlySales = getMonthlySales();
  const dailySales = getDailySales(60);
  const catPerf = getCategoryPerformance();
  const regionPerf = getRegionPerformance();
  const topProducts = getTopProducts(10);

  const chartData = period === "monthly" ? monthlySales.map((m) => ({
    ...m,
    label: m.month,
  })) : period === "daily" ? dailySales.map((d) => ({
    ...d,
    label: d.date,
  })) : (() => {
    // Weekly aggregation
    const weeks: Record<string, { sales: number; revenue: number }> = {};
    dailySales.forEach((d) => {
      const weekStart = new Date(d.date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const key = weekStart.toISOString().split("T")[0];
      if (!weeks[key]) weeks[key] = { sales: 0, revenue: 0 };
      weeks[key].sales += d.sales;
      weeks[key].revenue += d.revenue;
    });
    return Object.entries(weeks).map(([k, v]) => ({ ...v, label: k }));
  })();

  // YoY data (mock)
  const yoyData = monthlySales.map((m) => ({
    month: m.month,
    thisYear: m.revenue,
    lastYear: m.revenue * (0.75 + Math.random() * 0.3),
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Sales Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Comprehensive sales performance insights</p>
        </div>

        {/* Period filter */}
        <div className="flex gap-1">
          {(["daily", "weekly", "monthly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`nb-btn px-4 py-1.5 text-sm ${period === p ? "bg-primary text-primary-foreground" : "bg-card"}`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Revenue & Sales Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="nb-card-static">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">Sales Trend ({period})</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis dataKey="label" tick={{ fontSize: 8 }} interval={period === "daily" ? 5 : 0} stroke="currentColor" strokeOpacity={0.4} />
                  <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 8px 30px -4px rgba(0, 0, 0, 0.08)", fontSize: 12, padding: "8px 12px" }} />
                  <Bar dataKey="sales" fill="#818CF8" radius={[4, 4, 0, 0]} name="Units Sold" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="nb-card-static">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">Revenue Trend ({period})</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis dataKey="label" tick={{ fontSize: 8 }} interval={period === "daily" ? 5 : 0} stroke="currentColor" strokeOpacity={0.4} />
                  <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 8px 30px -4px rgba(0, 0, 0, 0.08)", fontSize: 12, padding: "8px 12px" }} />
                  <Line type="monotone" dataKey="revenue" stroke="#A78BFA" strokeWidth={2} dot={false} name="Revenue ($)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Category Performance */}
          <Card className="nb-card-static">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">Category Performance</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={catPerf} dataKey="revenue" nameKey="category" cx="50%" cy="50%" outerRadius={100} label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}>
                    {catPerf.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="var(--card)" strokeWidth={2} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 8px 30px -4px rgba(0, 0, 0, 0.08)", fontSize: 12, padding: "8px 12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Region Performance */}
          <Card className="nb-card-static">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">Region-wise Sales</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={regionPerf} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis type="number" tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.4} />
                  <YAxis dataKey="region" type="category" tick={{ fontSize: 9 }} width={110} stroke="currentColor" strokeOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 8px 30px -4px rgba(0, 0, 0, 0.08)", fontSize: 12, padding: "8px 12px" }} />
                  <Bar dataKey="revenue" fill="#38BDF8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Selling Products */}
          <Card className="nb-card-static">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">Top Selling Products</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-30} textAnchor="end" height={60} stroke="currentColor" strokeOpacity={0.4} />
                  <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 8px 30px -4px rgba(0, 0, 0, 0.08)", fontSize: 12, padding: "8px 12px" }} />
                  <Bar dataKey="revenue" fill="#34D399" radius={[4, 4, 0, 0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* YoY Growth */}
          <Card className="nb-card-static">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">Year-over-Year Revenue</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yoyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke="currentColor" strokeOpacity={0.4} />
                  <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 8px 30px -4px rgba(0, 0, 0, 0.08)", fontSize: 12, padding: "8px 12px" }} />
                  <Legend />
                  <Line type="monotone" dataKey="thisYear" stroke="#818CF8" strokeWidth={2} dot={false} name="This Year" />
                  <Line type="monotone" dataKey="lastYear" stroke="#CBD5E1" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Last Year" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
