import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { products } from "@/lib/demo-data";
import {
  TrendingUp, TrendingDown, Minus, Search, ChevronLeft, ChevronRight,
  Plus, Edit, Trash2, Eye,
} from "lucide-react";

type SortKey = "id" | "name" | "category" | "currentStock" | "avgDemand" | "forecastAccuracy";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const cats = [...new Set(products.map((p) => p.category))];

  let filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter !== "all" && p.category !== catFilter) return false;
    return true;
  });

  filtered.sort((a, b) => {
    const va = a[sortKey];
    const vb = b[sortKey];
    if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
    return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? <span className="ml-0.5">↑</span> : <span className="ml-0.5">↓</span>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Product Management</h1>
            <p className="text-muted-foreground text-sm mt-1">{products.length} products tracked</p>
          </div>
          <button className="nb-btn bg-primary text-primary-foreground px-4 py-1.5 text-sm flex items-center gap-1.5">
            <Plus className="size-3.5" /> Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="nb-input w-full pl-8 pr-3 py-1.5 text-sm bg-background"
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
            className="nb-select bg-background px-2 py-1.5 text-sm"
          >
            <option value="all">All Categories</option>
            {cats.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Table */}
        <Card className="nb-card-static overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border bg-muted">
                {[
                  { key: "id" as SortKey, label: "ID" },
                  { key: "name" as SortKey, label: "Product Name" },
                  { key: "category" as SortKey, label: "Category" },
                  { key: "currentStock" as SortKey, label: "Stock" },
                  { key: "avgDemand" as SortKey, label: "Avg Demand" },
                  { key: "forecastAccuracy" as SortKey, label: "Accuracy" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-2 text-left font-bold cursor-pointer hover:bg-muted-foreground/10 select-none whitespace-nowrap"
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}<SortIcon col={col.key} />
                  </th>
                ))}
                <th className="px-3 py-2 text-left font-bold whitespace-nowrap">Trend</th>
                <th className="px-3 py-2 text-left font-bold whitespace-nowrap">Status</th>
                <th className="px-3 py-2 text-left font-bold whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((p) => (
                <tr key={p.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-3 py-2 font-mono text-xs font-bold">{p.id}</td>
                  <td className="px-3 py-2 font-medium">{p.name}</td>
                  <td className="px-3 py-2">
                    <span className="nb-badge bg-muted text-xs">{p.category}</span>
                  </td>
                  <td className="px-3 py-2 font-mono">{p.currentStock}</td>
                  <td className="px-3 py-2 font-mono">{p.avgDemand}</td>
                  <td className="px-3 py-2 font-mono">{p.forecastAccuracy}%</td>
                  <td className="px-3 py-2">
                    {p.demandTrend === "up" && <TrendingUp className="size-4 text-green-600" />}
                    {p.demandTrend === "down" && <TrendingDown className="size-4 text-red-600" />}
                    {p.demandTrend === "stable" && <Minus className="size-4 text-muted-foreground" />}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`nb-badge text-[10px] px-1.5 py-0.5 ${
                      p.status === "healthy" ? "bg-green-100 text-green-800" :
                      p.status === "warning" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-muted"><Eye className="size-3.5" /></button>
                      <button className="p-1 hover:bg-muted"><Edit className="size-3.5" /></button>
                      <button className="p-1 hover:bg-muted text-destructive"><Trash2 className="size-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-1">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="nb-btn bg-card p-1.5 disabled:opacity-40"><ChevronLeft className="size-4" /></button>
            <span className="nb-badge bg-muted px-3 py-1 text-xs">{page}/{totalPages || 1}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="nb-btn bg-card p-1.5 disabled:opacity-40"><ChevronRight className="size-4" /></button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
