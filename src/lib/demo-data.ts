// MLOps Demand Forecasting Platform - Demo Data
// Realistic synthetic data for all platform modules

export interface Product {
  id: string;
  name: string;
  category: string;
  region: string;
  price: number;
  currentStock: number;
  avgDemand: number;
  predictedDemand: number;
  demandTrend: "up" | "down" | "stable";
  forecastAccuracy: number;
  model: string;
  status: "healthy" | "warning" | "critical";
  supplier: string;
}

export interface Sale {
  date: string;
  productId: string;
  productName: string;
  category: string;
  region: string;
  unitsSold: number;
  revenue: number;
  inventory: number;
  promotion: boolean;
  holiday: boolean;
}

export interface ForecastPoint {
  date: string;
  actual: number | null;
  predicted: number | null;
  upperBound: number;
  lowerBound: number;
}

export interface MLModel {
  id: string;
  name: string;
  version: string;
  type: string;
  accuracy: number;
  mae: number;
  rmse: number;
  mape: number;
  r2: number;
  trainingDate: string;
  trainingDuration: string;
  datasetVersion: string;
  status: "production" | "staging" | "development" | "archived";
  stage: "Production" | "Staging" | "Development" | "Archived";
}

export interface PipelineStage {
  id: string;
  name: string;
  status: "completed" | "running" | "warning" | "failed" | "pending";
  startTime: string;
  endTime: string | null;
  duration: string | null;
  version: string;
  logs: string[];
  errors: string[];
}

export interface Anomaly {
  id: string;
  date: string;
  productId: string;
  productName: string;
  type: "spike" | "drop" | "inventory" | "data_quality";
  severity: "low" | "medium" | "high" | "critical";
  expected: number;
  actual: number;
  deviation: string;
  description: string;
}

export interface Notification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface LogEntry {
  timestamp: string;
  event: string;
  service: string;
  model: string;
  version: string;
  status: "error" | "warning" | "info" | "success";
  message: string;
}

export interface MonitorMetric {
  timestamp: string;
  accuracy: number;
  mae: number;
  rmse: number;
  latency: number;
  requests: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
}

export interface DatasetRecord {
  date: string;
  productId: string;
  productName: string;
  category: string;
  region: string;
  price: number;
  unitsSold: number;
  revenue: number;
  inventory: number;
  promotion: boolean;
  holiday: boolean;
  weather: string;
  competitorPrice: number;
}

// ── Categories ──────────────────────────────────────────────
export const categories = [
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Sports & Outdoors",
  "Books & Media",
  "Health & Beauty",
  "Toys & Games",
  "Food & Beverages",
];

export const regions = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East"];

