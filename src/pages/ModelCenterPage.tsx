import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { mlModels } from "@/lib/demo-data";
import { Brain, Play, Upload, RotateCcw, ArrowUp, Archive } from "lucide-react";

export default function ModelCenter() {
  const stageColors: Record<string, string> = {
    Production: "bg-green-100 text-green-800",
    Staging: "bg-blue-100 text-blue-800",
    Development: "bg-yellow-100 text-yellow-800",
    Archived: "bg-gray-100 text-gray-800",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">ML Model Center</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage, train, and deploy forecasting models</p>
          </div>
          <div className="flex gap-2">
            <button className="nb-btn bg-primary text-primary-foreground px-4 py-1.5 text-sm flex items-center gap-1.5">
              <Play className="size-3.5" /> Train New Model
            </button>
          </div>
        </div>

        {/* Model Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mlModels.map((model) => (
            <Card key={model.id} className="nb-card-static">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 border-2 border-border bg-primary/10">
                      <Brain className="size-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold">{model.name}</CardTitle>
                      <span className="text-[10px] text-muted-foreground">{model.version}</span>
                    </div>
                  </div>
                  <span className={`nb-badge text-[10px] px-1.5 py-0.5 ${stageColors[model.stage]}`}>
                    {model.stage}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Accuracy", value: `${model.accuracy}%` },
                    { label: "MAE", value: model.mae.toString() },
                    { label: "RMSE", value: model.rmse.toString() },
                    { label: "MAPE", value: `${model.mape}%` },
                    { label: "R²", value: model.r2.toString() },
                    { label: "Training", value: model.trainingDuration },
                  ].map((m) => (
                    <div key={m.label} className="bg-muted p-2 border border-border">
                      <div className="text-[10px] text-muted-foreground">{m.label}</div>
                      <div className="text-sm font-bold font-mono">{m.value}</div>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-muted-foreground">
                  Dataset: {model.datasetVersion} · Trained: {model.trainingDate}
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                  <button className="nb-btn bg-card px-2 py-1 text-[10px] flex items-center gap-1">
                    <ArrowUp className="size-3" /> Promote
                  </button>
                  <button className="nb-btn bg-card px-2 py-1 text-[10px] flex items-center gap-1">
                    <RotateCcw className="size-3" /> Rollback
                  </button>
                  <button className="nb-btn bg-card px-2 py-1 text-[10px] flex items-center gap-1">
                    <Upload className="size-3" /> Deploy
                  </button>
                  <button className="nb-btn bg-card px-2 py-1 text-[10px] flex items-center gap-1">
                    <Archive className="size-3" /> Archive
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
