// DemandFlow AI - Central API Client
// Connects to Python FastAPI backend with resilient failover & cache

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8000";

export interface Company {
  id: string;
  name: string;
  industry: string;
  currency: string;
  status: string;
}

export interface Warehouse {
  id: string;
  company_id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  capacity_sqft: number;
  current_utilization_pct: number;
  manager: string;
  status: string;
}

export interface ProductItem {
  id: string;
  company_id: string;
  warehouse_id: string;
  name: string;
  category: string;
  brand: string;
  sku: string;
  description?: string;
  unit_price: number;
  cost_price: number;
  supplier: string;
  current_inventory: number;
  minimum_stock: number;
  maximum_stock: number;
  lead_time_days: number;
  demand_trend?: "up" | "down" | "stable";
  predicted_demand_7d?: number;
}

export interface InventoryRecommendation {
  product_id: string;
  product_name: string;
  warehouse_id: string;
  warehouse_name: string;
  current_stock: number;
  predicted_demand_7d: number;
  predicted_demand_30d: number;
  safety_stock: number;
  reorder_point: number;
  reorder_quantity: number;
  days_of_inventory_remaining: number;
  expected_shortage: number;
  stockout_risk: "Low" | "Medium" | "High" | "Critical" | "Overstock";
  suggested_action: string;
  lead_time_days: number;
  calculation_breakdown: string;
}

export interface ForecastPoint {
  date: string;
  actual: number | null;
  predicted: number;
  lower_bound: number;
  upper_bound: number;
}

export interface ForecastResponse {
  forecast_id: string;
  company_id: string;
  warehouse_id: string;
  product_id?: string | null;
  product_name?: string | null;
  model_used: string;
  model_version: string;
  horizon_days: number;
  generated_at: string;
  metrics: {
    mae: number;
    rmse: number;
    wape: number;
    mape: number;
    r2: number;
  };
  points: ForecastPoint[];
  historical_points: Array<{ date: string; actual: number; predicted: null }>;
}

export interface RegisteredModel {
  model_id: string;
  name: string;
  algorithm: string;
  version: string;
  stage: "production" | "staging" | "development" | "archived";
  dataset_version: string;
  accuracy_pct: number;
  mae: number;
  rmse: number;
  wape: number;
  r2: number;
  trained_at: string;
  deployed_at?: string | null;
  description: string;
}

export interface PipelineStageLog {
  stage_name: string;
  status: string;
  duration_sec: number;
  logs: string[];
}

export interface PipelineRun {
  run_id: string;
  pipeline_name: string;
  started_at: string;
  completed_at?: string;
  status: "idle" | "running" | "completed" | "failed" | "warning";
  duration_sec: number;
  stages: PipelineStageLog[];
  triggered_by: string;
}

export interface MonitoringOverview {
  timestamp: string;
  model_id: string;
  model_version: string;
  prediction_count_24h: number;
  avg_latency_ms: number;
  error_rate_pct: number;
  data_freshness_hours: number;
  data_drift_score: number;
  drift_detected: boolean;
  feature_drift_details: Array<{ feature: string; p_value: number; status: string; drift: boolean }>;
  prediction_drift_detected: boolean;
  current_mae: number;
  baseline_mae: number;
}

export interface AlertItem {
  id: string;
  title: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  source: string;
  timestamp: string;
  is_read: boolean;
  action_url?: string;
}

// Built-in Demo Data Cache (for fast offline responsiveness)
const DEFAULT_COMPANIES: Company[] = [
  {
    id: "comp_abc",
    name: "ABC Retail Distribution",
    industry: "Omnichannel Retail & FMCG Supply Chain",
    currency: "INR",
    status: "active",
  },
];

