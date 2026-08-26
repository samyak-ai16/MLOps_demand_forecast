import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getDatasetPreview } from "@/lib/demo-data";
import {
  Upload, Database, CheckCircle, XCircle, AlertTriangle,
  Search, ChevronLeft, ChevronRight, Eye,
} from "lucide-react";

const dataQualityChecks = [
  { name: "Missing values", status: "pass", detail: "0.2% (imputed)" },
  { name: "Duplicate records", status: "pass", detail: "12 removed" },
  { name: "Invalid dates", status: "pass", detail: "0 found" },
  { name: "Negative sales", status: "pass", detail: "0 found" },
  { name: "Outliers", status: "pass", detail: "3 flagged, reviewed" },
  { name: "Missing product IDs", status: "pass", detail: "0 found" },
];

export default function DataManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const preview = getDatasetPreview();
  const perPage = 15;

  const filtered = preview.filter((r) =>
    !search || r.productName.toLowerCase().includes(search.toLowerCase()) || r.productId.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  const cols = ["date", "productId", "productName", "category", "region", "price", "unitsSold", "revenue", "inventory", "promotion", "holiday", "weather", "competitorPrice"];
  const colLabels: Record<string, string> = {
    date: "Date", productId: "Product ID", productName: "Name", category: "Category",
    region: "Region", price: "Price", unitsSold: "Units", revenue: "Revenue",
    inventory: "Inventory", promotion: "Promo", holiday: "Holiday", weather: "Weather", competitorPrice: "Comp. Price",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Data Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Upload, validate, and manage datasets</p>
        </div>

        {/* Upload section */}
        <div className="nb-card-static bg-card p-6">
          <h3 className="text-sm font-bold mb-4">Data Ingestion</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Upload CSV", icon: Upload, color: "bg-blue-100" },
              { label: "Upload Excel", icon: Upload, color: "bg-green-100" },
              { label: "Connect DB", icon: Database, color: "bg-purple-100" },
              { label: "Load Demo Data", icon: Database, color: "bg-amber-100" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.label} className="nb-btn bg-card p-4 flex flex-col items-center gap-2 text-center">
                  <div className={`p-3 border-2 border-border ${item.color}`}>
                    <Icon className="size-5" />
                  </div>
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dataset Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: "Total Records", value: "182,500" },
            { label: "Products", value: "22" },
            { label: "Categories", value: "8" },
            { label: "Missing Values", value: "365" },
            { label: "Duplicates", value: "12" },
            { label: "Date Range", value: "12 months" },
            { label: "Quality Score", value: "96%" },
          ].map((s) => (
            <div key={s.label} className="nb-card-static bg-card p-3 text-center">
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-[10px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Data Quality */}
        <Card className="nb-card-static">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <CheckCircle className="size-4 text-green-600" />
              Data Quality Score: 96%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted h-4 mb-4 border-2 border-border">
              <div className="bg-green-500 h-full" style={{ width: "96%" }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {dataQualityChecks.map((check) => (
                <div key={check.name} className="flex items-center gap-2 text-sm border-2 border-border p-2">
                  <CheckCircle className="size-4 text-green-600 shrink-0" />
                  <span className="font-medium">{check.name}</span>
                  <span className="text-muted-foreground text-xs ml-auto">{check.detail}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dataset Preview */}
        <Card className="nb-card-static">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold">Dataset Preview</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="nb-input pl-7 pr-2 py-1 text-xs bg-background w-48"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-border bg-muted">
                  {cols.map((c) => (
                    <th key={c} className="px-2 py-1.5 text-left font-bold whitespace-nowrap">{colLabels[c]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageData.map((r, i) => (
                  <tr key={i} className="border-b border-border hover:bg-muted/50">
                    {cols.map((c) => (
                      <td key={c} className="px-2 py-1.5 whitespace-nowrap font-mono">
                        {typeof r[c as keyof typeof r] === "boolean"
                          ? (r[c as keyof typeof r] ? "✓" : "—")
                          : String(r[c as keyof typeof r])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] text-muted-foreground">
                Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
              </span>
              <div className="flex gap-1">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="nb-btn bg-card p-1 disabled:opacity-40"><ChevronLeft className="size-3" /></button>
                <span className="nb-badge bg-muted px-2 py-0.5 text-[10px]">{page}/{totalPages || 1}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="nb-btn bg-card p-1 disabled:opacity-40"><ChevronRight className="size-3" /></button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