// ── Products ────────────────────────────────────────────────
export const products: Product[] = [
  { id: "P101", name: "Wireless Headphones", category: "Electronics", region: "North America", price: 79.99, currentStock: 342, avgDemand: 120, predictedDemand: 145, demandTrend: "up", forecastAccuracy: 94.7, model: "XGBoost v2.1", status: "healthy", supplier: "TechParts Inc" },
  { id: "P102", name: "USB-C Hub Adapter", category: "Electronics", region: "Europe", price: 49.99, currentStock: 180, avgDemand: 85, predictedDemand: 92, demandTrend: "stable", forecastAccuracy: 93.2, model: "XGBoost v2.1", status: "healthy", supplier: "ConnectTech" },
  { id: "P103", name: "Bluetooth Speaker", category: "Electronics", region: "Asia Pacific", price: 129.99, currentStock: 56, avgDemand: 95, predictedDemand: 130, demandTrend: "up", forecastAccuracy: 91.8, model: "Random Forest v3.0", status: "warning", supplier: "AudioMax" },
  { id: "P104", name: "Laptop Stand", category: "Electronics", region: "North America", price: 34.99, currentStock: 230, avgDemand: 68, predictedDemand: 82, demandTrend: "up", forecastAccuracy: 95.1, model: "XGBoost v2.1", status: "healthy", supplier: "DeskWorks" },
  { id: "P105", name: "Mechanical Keyboard", category: "Electronics", region: "Europe", price: 149.99, currentStock: 189, avgDemand: 72, predictedDemand: 78, demandTrend: "stable", forecastAccuracy: 92.4, model: "LSTM v1.2", status: "healthy", supplier: "KeyCraft" },
  { id: "P106", name: "Running Shoes Pro", category: "Sports & Outdoors", region: "North America", price: 119.99, currentStock: 145, avgDemand: 110, predictedDemand: 125, demandTrend: "up", forecastAccuracy: 93.6, model: "XGBoost v2.1", status: "healthy", supplier: "AthleteGear" },
  { id: "P107", name: "Yoga Mat Premium", category: "Sports & Outdoors", region: "Europe", price: 44.99, currentStock: 290, avgDemand: 55, predictedDemand: 48, demandTrend: "down", forecastAccuracy: 90.2, model: "Prophet v2.0", status: "warning", supplier: "ZenFit" },
  { id: "P108", name: "Stainless Water Bottle", category: "Sports & Outdoors", region: "Asia Pacific", price: 24.99, currentStock: 520, avgDemand: 180, predictedDemand: 195, demandTrend: "up", forecastAccuracy: 94.1, model: "XGBoost v2.1", status: "healthy", supplier: "HydroLife" },
  { id: "P109", name: "Cotton T-Shirt Pack", category: "Clothing", region: "North America", price: 29.99, currentStock: 410, avgDemand: 200, predictedDemand: 210, demandTrend: "stable", forecastAccuracy: 91.5, model: "Random Forest v3.0", status: "healthy", supplier: "FabricCo" },
  { id: "P110", name: "Denim Jacket Classic", category: "Clothing", region: "Europe", price: 89.99, currentStock: 78, avgDemand: 45, predictedDemand: 55, demandTrend: "up", forecastAccuracy: 89.7, model: "LightGBM v1.5", status: "warning", supplier: "DenimWorks" },
  { id: "P111", name: "Smart Watch Series 5", category: "Electronics", region: "North America", price: 249.99, currentStock: 95, avgDemand: 88, predictedDemand: 110, demandTrend: "up", forecastAccuracy: 93.8, model: "XGBoost v2.1", status: "healthy", supplier: "WristTech" },
  { id: "P112", name: "Cast Iron Skillet", category: "Home & Kitchen", region: "North America", price: 39.99, currentStock: 165, avgDemand: 62, predictedDemand: 58, demandTrend: "stable", forecastAccuracy: 92.1, model: "ARIMA v1.8", status: "healthy", supplier: "KitchenPro" },
  { id: "P113", name: "Bamboo Cutting Board", category: "Home & Kitchen", region: "Europe", price: 22.99, currentStock: 310, avgDemand: 75, predictedDemand: 80, demandTrend: "up", forecastAccuracy: 91.3, model: "Random Forest v3.0", status: "healthy", supplier: "EcoKitchen" },
  { id: "P114", name: "LED Desk Lamp", category: "Home & Kitchen", region: "Asia Pacific", price: 54.99, currentStock: 140, avgDemand: 50, predictedDemand: 65, demandTrend: "up", forecastAccuracy: 90.8, model: "LightGBM v1.5", status: "healthy", supplier: "BrightHome" },
  { id: "P115", name: "Organic Green Tea", category: "Food & Beverages", region: "Asia Pacific", price: 14.99, currentStock: 680, avgDemand: 320, predictedDemand: 345, demandTrend: "up", forecastAccuracy: 94.5, model: "XGBoost v2.1", status: "healthy", supplier: "TeaGarden" },
  { id: "P116", name: "Vitamin D Supplements", category: "Health & Beauty", region: "North America", price: 18.99, currentStock: 425, avgDemand: 155, predictedDemand: 170, demandTrend: "up", forecastAccuracy: 93.4, model: "Prophet v2.0", status: "healthy", supplier: "VitaLife" },
  { id: "P117", name: "Protein Powder 2kg", category: "Health & Beauty", region: "North America", price: 59.99, currentStock: 195, avgDemand: 95, predictedDemand: 105, demandTrend: "up", forecastAccuracy: 92.9, model: "XGBoost v2.1", status: "healthy", supplier: "FitFuel" },
  { id: "P118", name: "Building Blocks Set", category: "Toys & Games", region: "Europe", price: 44.99, currentStock: 220, avgDemand: 85, predictedDemand: 95, demandTrend: "up", forecastAccuracy: 91.7, model: "Random Forest v3.0", status: "healthy", supplier: "PlayMakers" },
  { id: "P119", name: "Board Game Collection", category: "Toys & Games", region: "North America", price: 34.99, currentStock: 175, avgDemand: 65, predictedDemand: 72, demandTrend: "stable", forecastAccuracy: 90.5, model: "LSTM v1.2", status: "healthy", supplier: "GameNight" },
  { id: "P120", name: "Wireless Mouse Pro", category: "Electronics", region: "North America", price: 39.99, currentStock: 285, avgDemand: 130, predictedDemand: 140, demandTrend: "stable", forecastAccuracy: 94.3, model: "XGBoost v2.1", status: "healthy", supplier: "ClickTech" },
  { id: "P121", name: "Noise Cancelling Earbuds", category: "Electronics", region: "Europe", price: 159.99, currentStock: 62, avgDemand: 78, predictedDemand: 98, demandTrend: "up", forecastAccuracy: 92.6, model: "LightGBM v1.5", status: "warning", supplier: "AudioMax" },
  { id: "P122", name: "Yoga Block Set", category: "Sports & Outdoors", region: "Latin America", price: 19.99, currentStock: 380, avgDemand: 60, predictedDemand: 55, demandTrend: "down", forecastAccuracy: 89.1, model: "ARIMA v1.8", status: "warning", supplier: "ZenFit" },
];

