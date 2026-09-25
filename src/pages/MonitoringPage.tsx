import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getMonitorMetrics, featureImportance } from "@/lib/demo-data";
import { Activity, Cpu, HardDrive, Zap, TrendingDown, BarChart3 } from "lucide-react";

export default function MonitoringPage() {
  const metrics = getMonitorMetrics();

  const latestMetrics = metrics[metrics.length - 1];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Model Monitoring</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time model performance and system health</p>
        </div>

        {/* Current Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: "Accuracy", value: `${latestMetrics.accuracy.toFixed(1)}%`, icon: Activity, color: "bg-blue-100" },
            { label: "MAE", value: latestMetrics.mae.toFixed(1), icon: BarChart3, color: "bg-indigo-100" },
            { label: "RMSE", value: latestMetrics.rmse.toFixed(1), icon: TrendingDown, color: "bg-cyan-100" },
            { label: "Latency", value: `${latestMetrics.latency.toFixed(0)}ms`, icon: Zap, color: "bg-amber-100" },
            { label: "Requests", value: latestMetrics.requests.toString(), icon: Activity, color: "bg-green-100" },
            { label: "Error Rate", value: `${latestMetrics.errorRate.toFixed(2)}%`, icon: Activity, color: "bg-red-100" },
            { label: "CPU", value: `${latestMetrics.cpuUsage.toFixed(0)}%`, icon: Cpu, color: "bg-purple-100" },
            { label: "Memory", value: `${latestMetrics.memoryUsage.toFixed(0)}%`, icon: HardDrive, color: "bg-pink-100" },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="nb-card-static bg-card p-3">
                <div className={`p-1 border-2 border-border ${m.color} inline-block mb-1`}>
                  <Icon className="size-3" />
                </div>
                <div className="text-lg font-bold">{m.value}</div>
                <div className="text-[10px] text-muted-foreground">{m.label}</div>
              </div>
            );
          })}
        </div>

        {/* Performance over time */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="nb-card-static">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">Model Accuracy Over Time</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis dataKey="timestamp" tick={{ fontSize: 9 }} stroke="currentColor" strokeOpacity={0.4} />
                  <YAxis domain={[90, 100]} tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 8px 30px -4px rgba(0, 0, 0, 0.08)", fontSize: 12, padding: "8px 12px" }} />
                  <Line type="monotone" dataKey="accuracy" stroke="#818CF8" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="nb-card-static">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">Error Metrics Over Time</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis dataKey="timestamp" tick={{ fontSize: 9 }} stroke="currentColor" strokeOpacity={0.4} />
                  <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 8px 30px -4px rgba(0, 0, 0, 0.08)", fontSize: 12, padding: "8px 12px" }} />
                  <Legend />
                  <Line type="monotone" dataKey="mae" stroke="#F87171" strokeWidth={2} dot={false} name="MAE" />
                  <Line type="monotone" dataKey="rmse" stroke="#FBBF24" strokeWidth={2} dot={false} name="RMSE" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Prediction Requests */}
          <Card className="nb-card-static">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">Prediction Requests & Error Rate</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis dataKey="timestamp" tick={{ fontSize: 9 }} stroke="currentColor" strokeOpacity={0.4} />
                  <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 8px 30px -4px rgba(0, 0, 0, 0.08)", fontSize: 12, padding: "8px 12px" }} />
                  <Legend />
                  <Area type="monotone" dataKey="requests" stroke="#34D399" fill="#34D399" fillOpacity={0.15} strokeWidth={2} name="Requests" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Feature Importance (Explainable AI) */}
          <Card className="nb-card-static">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">Feature Importance (Explainable AI)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={featureImportance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis type="number" tick={{ fontSize: 10 }} domain={[0, 50]} stroke="currentColor" strokeOpacity={0.4} />
                  <YAxis dataKey="feature" type="category" tick={{ fontSize: 10 }} width={100} stroke="currentColor" strokeOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 8px 30px -4px rgba(0, 0, 0, 0.08)", fontSize: 12, padding: "8px 12px" }} formatter={(v: number) => `${v}%`} />
                  <Bar dataKey="importance" fill="#818CF8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground mt-2 italic">
                "The forecast is primarily influenced by historical sales and seasonal demand patterns."
              </p>
            </CardContent>
          </Card>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="nb-card-static">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">CPU & Memory Usage</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis dataKey="timestamp" tick={{ fontSize: 9 }} stroke="currentColor" strokeOpacity={0.4} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 8px 30px -4px rgba(0, 0, 0, 0.08)", fontSize: 12, padding: "8px 12px" }} />
                  <Legend />
                  <Area type="monotone" dataKey="cpuUsage" stroke="#818CF8" fill="#818CF8" fillOpacity={0.15} strokeWidth={2} name="CPU %" />
                  <Area type="monotone" dataKey="memoryUsage" stroke="#F472B6" fill="#F472B6" fillOpacity={0.1} strokeWidth={2} name="Memory %" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="nb-card-static">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold">API Latency</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis dataKey="timestamp" tick={{ fontSize: 9 }} stroke="currentColor" strokeOpacity={0.4} />
                  <YAxis tick={{ fontSize: 10 }} stroke="currentColor" strokeOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 8px 30px -4px rgba(0, 0, 0, 0.08)", fontSize: 12, padding: "8px 12px" }} />
                  <Line type="monotone" dataKey="latency" stroke="#38BDF8" strokeWidth={2} dot={false} name="Latency (ms)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
