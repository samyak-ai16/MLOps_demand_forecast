import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FileText, Download, Calendar, BarChart3, Database, Workflow, Package, AlertTriangle } from "lucide-react";

const reportTypes = [
  { name: "Demand Forecast Report", description: "30-day demand forecast with confidence intervals", icon: BarChart3, color: "bg-blue-100", generated: "2025-12-14" },
  { name: "Model Performance Report", description: "ML model metrics, comparison, and recommendations", icon: FileText, color: "bg-indigo-100", generated: "2025-12-14" },
  { name: "Data Quality Report", description: "Dataset statistics, quality checks, and issues", icon: Database, color: "bg-cyan-100", generated: "2025-12-13" },
  { name: "MLOps Pipeline Report", description: "Pipeline execution logs and status", icon: Workflow, color: "bg-purple-100", generated: "2025-12-14" },
  { name: "Inventory Report", description: "Stock levels, reorder points, and risk assessment", icon: Package, color: "bg-green-100", generated: "2025-12-12" },
  { name: "Anomaly Report", description: "Detected anomalies with severity and recommendations", icon: AlertTriangle, color: "bg-amber-100", generated: "2025-12-14" },
];

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">Generate and export automated reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((r) => {
            const Icon = r.icon;
            return (
              <Card key={r.name} className="nb-card-static">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 border-2 border-border ${r.color}`}>
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold">{r.name}</CardTitle>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="size-3" /> {r.generated}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">{r.description}</p>
                  <div className="flex gap-1">
                    {["PDF", "Excel", "CSV"].map((fmt) => (
                      <button key={fmt} className="nb-btn bg-card px-2 py-1 text-[10px] flex items-center gap-1">
                        <Download className="size-3" /> {fmt}
                      </button>
                    ))}
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
