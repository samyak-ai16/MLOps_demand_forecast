import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api, RegisteredModel } from "@/lib/api";
import {
  Brain, Award, ArrowUpRight, CheckCircle2, RotateCcw,
  Shield, Layers, Clock, Calendar, Check, AlertCircle, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

export default function ModelRegistryPage() {
  const [models, setModels] = useState<RegisteredModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    setLoading(true);
    try {
      const data = await api.getModels();
      setModels(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch model registry");
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async (modelId: string) => {
    try {
      await api.deployModel(modelId);
      toast.success(`Model ${modelId} deployed to Production stage!`);
      loadModels();
    } catch (e) {
      toast.error("Deployment failed");
    }
  };

  const handleRollback = async (modelId: string) => {
    try {
      await api.rollbackModel(modelId);
      toast.success(`Rolled back to model version ${modelId}`);
      loadModels();
    } catch (e) {
      toast.error("Rollback failed");
    }
  };

  const prodModel = models.find((m) => m.stage === "production");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/90 to-card/70 p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#00adb5]">
                <Brain className="size-4" /> MLOps Lifecycle Governance
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">
                MLflow Model Registry & Version Control
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Centrally manage model lineage, stage transitions (Production, Staging, Archived), automated canary deployments, and zero-downtime rollbacks.
              </p>
            </div>
            <button
              onClick={loadModels}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
        </div>

        {/* Active Production Model Hero Banner */}
        {prodModel && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                <Award className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Live Production Serving
                  </span>
                  <span className="text-xs font-bold text-foreground">{prodModel.version}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mt-1">{prodModel.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{prodModel.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-6 text-xs">
              <div>
                <span className="text-muted-foreground">Accuracy:</span>
                <div className="text-base font-extrabold text-foreground">{prodModel.accuracy_pct}%</div>
              </div>
              <div>
                <span className="text-muted-foreground">WAPE:</span>
                <div className="text-base font-extrabold text-foreground">{prodModel.wape}%</div>
              </div>
              <div>
                <span className="text-muted-foreground">MAE:</span>
                <div className="text-base font-extrabold text-foreground">{prodModel.mae}</div>
              </div>
              <div>
                <span className="text-muted-foreground">R² Score:</span>
                <div className="text-base font-extrabold text-[#00adb5]">{prodModel.r2}</div>
              </div>
            </div>
          </div>
        )}

        {/* Model Versions List */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="p-4 border-b border-border font-bold text-sm">
            Registered Model Artifacts & Stage Transitions
          </div>
          <div className="divide-y divide-border">
            {models.map((m) => {
              const isProd = m.stage === "production";
              const isStaging = m.stage === "staging";
              return (
                <div key={m.model_id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-sm font-bold text-foreground">{m.name}</h4>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-muted text-foreground">
                        {m.version}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isProd
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300"
                            : isStaging
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-300"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {m.stage.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Algorithm: <span className="font-semibold text-foreground">{m.algorithm}</span> • Dataset: {m.dataset_version}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Trained: {m.trained_at} {m.deployed_at ? `• Deployed: ${m.deployed_at}` : ""}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <div className="font-bold text-foreground">WAPE {m.wape}% • MAE {m.mae}</div>
                      <div className="text-[11px] text-muted-foreground">RMSE {m.rmse} • R² {m.r2}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isProd && (
                        <button
                          onClick={() => handleDeploy(m.model_id)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#00adb5] text-[#222831] hover:bg-[#00adb5]/90 transition-all flex items-center gap-1"
                        >
                          <CheckCircle2 className="size-3.5" /> Deploy
                        </button>
                      )}
                      {m.stage === "archived" && (
                        <button
                          onClick={() => handleRollback(m.model_id)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-border hover:bg-muted transition-all flex items-center gap-1"
                        >
                          <RotateCcw className="size-3.5" /> Rollback
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
