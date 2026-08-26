import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { mlModels } from "@/lib/demo-data";
import { Rocket } from "lucide-react";

export default function ModelCompare() {
  const stageColors: Record<string, string> = {
    Production: "bg-green-100 text-green-800",
    Staging: "bg-blue-100 text-blue-800",
    Development: "bg-yellow-100 text-yellow-800",
    Archived: "bg-gray-100 text-gray-800",
  };

  const radarData = mlModels.filter((m) => m.status !== "archived").map((m) => ({
    model: m.name,
    accuracy: m.accuracy,
    maeInverse: Math.max(0, 100 - m.mae),
    rmseInverse: Math.max(0, 100 - m.rmse),
    r2Scaled: m.r2 * 100,
    speedScore: parseInt(m.trainingDuration) < 60 ? 90 : parseInt(m.trainingDuration) < 300 ? 60 : 30,
  }));

  const barData = mlModels.map((m) => ({
    name: m.name,
    MAE: m.mae,
    RMSE: m.rmse,
    MAPE: m.mape,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Model Comparison</h1>
            <p className="text-muted-foreground text-sm mt-1">Compare model performance side-by-side</p>
          </div>
          <button className="nb-btn bg-green-600 text-white px-4 py-1.5 text-sm flex items-center gap-1.5">
            <Rocket className="size-3.5" /> Deploy Best Model
          </button>
        </div>

        {/* Comparison Table */}
        <Card className="nb-card-static overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border bg-muted">
                {["Model", "Version", "MAE", "RMSE", "MAPE", "R²", "Training Time", "Status"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-bold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mlModels.map((m, i) => (
                <tr key={m.id} className={`border-b border-border ${i === 0 ? "bg-primary/5" : "hover:bg-muted/50"}`}>
                  <td className="px-3 py-2 font-bold">{m.name}</td>
                  <td className="px-3 py-2 font-mono text-xs">{m.version}</td>
                  <td className="px-3 py-2 font-mono">{m.mae}</td>
                  <td className="px-3 py-2 font-mono">{m.rmse}</td>
                  <td className="px-3 py-2 font-mono">{m.mape}%</td>
                  <td className="px-3 py-2 font-mono">{m.r2}</td>
                  <td className="px-3 py-2">{m.trainingDuration}</td>
                  <td className="px-3 py-2">
                    <span className={`nb-badge text-[10px] px-1.5 py-0.5 ${stageColors[m.stage]}`}>{m.stage}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Error Metrics */}
          <Card className="nb-card-static">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">Error Metrics Comparison</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0F172A" strokeOpacity={0.1} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ border: "2px solid #0F172A", borderRadius: 0, fontSize: 12 }} />
                  <Legend />
                  <Bar dataKey="MAE" fill="#2563EB" stroke="#0F172A" strokeWidth={1} />
                  <Bar dataKey="RMSE" fill="#4F46E5" stroke="#0F172A" strokeWidth={1} />
                  <Bar dataKey="MAPE" fill="#06B6D4" stroke="#0F172A" strokeWidth={1} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Radar */}
          <Card className="nb-card-static">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">Model Performance Radar</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#0F172A" strokeOpacity={0.2} />
                  <PolarAngleAxis dataKey="model" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis tick={{ fontSize: 8 }} />
                  <Radar name="Accuracy" dataKey="accuracy" stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} strokeWidth={2} />
                  <Radar name="R²" dataKey="r2Scaled" stroke="#22C55E" fill="#22C55E" fillOpacity={0.1} strokeWidth={2} />
                  <Legend />
                  <Tooltip contentStyle={{ border: "2px solid #0F172A", borderRadius: 0, fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