const DEFAULT_WAREHOUSES: Warehouse[] = [
  {
    id: "wh_nagpur",
    company_id: "comp_abc",
    name: "Nagpur Central Logistics Hub",
    city: "Nagpur",
    state: "Maharashtra",
    country: "India",
    capacity_sqft: 150000,
    current_utilization_pct: 78.4,
    manager: "Rajesh Deshmukh",
    status: "operational",
  },
  {
    id: "wh_pune",
    company_id: "comp_abc",
    name: "Pune High-Tech Distribution Center",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    capacity_sqft: 120000,
    current_utilization_pct: 84.2,
    manager: "Pooja Kulkarni",
    status: "operational",
  },
  {
    id: "wh_mumbai",
    company_id: "comp_abc",
    name: "Mumbai Harbor Fulfillment Port",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    capacity_sqft: 200000,
    current_utilization_pct: 91.0,
    manager: "Amitabh Verma",
    status: "operational",
  },
  {
    id: "wh_nashik",
    company_id: "comp_abc",
    name: "Nashik Agro & Retail Facility",
    city: "Nashik",
    state: "Maharashtra",
    country: "India",
    capacity_sqft: 85000,
    current_utilization_pct: 64.5,
    manager: "Sunil Shinde",
    status: "operational",
  },
];

// Fallback fetch wrapper
async function apiFetch<T>(endpoint: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw err;
  }
}

export const api = {
  // Health
  checkHealth: () => apiFetch<{ status: string }>("/health", undefined, { status: "offline_fallback" }),

  // Companies
  getCompanies: () => apiFetch<Company[]>("/api/companies", undefined, DEFAULT_COMPANIES),

  // Warehouses
  getWarehouses: (companyId?: string) =>
    apiFetch<Warehouse[]>(
      companyId ? `/api/warehouses?company_id=${companyId}` : "/api/warehouses",
      undefined,
      DEFAULT_WAREHOUSES
    ),

  // Products
  getProducts: (params?: { warehouse_id?: string; category?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.warehouse_id) query.append("warehouse_id", params.warehouse_id);
    if (params?.category) query.append("category", params.category);
    if (params?.search) query.append("search", params.search);
    return apiFetch<ProductItem[]>(`/api/products?${query.toString()}`);
  },

  createProduct: (data: Partial<ProductItem>) =>
    apiFetch<ProductItem>("/api/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: string) =>
    apiFetch<{ success: boolean }>(`/api/products/${id}`, { method: "DELETE" }),

  // Inventory Recommendations
  getInventoryRecommendations: (params?: { warehouse_id?: string; category?: string }) => {
    const query = new URLSearchParams();
    if (params?.warehouse_id) query.append("warehouse_id", params.warehouse_id);
    if (params?.category) query.append("category", params.category);
    return apiFetch<InventoryRecommendation[]>(`/api/inventory/recommendations?${query.toString()}`);
  },

  // Forecast
  generateForecast: (req: {
    company_id?: string;
    warehouse_id?: string;
    product_id?: string;
    category?: string;
    horizon_days?: number;
    model_name?: string;
  }) =>
    apiFetch<ForecastResponse>("/api/forecast", {
      method: "POST",
      body: JSON.stringify(req),
    }),

  // Models & Registry
  getModels: () => apiFetch<RegisteredModel[]>("/api/models"),
  deployModel: (modelId: string) =>
    apiFetch<RegisteredModel>(`/api/models/${modelId}/deploy`, { method: "POST" }),
  rollbackModel: (modelId: string) =>
    apiFetch<RegisteredModel>(`/api/models/${modelId}/rollback`, { method: "POST" }),

  // Pipelines
  getPipelines: () => apiFetch<PipelineRun[]>("/api/pipelines"),
  runPipeline: (pipelineName?: string) =>
    apiFetch<PipelineRun>("/api/pipelines/run", {
      method: "POST",
      body: JSON.stringify({ pipeline_name: pipelineName }),
    }),

  // Monitoring
  getMonitoring: () => apiFetch<MonitoringOverview>("/api/monitoring"),

  // Alerts
  getAlerts: () => apiFetch<AlertItem[]>("/api/alerts"),

  // What-If
  simulateWhatIf: (req: {
    product_id: string;
    price_change_pct: number;
    marketing_boost_pct: number;
    holiday_season: boolean;
    supply_delay_days: number;
  }) =>
    apiFetch<any>("/api/whatif", {
      method: "POST",
      body: JSON.stringify(req),
    }),
};
