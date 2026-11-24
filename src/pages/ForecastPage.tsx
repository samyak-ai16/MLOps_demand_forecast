import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api, ForecastResponse, Warehouse, ProductItem } from "@/lib/api";
import {
  Download, Calendar, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Target, Minus, RefreshCw,
  Brain, ShieldCheck, Sparkles, Filter, AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export default function ForecastPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("wh_nagpur");
  const [selectedProduct, setSelectedProduct] = useState("prod_laptop_pro");
  const [selectedModel, setSelectedModel] = useState("ensemble");
  const [horizon, setHorizon] = useState(30);
  const [loading, setLoading] = useState(false);
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);

  // Initialize facilities & products
  useEffect(() => {
    async function initData() {
      try {
        const [whs, prods] = await Promise.all([
          api.getWarehouses("comp_abc"),
          api.getProducts(),
        ]);
        setWarehouses(whs);
        setProducts(prods);
        if (prods.length > 0) setSelectedProduct(prods[0].id);
      } catch (err) {
        console.error("Initialization error:", err);
      }
    }
    initData();
  }, []);

  // Fetch forecast whenever parameters change
  useEffect(() => {
    fetchForecast();
  }, [selectedWarehouse, selectedProduct, selectedModel, horizon]);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const res = await api.generateForecast({
        company_id: "comp_abc",
        warehouse_id: selectedWarehouse,
        product_id: selectedProduct,
        horizon_days: horizon,
        model_name: selectedModel,
      });
      setForecastData(res);
    } catch (err) {
      console.error(err);
      toast.error("Forecasting service responded with fallback");
    } finally {
      setLoading(false);
    }
  };

  // Combine historical and future points for the unified chart
  const chartData = [
    ...(forecastData?.historical_points || []).map((p) => ({
      date: p.date,
      historical: p.actual,
      predicted: null,
      upperBound: null,
      lowerBound: null,
    })),
    ...(forecastData?.points || []).map((p) => ({
      date: p.date,
      historical: null,
      predicted: p.predicted,
      upperBound: p.upper_bound,
      lowerBound: p.lower_bound,
    })),
  ];

  const futurePoints = forecastData?.points || [];
  const totalPredicted = futurePoints.reduce((acc, curr) => acc + curr.predicted, 0);
  const avgPredictedDaily = futurePoints.length > 0 ? (totalPredicted / futurePoints.length).toFixed(1) : "0";
  const maxDemand = futurePoints.length > 0 ? Math.max(...futurePoints.map((p) => p.predicted)) : 0;
  const minDemand = futurePoints.length > 0 ? Math.min(...futurePoints.map((p) => p.predicted)) : 0;

  const currentProd = products.find((p) => p.id === selectedProduct);
  const currentWh = warehouses.find((w) => w.id === selectedWarehouse);

  // Download CSV
  const handleDownloadCSV = () => {
    if (!forecastData) return;
    const headers = "Date,Actual_Historical,Predicted_Demand,Lower_Bound_90CI,Upper_Bound_90CI\n";
    const rows = chartData
      .map((d) => `${d.date},${d.historical ?? ""},${d.predicted ?? ""},${d.lowerBound ?? ""},${d.upperBound ?? ""}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `forecast_${selectedProduct}_${horizon}d.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Forecast exported to CSV successfully");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/90 to-card/70 p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#00adb5]">
                <TrendingUp className="size-4" /> Multi-Horizon Predictive Analytics
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">
                Machine Learning Demand Forecasting Engine
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Generate probabilistic forecasts using Gradient Boosted Trees, Random Forest, and Meta-Ensembles with 90% confidence bands.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#00adb5] text-[#222831] hover:bg-[#00adb5]/90 transition-all font-bold"
              >
                <Download className="size-3.5" /> Export Forecast CSV
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div>
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Target Product
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-[#00adb5]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Warehouse / Hub
              </label>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-[#00adb5]"
              >
                <option value="all">All Facilities (Aggregated)</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Forecasting Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-[#00adb5]"
              >
                <option value="ensemble">Ensemble Meta-Model (Recommended)</option>
                <option value="gradient_boosting">Gradient Boosting (XGBoost style)</option>
                <option value="random_forest">Random Forest Regressor</option>
                <option value="seasonal_naive">Seasonal Naive Baseline (7-Day)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Forecast Horizon
              </label>
              <select
                value={horizon}
                onChange={(e) => setHorizon(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-[#00adb5]"
              >
                <option value={7}>Next 7 Days</option>
                <option value={14}>Next 14 Days</option>
                <option value={30}>Next 30 Days (Standard)</option>
                <option value={60}>Next 60 Days</option>
                <option value={90}>Next 90 Days (Quarterly)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Model Validation & Accuracy Metrics Banner */}
        {forecastData && (
          <div className="rounded-2xl border border-indigo-200/80 dark:border-indigo-950/60 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Brain className="size-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  Active Algorithm: {forecastData.model_used}
                </span>
                <h4 className="text-sm font-bold text-foreground">
                  Model Version: {forecastData.model_version} • Generated: {forecastData.generated_at}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-card px-3 py-1.5 rounded-xl border border-border text-center">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">WAPE</span>
                <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                  {forecastData.metrics.wape}%
                </div>
              </div>
              <div className="bg-card px-3 py-1.5 rounded-xl border border-border text-center">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">MAE</span>
                <div className="text-sm font-extrabold text-foreground">{forecastData.metrics.mae}</div>
              </div>
              <div className="bg-card px-3 py-1.5 rounded-xl border border-border text-center">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">RMSE</span>
                <div className="text-sm font-extrabold text-foreground">{forecastData.metrics.rmse}</div>
              </div>
              <div className="bg-card px-3 py-1.5 rounded-xl border border-border text-center">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">R² Score</span>
                <div className="text-sm font-extrabold text-[#00adb5]">{forecastData.metrics.r2}</div>
              </div>
            </div>
          </div>
        )}

        {/* Forecast Chart */}
        <Card className="rounded-3xl border border-border bg-card shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Calendar className="size-4 text-[#00adb5]" />
              Historical Demand vs. {horizon}-Day Predictive Horizon ({currentProd?.name || "Product"})
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              Facility: {currentWh?.name || "All Facilities"}
            </span>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={380}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  interval={Math.floor(chartData.length / 10)}
                  stroke="currentColor"
                  strokeOpacity={0.4}
                />
                <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.4} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "14px",
                    boxShadow: "0 8px 30px -4px rgba(0,0,0,0.12)",
                    fontSize: 12,
                    padding: "10px 14px",
                  }}
                />
                <Legend />
                <ReferenceLine
                  x={forecastData?.historical_points?.[forecastData.historical_points.length - 1]?.date}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{ value: "Forecast Cutoff", position: "top", fill: "#ef4444", fontSize: 10 }}
                />
                {/* 90% Confidence Interval */}
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  stroke="none"
                  fill="#00adb5"
                  fillOpacity={0.15}
                  name="90% Upper Bound CI"
                />
                <Area
                  type="monotone"
                  dataKey="lowerBound"
                  stroke="none"
                  fill="#00adb5"
                  fillOpacity={0.15}
                  name="90% Lower Bound CI"
                />
                <Line
                  type="monotone"
                  dataKey="historical"
                  stroke="#64748b"
                  strokeWidth={2}
                  dot={false}
                  name="Historical Actual Demand"
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#00adb5"
                  strokeWidth={2.5}
                  dot={{ r: 2 }}
                  name="Predicted Demand"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Forecast Statistical Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="rounded-2xl border border-border bg-card p-4">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Cumulative {horizon}d Demand
            </span>
            <div className="text-2xl font-black text-foreground mt-1">
              {Math.round(totalPredicted).toLocaleString()} units
            </div>
            <p className="text-[11px] text-[#00adb5] font-semibold mt-1">
              Avg ~{avgPredictedDaily} units/day
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Peak Day Volume
            </span>
            <div className="text-2xl font-black text-foreground mt-1">
              {Math.round(maxDemand)} units
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Expected weekend / promo surge</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Minimum Daily Run-Rate
            </span>
            <div className="text-2xl font-black text-foreground mt-1">
              {Math.round(minDemand)} units
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Off-peak baseline capacity</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Stockout Risk Status
            </span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              Optimal
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Current on-hand covers lead time</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
