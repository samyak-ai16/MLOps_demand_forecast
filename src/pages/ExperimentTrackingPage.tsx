import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import {
  FlaskConical, GitCompare, Trophy, RefreshCw, BarChart2,
  Clock, CheckCircle2, ChevronRight, Layers, Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface ExperimentRun {
  run_id: string;
  experiment_name: string;
  model_name: string;
  algorithm: string;
  dataset_version: string;
  hyperparameters: Record<string, any>;
  metrics: {
    mae: number;
    rmse: number;
    wape: number;
    mape: number;
    r2: number;
  };
  training_duration_sec: number;
  created_at: string;
  artifact_uri: string;
  status: string;
}

export default function ExperimentTrackingPage() {
  const [experiments, setExperiments] = useState<ExperimentRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<ExperimentRun | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/experiments");
      if (res.ok) {
        const data = await res.json();
        setExperiments(data);
        if (data.length > 0) setSelectedRun(data[0]);
      } else {
        throw new Error("Local backend offline");
      }
    } catch {
      // Mock runs
      const fallbackRuns: ExperimentRun[] = [
        {
          run_id: "run_exp_ensemble_01",
          experiment_name: "demand_forecast_benchmarks",
          model_name: "DemandFlow-Ensemble-Meta",
          algorithm: "GradientBoost + Random Forest + Seasonal Naive",
          dataset_version: "ds_abc_2024_2026",
          hyperparameters: { n_estimators: 100, learning_rate: 0.08, lags: [1, 7, 14, 30] },
          metrics: { mae: 4.12, rmse: 6.85, wape: 8.4, mape: 7.56, r2: 0.912 },
          training_duration_sec: 38.4,
          created_at: "2026-11-20 14:32:00",
          artifact_uri: "s3://demandflow-mlops/models/ensemble_meta/weights.pkl",
          status: "FINISHED",
        },
        {
          run_id: "run_exp_xgb_02",
          experiment_name: "demand_forecast_benchmarks",
          model_name: "DemandFlow-XGBoost-Deep",
          algorithm: "Extreme Gradient Boosting",
          dataset_version: "ds_abc_2024_2026",
          hyperparameters: { n_estimators: 120, learning_rate: 0.05, max_depth: 6 },
          metrics: { mae: 4.89, rmse: 7.42, wape: 9.8, mape: 8.82, r2: 0.884 },
          training_duration_sec: 29.1,
          created_at: "2026-11-18 10:15:00",
          artifact_uri: "s3://demandflow-mlops/models/xgboost/weights.pkl",
          status: "FINISHED",
        },
        {
          run_id: "run_exp_rf_03",
          experiment_name: "demand_forecast_benchmarks",
          model_name: "DemandFlow-RandomForest-Base",
          algorithm: "Random Forest Regressor",
          dataset_version: "ds_abc_2024_2026",
          hyperparameters: { n_estimators: 150, max_depth: 10 },
          metrics: { mae: 5.62, rmse: 8.10, wape: 11.5, mape: 10.35, r2: 0.850 },
          training_duration_sec: 44.2,
          created_at: "2026-11-16 11:20:00",
          artifact_uri: "s3://demandflow-mlops/models/random_forest/weights.pkl",
          status: "FINISHED",
        },
        {
          run_id: "run_exp_naive_04",
          experiment_name: "demand_forecast_benchmarks",
          model_name: "Seasonal-Naive-Baseline",
          algorithm: "7-Day Cyclical Naive",
          dataset_version: "ds_abc_2024_2026",
          hyperparameters: { cycle: 7 },
          metrics: { mae: 10.20, rmse: 14.50, wape: 19.4, mape: 17.46, r2: 0.690 },
          training_duration_sec: 0.5,
          created_at: "2026-11-01 08:00:00",
          artifact_uri: "s3://demandflow-mlops/models/naive/weights.pkl",
          status: "FINISHED",
        },
      ];
      setExperiments(fallbackRuns);
      setSelectedRun(fallbackRuns[0]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/90 to-card/70 p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#00adb5]">
                <FlaskConical className="size-4" /> MLflow Experiments
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">
                Experiment Tracking & Model Backtesting
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Track training hyperparameters, chronological cross-validation metrics, and artifact lineages across multiple model candidates.
              </p>
            </div>
            <button
              onClick={loadExperiments}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
        </div>

        {/* Experiment Runs Table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <span className="font-bold text-sm">Tracked Experiment Runs ({experiments.length})</span>
            <span className="text-xs text-[#00adb5] font-semibold flex items-center gap-1">
              <Trophy className="size-3.5" /> Best Validated: DemandFlow-Ensemble-Meta (WAPE 8.4%)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3.5">Run & Model Name</th>
                  <th className="p-3.5">Algorithm</th>
                  <th className="p-3.5">WAPE (%)</th>
                  <th className="p-3.5">MAE</th>
                  <th className="p-3.5">RMSE</th>
                  <th className="p-3.5">R² Score</th>
                  <th className="p-3.5">Duration</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {experiments.map((exp, idx) => {
                  const isBest = idx === 0;
                  const isSelected = selectedRun?.run_id === exp.run_id;
                  return (
                    <tr
                      key={exp.run_id}
                      onClick={() => setSelectedRun(exp)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-[#00adb5]/10" : "hover:bg-muted/30"
                      }`}
                    >
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          {isBest && <Trophy className="size-3.5 text-amber-500 shrink-0" />}
                          <span className="font-bold text-foreground">{exp.model_name}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">{exp.run_id}</div>
                      </td>
                      <td className="p-3.5 font-medium text-foreground">{exp.algorithm}</td>
                      <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                        {exp.metrics.wape}%
                      </td>
                      <td className="p-3.5 font-semibold text-foreground">{exp.metrics.mae}</td>
                      <td className="p-3.5 text-muted-foreground">{exp.metrics.rmse}</td>
                      <td className="p-3.5 font-bold text-[#00adb5]">{exp.metrics.r2}</td>
                      <td className="p-3.5 text-muted-foreground">{exp.training_duration_sec}s</td>
                      <td className="p-3.5 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Run Hyperparameters & Artifact Drawer */}
        {selectedRun && (
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#00adb5]">Run Manifest</span>
                <h3 className="text-sm font-bold text-foreground mt-0.5">{selectedRun.model_name}</h3>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{selectedRun.artifact_uri}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="font-bold text-foreground mb-2">Hyperparameters:</h4>
                <pre className="p-3 rounded-xl bg-muted/60 border border-border text-[11px] font-mono text-foreground overflow-auto">
                  {JSON.stringify(selectedRun.hyperparameters, null, 2)}
                </pre>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-2">Metrics Summary:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-muted/30 border border-border">
                    <span className="text-muted-foreground">WAPE:</span>
                    <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedRun.metrics.wape}%
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border">
                    <span className="text-muted-foreground">MAE:</span>
                    <div className="text-base font-bold text-foreground">{selectedRun.metrics.mae}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border">
                    <span className="text-muted-foreground">RMSE:</span>
                    <div className="text-base font-bold text-foreground">{selectedRun.metrics.rmse}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border">
                    <span className="text-muted-foreground">R² Score:</span>
                    <div className="text-base font-bold text-[#00adb5]">{selectedRun.metrics.r2}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
