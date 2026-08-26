import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { systemLogs } from "@/lib/demo-data";
import { ScrollText, Filter } from "lucide-react";

export default function LogsPage() {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? systemLogs : systemLogs.filter((l) => l.status === filter);

  const statusStyle: Record<string, string> = {
    success: "bg-green-100 text-green-800 border-green-400",
    info: "bg-blue-100 text-blue-800 border-blue-400",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-400",
    error: "bg-red-100 text-red-800 border-red-400",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">System Logs</h1>
            <p className="text-muted-foreground text-sm mt-1">View system events and audit trail</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            {["all", "success", "info", "warning", "error"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`nb-btn px-3 py-1 text-xs ${filter === f ? "bg-primary text-primary-foreground" : "bg-card"}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="nb-card-static bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border bg-muted">
                {["Timestamp", "Event", "Service", "Model", "Version", "Status", "Message"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-bold text-xs whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => (
                <tr key={i} className="border-b border-border hover:bg-muted/50">
                  <td className="px-3 py-2 font-mono text-[10px] whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-3 py-2 font-bold text-xs">{log.event}</td>
                  <td className="px-3 py-2 text-xs">{log.service}</td>
                  <td className="px-3 py-2 text-xs">{log.model}</td>
                  <td className="px-3 py-2 font-mono text-xs">{log.version}</td>
                  <td className="px-3 py-2">
                    <span className={`nb-badge text-[10px] px-1.5 py-0.5 border ${statusStyle[log.status]}`}>
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground max-w-xs truncate">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
