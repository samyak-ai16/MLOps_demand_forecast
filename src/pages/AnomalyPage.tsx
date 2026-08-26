import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { anomalies } from "@/lib/demo-data";
import { AlertTriangle, TrendingUp, TrendingDown, Database, FileWarning } from "lucide-react";

export default function AnomalyPage() {
  const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    spike: TrendingUp,
    drop: TrendingDown,
    inventory: Database,
    data_quality: FileWarning,
  };

  const severityConfig: Record<string, { color: string; bg: string }> = {
    low: { color: "text-yellow-700", bg: "bg-yellow-100 border-yellow-400" },
    medium: { color: "text-orange-700", bg: "bg-orange-100 border-orange-400" },
    high: { color: "text-red-700", bg: "bg-red-100 border-red-400" },
    critical: { color: "text-red-900", bg: "bg-red-200 border-red-600" },
  };

  const counts = {
    critical: anomalies.filter((a) => a.severity === "critical").length,
    high: anomalies.filter((a) => a.severity === "high").length,
    medium: anomalies.filter((a) => a.severity === "medium").length,
    low: anomalies.filter((a) => a.severity === "low").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Anomaly Detection</h1>
          <p className="text-muted-foreground text-sm mt-1">Detect unusual patterns in sales, demand, and data</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Critical", value: counts.critical, bg: "bg-red-200 border-red-600" },
            { label: "High", value: counts.high, bg: "bg-red-100 border-red-400" },
            { label: "Medium", value: counts.medium, bg: "bg-orange-100 border-orange-400" },
            { label: "Low", value: counts.low, bg: "bg-yellow-100 border-yellow-400" },
          ].map((s) => (
            <div key={s.label} className={`nb-card-static p-4 border-2 ${s.bg}`}>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs font-semibold">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Anomaly Cards */}
        <div className="space-y-3">
          {anomalies.map((a) => {
            const Icon = typeIcons[a.type] || AlertTriangle;
            const sev = severityConfig[a.severity];
            return (
              <Card key={a.id} className={`nb-card-static border-l-4 ${sev.bg}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 border-2 border-border bg-card shrink-0">
                      <Icon className={`size-4 ${sev.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <span className="font-bold text-sm">{a.productName}</span>
                          <span className="nb-badge bg-muted text-[10px] ml-2">{a.type.replace("_", " ").toUpperCase()}</span>
                        </div>
                        <span className={`nb-badge text-[10px] px-1.5 py-0.5 ${sev.bg}`}>
                          {a.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                      <div className="flex gap-4 mt-2 text-xs font-mono">
                        <span>Expected: <strong>{a.expected}</strong></span>
                        <span>Actual: <strong>{a.actual}</strong></span>
                        <span>Deviation: <strong className={a.deviation.startsWith("+") ? "text-red-600" : "text-blue-600"}>{a.deviation}</strong></span>
                        <span>Date: <strong>{a.date}</strong></span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
