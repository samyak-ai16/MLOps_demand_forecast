import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, Area, AreaChart, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { products, categories, regions, generateForecast } from "@/lib/demo-data";
import {
  Download, Calendar, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Target, Minus,
} from "lucide-react";

export default function DemandForecast() {
  const [selectedProduct, setSelectedProduct] = useState(products[0].id);
  const [horizon, setHorizon] = useState(30);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const forecast = generateForecast(selectedProduct, horizon);
  const product = products.find((p) => p.id === selectedProduct);

  const historical = forecast.filter((f) => f.actual !== null);
  const predicted = forecast.filter((f) => f.predicted !== null && f.predicted !== 0);

  // Compute summary
  const predValues = predicted.map((p) => p.predicted as number);
  const totalExpected = predValues.reduce((a, b) => a + b, 0);
  const minDemand = Math.min(...predValues);
  const maxDemand = Math.max(...predValues);
  const peakIdx = predValues.indexOf(maxDemand);
  const peakDate = predicted[peakIdx]?.date || "";

  const trends = [
    { icon: Target, label: "Expected Demand", value: totalExpected.toLocaleString(), color: "bg-blue-100" },
    { icon: ArrowDownRight, label: "Minimum", value: minDemand.toLocaleString(), color: "bg-cyan-100" },
    { icon: ArrowUpRight, label: "Maximum", value: maxDemand.toLocaleString(), color: "bg-indigo-100" },
    { icon: Calendar, label: "Peak Date", value: peakDate, color: "bg-purple-100" },
    { icon: TrendingUp, label: "Trend", value: product?.demandTrend || "stable", color: "bg-green-100" },
    { icon: Target, label: "Confidence", value: `${product?.forecastAccuracy || 94}%`, color: "bg-amber-100" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Demand Forecasting</h1>
            <p className="text-muted-foreground text-sm mt-1">Generate and analyze ML-powered demand predictions</p>
          </div>
          <div className="flex gap-2">
            <button className="nb-btn bg-card px-3 py-1.5 text-sm flex items-center gap-1.5">
              <Download className="size-3.5" /> Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="nb-card-static bg-card p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-bold mb-1 block">Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="nb-select w-full bg-background px-2 py-1.5 text-sm"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="nb-select w-full bg-background px-2 py-1.5 text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="nb-select w-full bg-background px-2 py-1.5 text-sm"
              >
                <option value="all">All Regions</option>
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block">Horizon</label>
              <select
                value={horizon}
                onChange={(e) => setHorizon(Number(e.target.value))}
                className="nb-select w-full bg-background px-2 py-1.5 text-sm"
              >
                {[7, 14, 30, 60, 90].map((d) => (
                  <option key={d} value={d}>{d} days</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Forecast Chart */}
        <Card className="nb-card-static">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">
              Demand Forecast — {product?.name} ({horizon} days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0F172A" strokeOpacity={0.1} />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={Math.floor(forecast.length / 10)} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ border: "2px solid #0F172A", borderRadius: 0, fontSize: 12 }} />
                <Legend />
                <ReferenceLine x={new Date().toISOString().split("T")[0]} stroke="#EF4444" strokeDasharray="5 5" label="Today" />
                {/* Confidence band */}
                <Area type="monotone" dataKey="upperBound" stroke="none" fill="#2563EB" fillOpacity={0.08} name="Upper CI" />
                <Area type="monotone" dataKey="lowerBound" stroke="none" fill="#2563EB" fillOpacity={0.08} name="Lower CI" />
                <Line type="monotone" dataKey="actual" stroke="#0F172A" strokeWidth={2} dot={false} name="Historical Demand" />
                <Line type="monotone" dataKey="predicted" stroke="#2563EB" strokeWidth={2.5} dot={false} strokeDasharray="8 4" name="Predicted Demand" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Forecast Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {trends.map((t, i) => {
            const Icon = t.icon;
            return (
              <div key={i} className="nb-card-static bg-card p-3">
                <div className={`p-1.5 border-2 border-border ${t.color} inline-block mb-2`}>
                  <Icon className="size-3.5" />
                </div>
                <div className="text-lg font-bold">{t.value}</div>
                <div className="text-xs text-muted-foreground">{t.label}</div>
              </div>
            );
          })}
        </div>

        {/* Export options */}
        <div className="nb-card-static bg-card p-4">
          <h3 className="text-sm font-bold mb-3">Export Forecast</h3>
          <div className="flex gap-2">
            {["CSV", "Excel", "PDF"].map((fmt) => (
              <button key={fmt} className="nb-btn bg-card px-4 py-1.5 text-sm">
                <Download className="size-3.5 mr-1 inline" />
                {fmt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
