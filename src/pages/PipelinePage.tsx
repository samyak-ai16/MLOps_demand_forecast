import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { pipelineStages } from "@/lib/demo-data";
import { Workflow, Play, CheckCircle, Clock, AlertTriangle, XCircle, Loader2 } from "lucide-react";

export default function PipelinePage() {
  const statusConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
    completed: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100 border-green-600" },
    running: { icon: Loader2, color: "text-blue-600", bg: "bg-blue-100 border-blue-600" },
    warning: { icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-100 border-yellow-600" },
    failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-100 border-red-600" },
    pending: { icon: Clock, color: "text-gray-500", bg: "bg-gray-100 border-gray-400" },
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">MLOps Pipeline</h1>
            <p className="text-muted-foreground text-sm mt-1">End-to-end machine learning operations pipeline</p>
          </div>
          <button className="nb-btn bg-primary text-primary-foreground px-4 py-1.5 text-sm flex items-center gap-1.5">
            <Play className="size-3.5" /> Run Pipeline
          </button>
        </div>

        {/* Pipeline Title Card */}
        <div className="nb-card-static bg-primary text-primary-foreground p-4">
          <div className="flex items-center gap-3">
            <Workflow className="size-6" />
            <div>
              <h2 className="font-bold text-lg">Pipeline v3.2</h2>
              <p className="text-primary-foreground/80 text-sm">DATA → ML → FORECAST → DEPLOY → MONITOR → DRIFT → RETRAIN</p>
            </div>
          </div>
        </div>

        {/* Pipeline Stages */}
        <div className="space-y-2">
          {pipelineStages.map((stage, i) => {
            const cfg = statusConfig[stage.status];
            const Icon = cfg.icon;
            return (
              <div key={stage.id}>
                <Card className={`nb-card-static ${stage.status === "running" ? "ring-2 ring-blue-500" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Stage number + status */}
                      <div className={`p-2 border-2 ${cfg.bg} shrink-0`}>
                        <Icon className={`size-5 ${cfg.color} ${stage.status === "running" ? "animate-spin" : ""}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <span className="text-xs text-muted-foreground">Stage {i + 1}</span>
                            <h3 className="font-bold text-sm">{stage.name}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="nb-badge bg-muted text-[10px] px-1.5 py-0.5">v{stage.version}</span>
                            <span className={`nb-badge text-[10px] px-1.5 py-0.5 ${cfg.bg}`}>
                              {stage.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
                          <span>Start: {stage.startTime || "—"}</span>
                          <span>End: {stage.endTime || "—"}</span>
                          <span>Duration: {stage.duration || "—"}</span>
                        </div>

                        {/* Logs */}
                        {stage.logs.length > 0 && (
                          <div className="mt-2 space-y-0.5">
                            {stage.logs.map((log, j) => (
                              <div key={j} className="text-[10px] font-mono bg-muted px-2 py-1 border border-border">
                                <span className="text-green-600">✓</span> {log}
                              </div>
                            ))}
                          </div>
                        )}
                        {stage.errors.length > 0 && (
                          <div className="mt-2 space-y-0.5">
                            {stage.errors.map((err, j) => (
                              <div key={j} className="text-[10px] font-mono bg-red-50 px-2 py-1 border border-red-300 text-red-700">
                                ✗ {err}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Arrow connector */}
                {i < pipelineStages.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div className="w-0.5 h-4 bg-border" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