// ── Helper: generate 12 months of daily sales ───────────────
function generateSalesHistory(): Sale[] {
  const sales: Sale[] = [];
  const startDate = new Date("2025-01-01");

  for (let d = 0; d < 365; d++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split("T")[0];
    const month = date.getMonth();
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Seasonal multiplier
    const seasonalMultiplier =
      month === 10 || month === 11 ? 1.4 : // Nov-Dec holiday
      month === 0 ? 0.85 : // Jan post-holiday
      month === 6 || month === 7 ? 1.1 : // Summer
      1.0;

    // Holiday flags (major US holidays)
    const isHoliday =
      (month === 0 && date.getDate() === 1) || // New Year
      (month === 6 && date.getDate() === 4) || // July 4th
      (month === 10 && (date.getDate() >= 22 && date.getDate() <= 30)) || // Thanksgiving week
      (month === 11 && (date.getDate() >= 20 && date.getDate() <= 25)); // Christmas

    const weatherOptions = ["Sunny", "Cloudy", "Rainy", "Snowy", "Windy"];
    const weather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];

    for (const product of products.slice(0, 15)) {
      const baseDemand = product.avgDemand;
      const weekendMultiplier = isWeekend ? 1.24 : 1.0;
      const promotionBoost = Math.random() > 0.85 ? 1.35 : 1.0;
      const holidayBoost = isHoliday ? 1.25 : 1.0;
      const noise = 0.85 + Math.random() * 0.3;

      const unitsSold = Math.max(
        1,
        Math.round(
          baseDemand * seasonalMultiplier * weekendMultiplier * promotionBoost * holidayBoost * noise * (1 / 30)
        )
      );
      const revenue = unitsSold * product.price;

      sales.push({
        date: dateStr,
        productId: product.id,
        productName: product.name,
        category: product.category,
        region: product.region,
        unitsSold,
        revenue: Math.round(revenue * 100) / 100,
        inventory: product.currentStock - unitsSold * 2,
        promotion: Math.random() > 0.85,
        holiday: isHoliday,
      });
    }
  }
  return sales;
}

export const salesHistory = generateSalesHistory();

// ── Generate forecast data for a given product ──────────────
export function generateForecast(productId: string, horizonDays: number = 30): ForecastPoint[] {
  const product = products.find((p) => p.id === productId);
  if (!product) return [];

  const points: ForecastPoint[] = [];
  const today = new Date("2025-12-15");

  // Historical 60 days
  for (let d = -60; d < 0; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() + d);
    const noise = 0.88 + Math.random() * 0.24;
    points.push({
      date: date.toISOString().split("T")[0],
      actual: Math.round(product.avgDemand * noise * (1 / 30)),
      predicted: null,
      upperBound: 0,
      lowerBound: 0,
    });
  }

  // Forecast
  for (let d = 0; d < horizonDays; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() + d);
    const trendFactor = product.demandTrend === "up" ? 1 + d * 0.003 : product.demandTrend === "down" ? 1 - d * 0.002 : 1;
    const basePred = Math.round(product.predictedDemand * trendFactor * (1 / 30));
    const band = Math.round(basePred * 0.15);

    points.push({
      date: date.toISOString().split("T")[0],
      actual: null,
      predicted: basePred,
      upperBound: basePred + band,
      lowerBound: Math.max(0, basePred - band),
    });
  }

  return points;
}

