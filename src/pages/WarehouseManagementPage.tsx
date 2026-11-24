import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Warehouse3DScene } from "@/components/3d/Warehouse3DScene";
import { api, Warehouse } from "@/lib/api";
import {
  Building2, MapPin, Gauge, Package, AlertTriangle, ShieldCheck,
  Plus, Search, RefreshCw, Layers, CheckCircle2, ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";

export default function WarehouseManagementPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    setLoading(true);
    try {
      const data = await api.getWarehouses("comp_abc");
      setWarehouses(data);
      if (data.length > 0 && !selectedWarehouse) {
        setSelectedWarehouse(data[0]);
      }
    } catch (e) {
      console.error(e);
      toast.error("Could not load warehouses from API, using fallback cache");
    } finally {
      setLoading(false);
    }
  };

  const filtered = warehouses.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/90 to-card/70 p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#00adb5]">
                <Building2 className="size-4" /> Multi-Facility Management
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">
                Warehouse Operations & 3D Spatial Digital Twin
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Monitor storage capacity, racking zones, and live inventory allocations across central and regional distribution hubs.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadWarehouses}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
              >
                <RefreshCw className="size-3.5" /> Refresh
              </button>
            </div>
          </div>
        </div>

        {/* 3D Interactive Warehouse Digital Twin */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Layers className="size-4 text-[#00adb5]" />
              3D Interactive Facility Twin:{" "}
              <span className="text-[#00adb5]">{selectedWarehouse?.name || "Nagpur Central"}</span>
            </h3>
            <span className="text-xs text-muted-foreground">Click and drag to rotate • Click bays to inspect</span>
          </div>
          <Warehouse3DScene warehouseName={selectedWarehouse?.name} />
        </div>

        {/* Warehouse Cards Grid */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold">Distribution Facilities ({warehouses.length})</h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search city or facility..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-[#00adb5]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((wh) => {
              const isSelected = selectedWarehouse?.id === wh.id;
              return (
                <div
                  key={wh.id}
                  onClick={() => setSelectedWarehouse(wh)}
                  className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#00adb5] bg-[#00adb5]/5 shadow-md ring-1 ring-[#00adb5]"
                      : "border-border/70 bg-card hover:border-[#00adb5]/50 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {wh.city}, {wh.state}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      {wh.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-foreground mb-3">{wh.name}</h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Capacity:</span>
                      <span className="font-semibold text-foreground">{wh.capacity_sqft.toLocaleString()} sq ft</span>
                    </div>

                    <div>
                      <div className="flex justify-between text-muted-foreground mb-1">
                        <span>Utilization:</span>
                        <span className="font-bold text-foreground">{wh.current_utilization_pct}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            wh.current_utilization_pct > 85
                              ? "bg-amber-500"
                              : "bg-[#00adb5]"
                          }`}
                          style={{ width: `${wh.current_utilization_pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-muted-foreground pt-1">
                      <span>Manager:</span>
                      <span className="font-medium text-foreground">{wh.manager}</span>
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
