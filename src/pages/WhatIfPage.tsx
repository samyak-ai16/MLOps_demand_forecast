import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { products } from "@/lib/demo-data";
import { FlaskConical, TrendingUp, Percent, DollarSign, ShoppingBag } from "lucide-react";

export default function WhatIfPage() {
  const [product, setProduct] = useState(products[0].id);
  const [discount, setDiscount] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [promotion, setPromotion] = useState(false);
  const [holiday, setHoliday] = useState(false);

  const selected = products.find((p) => p.id === product)!;
  const baseDemand = selected.avgDemand;
  const discountEffect = 1 + discount * 0.02; // 2% per % discount
  const priceEffect = 1 - priceChange * 0.015; // -1.5% per % price increase
  const promoEffect = promotion ? 1.35 : 1;
  const holidayEffect = holiday ? 1.25 : 1;

  const predictedDemand = Math.round(baseDemand * discountEffect * priceEffect * promoEffect * holidayEffect);
  const demandChange = ((predictedDemand - baseDemand) / baseDemand * 100).toFixed(1);

  const chartData = [
    { name: "Current", demand: baseDemand },
    { name: "Predicted", demand: predictedDemand },
  ];

  const sensitivityData = [
    { scenario: "No change", demand: baseDemand },
    { scenario: "10% discount", demand: Math.round(baseDemand * 1.2) },
    { scenario: "20% discount", demand: Math.round(baseDemand * 1.4) },
    { scenario: "Promotion only", demand: Math.round(baseDemand * 1.35) },
    { scenario: "Holiday + Promo", demand: Math.round(baseDemand * 1.69) },
    { scenario: "Price +10%", demand: Math.round(baseDemand * 0.85) },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">What-If Analysis</h1>
          <p className="text-muted-foreground text-sm mt-1">Simulate demand under different scenarios</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Controls */}
          <Card className="nb-card-static">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <FlaskConical className="size-4" /> Scenario Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-bold mb-1 block">Product</label>
                <select
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="nb-select w-full bg-background px-2 py-1.5 text-sm"
                >
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">Discount: {discount}%</label>
                <input
                  type="range" min={0} max={50} value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">Price Change: {priceChange > 0 ? "+" : ""}{priceChange}%</label>
                <input
                  type="range" min={-30} max={30} value={priceChange}
                  onChange={(e) => setPriceChange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={promotion} onChange={(e) => setPromotion(e.target.checked)} className="accent-primary" />
                  Promotion Active
                </label>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={holiday} onChange={(e) => setHoliday(e.target.checked)} className="accent-primary" />
                  Holiday Period
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="nb-card-static lg:col-span-2">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">Prediction Results</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-muted p-3 border-2 border-border">
                  <div className="text-[10px] text-muted-foreground">Current Demand</div>
                  <div className="text-xl font-bold">{baseDemand}</div>
                  <div className="text-[10px] text-muted-foreground">units</div>
                </div>
                <div className="bg-primary/10 p-3 border-2 border-border">
                  <div className="text-[10px] text-muted-foreground">Predicted Demand</div>
                  <div className="text-xl font-bold text-primary">{predictedDemand}</div>
                  <div className="text-[10px] text-muted-foreground">units</div>
                </div>
                <div className={`p-3 border-2 border-border ${Number(demandChange) >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                  <div className="text-[10px] text-muted-foreground">Expected Change</div>
                  <div className={`text-xl font-bold ${Number(demandChange) >= 0 ? "text-green-700" : "text-red-700"}`}>
                    {Number(demandChange) >= 0 ? "+" : ""}{demandChange}%
                  </div>
                </div>
                <div className="bg-muted p-3 border-2 border-border">
                  <div className="text-[10px] text-muted-foreground">Revenue Impact</div>
                  <div className="text-xl font-bold">
                    ${(predictedDemand * selected.price * (1 - discount / 100)).toFixed(0)}
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0F172A" strokeOpacity={0.1} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ border: "2px solid #0F172A", borderRadius: 0, fontSize: 12 }} />
                  <Bar dataKey="demand" fill="#2563EB" stroke="#0F172A" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>

              <h4 className="text-sm font-bold mt-4">Sensitivity Analysis</h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={sensitivityData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#0F172A" strokeOpacity={0.1} />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="scenario" type="category" tick={{ fontSize: 9 }} width={120} />
                  <Tooltip contentStyle={{ border: "2px solid #0F172A", borderRadius: 0, fontSize: 12 }} />
                  <Bar dataKey="demand" fill="#4F46E5" stroke="#0F172A" strokeWidth={1} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