// ── Generate monthly sales aggregation ──────────────────────
export function getMonthlySales(): { month: string; sales: number; revenue: number }[] {
  const monthly: Record<string, { sales: number; revenue: number }> = {};
  for (const sale of salesHistory) {
    const month = sale.date.substring(0, 7);
    if (!monthly[month]) monthly[month] = { sales: 0, revenue: 0 };
    monthly[month].sales += sale.unitsSold;
    monthly[month].revenue += sale.revenue;
  }
  return Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({ month, ...data }));
}

// ── Generate daily sales aggregation ────────────────────────
export function getDailySales(days: number = 30): { date: string; sales: number; revenue: number }[] {
  const daily: Record<string, { sales: number; revenue: number }> = {};
  const cutoff = new Date("2025-12-15");
  cutoff.setDate(cutoff.getDate() - days);

  for (const sale of salesHistory) {
    const saleDate = new Date(sale.date);
    if (saleDate >= cutoff) {
      if (!daily[sale.date]) daily[sale.date] = { sales: 0, revenue: 0 };
      daily[sale.date].sales += sale.unitsSold;
      daily[sale.date].revenue += sale.revenue;
    }
  }
  return Object.entries(daily)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({ date, ...data }));
}

// ── Category performance ────────────────────────────────────
export function getCategoryPerformance(): { category: string; sales: number; revenue: number }[] {
  const catMap: Record<string, { sales: number; revenue: number }> = {};
  for (const sale of salesHistory) {
    if (!catMap[sale.category]) catMap[sale.category] = { sales: 0, revenue: 0 };
    catMap[sale.category].sales += sale.unitsSold;
    catMap[sale.category].revenue += sale.revenue;
  }
  return Object.entries(catMap)
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.revenue - a.revenue);
}

// ── Region performance ──────────────────────────────────────
export function getRegionPerformance(): { region: string; sales: number; revenue: number }[] {
  const regMap: Record<string, { sales: number; revenue: number }> = {};
  for (const sale of salesHistory) {
    if (!regMap[sale.region]) regMap[sale.region] = { sales: 0, revenue: 0 };
    regMap[sale.region].sales += sale.unitsSold;
    regMap[sale.region].revenue += sale.revenue;
  }
  return Object.entries(regMap)
    .map(([region, data]) => ({ region, ...data }))
    .sort((a, b) => b.revenue - a.revenue);
}

// ── Top products by revenue ─────────────────────────────────
export function getTopProducts(n: number = 10): { id: string; name: string; sales: number; revenue: number }[] {
  const prodMap: Record<string, { name: string; sales: number; revenue: number }> = {};
  for (const sale of salesHistory) {
    if (!prodMap[sale.productId]) prodMap[sale.productId] = { name: sale.productName, sales: 0, revenue: 0 };
    prodMap[sale.productId].sales += sale.unitsSold;
    prodMap[sale.productId].revenue += sale.revenue;
  }
  return Object.entries(prodMap)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, n);
}

