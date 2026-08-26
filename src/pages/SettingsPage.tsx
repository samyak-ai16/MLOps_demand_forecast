import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Settings, RefreshCw, Bell, Shield, Database, Server } from "lucide-react";

export default function SettingsPage() {
  const [autoRetrain, setAutoRetrain] = useState(true);
  const [threshold, setThreshold] = useState(90);
  const [driftAlert, setDriftAlert] = useState(true);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">System configuration and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Retraining */}
          <Card className="nb-card-static">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <RefreshCw className="size-4" /> Automated Retraining
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-Retraining</span>
                <button
                  onClick={() => setAutoRetrain(!autoRetrain)}
                  className={`nb-btn px-4 py-1 text-xs ${autoRetrain ? "bg-green-500 text-white" : "bg-muted"}`}
                >
                  {autoRetrain ? "ENABLED" : "DISABLED"}
                </button>
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">Accuracy Threshold: {threshold}%</label>
                <input
                  type="range" min={70} max={99} value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="bg-muted p-3 border-2 border-border text-sm">
                <strong>Last Retrained:</strong> 2025-12-14 04:35<br />
                <strong>Next Scheduled:</strong> 2025-12-21 02:00<br />
                <strong>Trigger:</strong> Accuracy below {threshold}% or data drift detected
              </div>
              <button className="nb-btn bg-primary text-primary-foreground px-4 py-1.5 text-sm w-full">
                Retrain Model Now
              </button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="nb-card-static">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <Bell className="size-4" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Model accuracy degradation", enabled: true },
                { label: "Data drift detected", enabled: true },
                { label: "Pipeline failure", enabled: true },
                { label: "Stockout risk alerts", enabled: true },
                { label: "Weekly reports", enabled: false },
                { label: "Anomaly detection", enabled: driftAlert, setter: setDriftAlert },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between text-sm border-b border-border pb-2">
                  <span>{n.label}</span>
                  <button
                    onClick={() => n.setter ? n.setter(!n.enabled) : undefined}
                    className={`nb-btn px-3 py-0.5 text-[10px] ${n.enabled ? "bg-green-500 text-white" : "bg-muted"}`}
                  >
                    {n.enabled ? "ON" : "OFF"}
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* API Settings */}
          <Card className="nb-card-static">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <Server className="size-4" /> API Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-bold mb-1 block">Prediction API Endpoint</label>
                <input className="nb-input w-full bg-background px-2 py-1.5 text-xs font-mono" value="https://api.mlops-forecast.com/v2/predict" readOnly />
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">API Rate Limit</label>
                <input className="nb-input w-full bg-background px-2 py-1.5 text-xs" value="1000 req/min" readOnly />
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">Model Version</label>
                <input className="nb-input w-full bg-background px-2 py-1.5 text-xs" value="XGBoost v2.1 (Production)" readOnly />
              </div>
            </CardContent>
          </Card>

          {/* Admin */}
          <Card className="nb-card-static">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <Shield className="size-4" /> Admin Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "Manage Users",
                "Manage Datasets",
                "Manage Models",
                "Manage Products",
                "System Configuration",
                "View Logs",
                "API Keys",
              ].map((item) => (
                <button key={item} className="nb-btn bg-card w-full text-left px-3 py-2 text-sm">
                  {item} →
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