// ── ML Models ───────────────────────────────────────────────
export const mlModels: MLModel[] = [
  { id: "M001", name: "XGBoost", version: "v2.1", type: "XGBoost", accuracy: 94.7, mae: 12.4, rmse: 18.6, mape: 5.3, r2: 0.94, trainingDate: "2025-12-10", trainingDuration: "42 sec", datasetVersion: "v3.2", status: "production", stage: "Production" },
  { id: "M002", name: "Random Forest", version: "v3.0", type: "Random Forest", accuracy: 91.2, mae: 15.2, rmse: 22.1, mape: 6.8, r2: 0.91, trainingDate: "2025-12-08", trainingDuration: "58 sec", datasetVersion: "v3.2", status: "staging", stage: "Staging" },
  { id: "M003", name: "LSTM", version: "v1.2", type: "LSTM", accuracy: 93.0, mae: 13.8, rmse: 20.4, mape: 6.1, r2: 0.93, trainingDate: "2025-12-05", trainingDuration: "4 min", datasetVersion: "v3.1", status: "staging", stage: "Staging" },
  { id: "M004", name: "ARIMA", version: "v1.8", type: "ARIMA", accuracy: 87.4, mae: 19.4, rmse: 27.2, mape: 8.9, r2: 0.87, trainingDate: "2025-12-01", trainingDuration: "31 sec", datasetVersion: "v3.0", status: "archived", stage: "Archived" },
  { id: "M005", name: "Prophet", version: "v2.0", type: "Prophet", accuracy: 90.8, mae: 16.1, rmse: 23.5, mape: 7.2, r2: 0.90, trainingDate: "2025-11-28", trainingDuration: "25 sec", datasetVersion: "v3.1", status: "development", stage: "Development" },
  { id: "M006", name: "LightGBM", version: "v1.5", type: "LightGBM", accuracy: 93.5, mae: 13.1, rmse: 19.8, mape: 5.8, r2: 0.93, trainingDate: "2025-12-12", trainingDuration: "28 sec", datasetVersion: "v3.2", status: "staging", stage: "Staging" },
  { id: "M007", name: "Linear Regression", version: "v1.0", type: "Linear Regression", accuracy: 82.3, mae: 24.6, rmse: 33.1, mape: 11.2, r2: 0.82, trainingDate: "2025-10-15", trainingDuration: "3 sec", datasetVersion: "v2.5", status: "archived", stage: "Archived" },
  { id: "M008", name: "SARIMA", version: "v1.3", type: "SARIMA", accuracy: 89.1, mae: 18.2, rmse: 25.8, mape: 8.1, r2: 0.89, trainingDate: "2025-11-20", trainingDuration: "45 sec", datasetVersion: "v3.0", status: "development", stage: "Development" },
];

// ── Pipeline stages ─────────────────────────────────────────
export const pipelineStages: PipelineStage[] = [
  { id: "PS01", name: "Data Collection", status: "completed", startTime: "2025-12-14 02:00:00", endTime: "2025-12-14 02:15:00", duration: "15 min", version: "v3.2", logs: ["Collected 182,500 records from 22 products", "Data sources: Sales DB, Inventory API, Weather API"], errors: [] },
  { id: "PS02", name: "Data Validation", status: "completed", startTime: "2025-12-14 02:15:00", endTime: "2025-12-14 02:22:00", duration: "7 min", version: "v3.2", logs: ["Schema validation passed", "Null check: 0.2% missing values"], errors: [] },
  { id: "PS03", name: "Data Preprocessing", status: "completed", startTime: "2025-12-14 02:22:00", endTime: "2025-12-14 02:45:00", duration: "23 min", version: "v3.2", logs: ["Imputed 365 missing values", "Removed 12 duplicate records", "Normalized 8 features"], errors: [] },
  { id: "PS04", name: "Feature Engineering", status: "completed", startTime: "2025-12-14 02:45:00", endTime: "2025-12-14 03:10:00", duration: "25 min", version: "v3.2", logs: ["Created 24 time-based features", "Added lag features (7, 14, 30 days)", "Encoded categorical variables"], errors: [] },
  { id: "PS05", name: "Model Training", status: "completed", startTime: "2025-12-14 03:10:00", endTime: "2025-12-14 04:35:00", duration: "85 min", version: "v3.2", logs: ["Training XGBoost v2.1", "Training Random Forest v3.0", "Training LSTM v1.2", "Training LightGBM v1.5", "Cross-validation: 5 folds"], errors: [] },
  { id: "PS06", name: "Model Evaluation", status: "completed", startTime: "2025-12-14 04:35:00", endTime: "2025-12-14 04:45:00", duration: "10 min", version: "v3.2", logs: ["Best model: XGBoost v2.1 (MAE: 12.4, R²: 0.94)", "All models above threshold"], errors: [] },
  { id: "PS07", name: "Model Registry", status: "completed", startTime: "2025-12-14 04:45:00", endTime: "2025-12-14 04:48:00", duration: "3 min", version: "v3.2", logs: ["Registered XGBoost v2.1 as Production", "Archived ARIMA v1.7"], errors: [] },
  { id: "PS08", name: "Model Deployment", status: "completed", startTime: "2025-12-14 04:48:00", endTime: "2025-12-14 05:00:00", duration: "12 min", version: "v3.2", logs: ["Deployed XGBoost v2.1 to production", "Health check passed", "API endpoint: /api/v2/predict"], errors: [] },
  { id: "PS09", name: "Prediction", status: "completed", startTime: "2025-12-14 05:00:00", endTime: "2025-12-14 05:05:00", duration: "5 min", version: "v3.2", logs: ["Generated 30-day forecast for 22 products", "Average prediction latency: 12ms"], errors: [] },
  { id: "PS10", name: "Monitoring", status: "running", startTime: "2025-12-14 05:05:00", endTime: null, duration: null, version: "v3.2", logs: ["Monitoring active", "Performance metrics collected every 15 min"], errors: [] },
  { id: "PS11", name: "Drift Detection", status: "completed", startTime: "2025-12-14 05:05:00", endTime: "2025-12-14 05:10:00", duration: "5 min", version: "v3.2", logs: ["Data drift score: 0.03 (Normal)", "Model drift score: 0.01 (Normal)"], errors: [] },
  { id: "PS12", name: "Automatic Retraining", status: "pending", startTime: "", endTime: null, duration: null, version: "v3.2", logs: ["Scheduled for 2025-12-21 02:00:00"], errors: [] },
];

// ── Anomalies ───────────────────────────────────────────────
export const anomalies: Anomaly[] = [
  { id: "A001", date: "2025-12-08", productId: "P101", productName: "Wireless Headphones", type: "spike", severity: "high", expected: 120, actual: 340, deviation: "+183%", description: "Unexpected demand spike due to viral social media post" },
  { id: "A002", date: "2025-12-05", productId: "P107", productName: "Yoga Mat Premium", type: "drop", severity: "medium", expected: 55, actual: 18, deviation: "-67%", description: "Sudden demand drop - possible supply chain disruption at retailer" },
  { id: "A003", date: "2025-12-10", productId: "P103", productName: "Bluetooth Speaker", type: "inventory", severity: "critical", expected: 95, actual: 12, deviation: "-87%", description: "Inventory critically low, stockout imminent within 2 days" },
  { id: "A004", date: "2025-12-12", productId: "P115", productName: "Organic Green Tea", type: "data_quality", severity: "low", expected: 320, actual: 0, deviation: "-100%", description: "Missing data point detected in sales feed" },
  { id: "A005", date: "2025-12-11", productId: "P111", productName: "Smart Watch Series 5", type: "spike", severity: "medium", expected: 88, actual: 210, deviation: "+139%", description: "Holiday promotion effect higher than expected" },
  { id: "A006", date: "2025-12-09", productId: "P110", productName: "Denim Jacket Classic", type: "drop", severity: "low", expected: 45, actual: 15, deviation: "-67%", description: "Regional weather pattern reduced demand" },
  { id: "A007", date: "2025-12-13", productId: "P121", productName: "Noise Cancelling Earbuds", type: "spike", severity: "high", expected: 78, actual: 195, deviation: "+150%", description: "Competitor product recall driving demand" },
  { id: "A008", date: "2025-12-14", productId: "P108", productName: "Stainless Water Bottle", type: "data_quality", severity: "medium", expected: 180, actual: 540, deviation: "+200%", description: "Possible duplicate entries in sales data" },
];

// ── Notifications ───────────────────────────────────────────
export const notifications: Notification[] = [
  { id: "N001", type: "warning", title: "Model accuracy decreased", message: "XGBoost v2.1 accuracy dropped from 95.2% to 94.7%", time: "2 hours ago", read: false },
  { id: "N002", type: "error", title: "Data drift detected", message: "Feature 'competitor_price' distribution shift detected", time: "3 hours ago", read: false },
  { id: "N003", type: "success", title: "Pipeline completed", message: "Full MLOps pipeline completed successfully", time: "5 hours ago", read: true },
  { id: "N004", type: "info", title: "New model available", message: "LightGBM v1.5 ready for staging evaluation", time: "6 hours ago", read: true },
  { id: "N005", type: "error", title: "Stockout risk detected", message: "Bluetooth Speaker - 2 days until stockout", time: "8 hours ago", read: false },
  { id: "N006", type: "success", title: "Retraining completed", message: "Prophet v2.0 retrained with updated dataset", time: "1 day ago", read: true },
  { id: "N007", type: "warning", title: "Demand spike detected", message: "Wireless Headphones demand +183% above forecast", time: "1 day ago", read: true },
  { id: "N008", type: "info", title: "Weekly report ready", message: "Weekly demand forecast report is available", time: "2 days ago", read: true },
];

// ── System logs ─────────────────────────────────────────────
export const systemLogs: LogEntry[] = [
  { timestamp: "2025-12-14 05:10:00", event: "DRIFT_CHECK", service: "monitoring", model: "XGBoost", version: "v2.1", status: "success", message: "Drift detection completed. Score: 0.03 (Normal)" },
  { timestamp: "2025-12-14 05:05:00", event: "MONITORING_START", service: "monitoring", model: "XGBoost", version: "v2.1", status: "info", message: "Monitoring started for XGBoost v2.1" },
  { timestamp: "2025-12-14 05:00:00", event: "PREDICTION", service: "prediction-api", model: "XGBoost", version: "v2.1", status: "success", message: "Generated 30-day forecast for 22 products" },
  { timestamp: "2025-12-14 04:48:00", event: "DEPLOYMENT", service: "model-registry", model: "XGBoost", version: "v2.1", status: "success", message: "Model deployed to production endpoint" },
  { timestamp: "2025-12-14 04:45:00", event: "REGISTER", service: "model-registry", model: "XGBoost", version: "v2.1", status: "success", message: "Model registered in production stage" },
  { timestamp: "2025-12-14 04:35:00", event: "EVALUATION", service: "ml-training", model: "All", version: "v3.2", status: "success", message: "Model evaluation completed. Best: XGBoost (R²=0.94)" },
  { timestamp: "2025-12-14 03:10:00", event: "TRAINING", service: "ml-training", model: "XGBoost", version: "v2.1", status: "info", message: "Training started for 4 models" },
  { timestamp: "2025-12-14 03:10:00", event: "FEATURE_ENG", service: "data-pipeline", model: "-", version: "-", status: "success", message: "24 time-based features engineered" },
  { timestamp: "2025-12-14 02:45:00", event: "PREPROCESS", service: "data-pipeline", model: "-", version: "-", status: "success", message: "Data preprocessing complete. 365 values imputed." },
  { timestamp: "2025-12-14 02:22:00", event: "VALIDATION", service: "data-pipeline", model: "-", version: "-", status: "warning", message: "0.2% missing values detected. Imputation applied." },
  { timestamp: "2025-12-14 02:00:00", event: "COLLECTION", service: "data-pipeline", model: "-", version: "-", status: "success", message: "Collected 182,500 records from 22 products" },
  { timestamp: "2025-12-13 18:30:00", event: "ANOMALY", service: "anomaly-detection", model: "XGBoost", version: "v2.1", status: "warning", message: "Demand spike detected: Wireless Headphones +183%" },
  { timestamp: "2025-12-13 14:00:00", event: "RETRAIN", service: "ml-training", model: "Prophet", version: "v2.0", status: "success", message: "Prophet v2.0 retrained. New accuracy: 90.8%" },
  { timestamp: "2025-12-13 10:15:00", event: "DRIFT", service: "monitoring", model: "XGBoost", version: "v2.1", status: "warning", message: "Feature drift detected in competitor_price (score: 0.12)" },
  { timestamp: "2025-12-12 22:00:00", event: "PIPELINE_FAIL", service: "data-pipeline", model: "-", version: "-", status: "error", message: "Weather API timeout. Retry successful." },
];

// ── Monitor metrics (time series) ──────────────────────────
export function getMonitorMetrics(): MonitorMetric[] {
  const metrics: MonitorMetric[] = [];
  for (let d = 30; d >= 0; d--) {
    const date = new Date("2025-12-14");
    date.setDate(date.getDate() - d);
    metrics.push({
      timestamp: date.toISOString().split("T")[0],
      accuracy: 94.7 - d * 0.02 + (Math.random() * 0.4 - 0.2),
      mae: 12.4 + (Math.random() * 1.2 - 0.6),
      rmse: 18.6 + (Math.random() * 1.8 - 0.9),
      latency: 12 + Math.random() * 5,
      requests: 850 + Math.floor(Math.random() * 300),
      errorRate: 0.3 + Math.random() * 0.4,
      cpuUsage: 45 + Math.random() * 20,
      memoryUsage: 62 + Math.random() * 10,
    });
  }
  return metrics;
}

// ── Feature importance ──────────────────────────────────────
export const featureImportance = [
  { feature: "Previous Sales", importance: 38 },
  { feature: "Seasonality", importance: 22 },
  { feature: "Price", importance: 16 },
  { feature: "Promotion", importance: 12 },
  { feature: "Inventory", importance: 7 },
  { feature: "Holiday", importance: 5 },
];

// ── Dataset preview data ────────────────────────────────────
export function getDatasetPreview(): DatasetRecord[] {
  const records: DatasetRecord[] = [];
  const weatherOptions = ["Sunny", "Cloudy", "Rainy", "Snowy", "Windy"];
  for (let d = 0; d < 50; d++) {
    const date = new Date("2025-12-14");
    date.setDate(date.getDate() - d);
    const product = products[d % products.length];
    const units = Math.round(product.avgDemand * (0.8 + Math.random() * 0.4) / 30);
    records.push({
      date: date.toISOString().split("T")[0],
      productId: product.id,
      productName: product.name,
      category: product.category,
      region: product.region,
      price: product.price,
      unitsSold: units,
      revenue: Math.round(units * product.price * 100) / 100,
      inventory: product.currentStock,
      promotion: Math.random() > 0.85,
      holiday: Math.random() > 0.95,
      weather: weatherOptions[Math.floor(Math.random() * weatherOptions.length)],
      competitorPrice: Math.round((product.price * (0.85 + Math.random() * 0.3)) * 100) / 100,
    });
  }
  return records;
}

// ── AI Insights ─────────────────────────────────────────────
export const aiInsights = [
  "Demand for Electronics is expected to increase by 18% over the next 30 days due to holiday season trends.",
  "Product P103 (Bluetooth Speaker) has a high stockout probability within the next 10 days.",
  "Weekend demand is approximately 24% higher than weekday demand across all categories.",
  "North America region contributes 42% of total revenue, with Electronics being the top category.",
  "XGBoost v2.1 outperforms all other models with MAE of 12.4 and R² of 0.94.",
  "Seasonal patterns indicate a demand surge starting from late November through December.",
  "Competitor price changes in Europe show 8% correlation with demand fluctuations.",
  "Products with active promotions show 35% higher demand than non-promoted products.",
  "Data quality score is 96% - minor imputation needed for weather and competitor price features.",
  "Model drift score remains below threshold (0.03) - no retraining triggered.",
];

// ── KPI data ────────────────────────────────────────────────
export const kpiData = {
  totalProducts: 22,
  totalSales: 485672,
  avgDailyDemand: 3847,
  forecastAccuracy: 94.7,
  mae: 12.4,
  rmse: 18.6,
  mape: 5.3,
  activeModel: "XGBoost v2.1",
  modelHealth: "Healthy",
  lastTrainingTime: "2025-12-14 04:35",
  stockoutRisk: 4.2,
  dataQuality: 96,
  pipelineStatus: "Completed",
  driftStatus: "Normal",
  predictedDemand: 18420,
  activeModels: 5,
  productsTracked: 1250,
  forecastHorizon: 30,
};

// ── Reorder/inventory data ──────────────────────────────────
export function getInventoryRecommendations() {
  return products.map((p) => {
    const thirtyDayDemand = p.predictedDemand;
    const safetyStock = Math.round(thirtyDayDemand * 0.2);
    const reorderPoint = thirtyDayDemand + safetyStock;
    const recommendedOrder = Math.max(0, reorderPoint - p.currentStock);
    const stockoutRisk = p.currentStock < safetyStock ? "High" : p.currentStock < reorderPoint * 0.6 ? "Medium" : "Low";
    const overstockRisk = p.currentStock > thirtyDayDemand * 2 ? "High" : p.currentStock > thirtyDayDemand * 1.5 ? "Medium" : "Low";

    return {
      ...p,
      thirtyDayDemand,
      safetyStock,
      reorderPoint,
      recommendedOrder,
      stockoutRisk,
      overstockRisk,
    };
  });
}
