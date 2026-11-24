from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum

# Enums
class ModelStatus(str, Enum):
    PRODUCTION = "production"
    STAGING = "staging"
    DEVELOPMENT = "development"
    ARCHIVED = "archived"

class PipelineStatus(str, Enum):
    IDLE = "idle"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    WARNING = "warning"

class AlertSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AlertCategory(str, Enum):
    INVENTORY_SHORTAGE = "inventory_shortage"
    EXPECTED_STOCKOUT = "expected_stockout"
    EXCESS_INVENTORY = "excess_inventory"
    DATA_DRIFT = "data_drift"
    ACCURACY_DROP = "accuracy_drop"
    PIPELINE_FAILURE = "pipeline_failure"
    SYSTEM = "system"

# Company & Warehouse
class CompanyBase(BaseModel):
    id: str
    name: str
    industry: str = "Retail & Distribution"
    currency: str = "INR"
    status: str = "active"

class CompanyCreate(BaseModel):
    name: str
    industry: Optional[str] = "Retail & Distribution"
    currency: Optional[str] = "INR"

class WarehouseBase(BaseModel):
    id: str
    company_id: str
    name: str
    city: str
    state: str
    country: str = "India"
    capacity_sqft: int
    current_utilization_pct: float
    manager: str
    status: str = "operational"

class WarehouseCreate(BaseModel):
    company_id: str
    name: str
    city: str
    state: str
    country: Optional[str] = "India"
    capacity_sqft: int
    manager: str

# Product
class ProductBase(BaseModel):
    id: str
    company_id: str
    warehouse_id: str
    name: str
    category: str
    brand: str
    sku: str
    description: Optional[str] = ""
    unit_price: float
    cost_price: float
    supplier: str
    current_inventory: int
    minimum_stock: int
    maximum_stock: int
    lead_time_days: int
    demand_trend: Optional[str] = "stable"
    predicted_demand_7d: Optional[int] = 0

class ProductCreate(BaseModel):
    company_id: str
    warehouse_id: str
    name: str
    category: str
    brand: str
    sku: str
    description: Optional[str] = ""
    unit_price: float
    cost_price: float
    supplier: str
    current_inventory: int = 100
    minimum_stock: int = 20
    maximum_stock: int = 500
    lead_time_days: int = 5

# Inventory Optimization
class InventoryRecommendation(BaseModel):
    product_id: str
    product_name: str
    warehouse_id: str
    warehouse_name: str
    current_stock: int
    predicted_demand_7d: int
    predicted_demand_30d: int
    safety_stock: int
    reorder_point: int
    reorder_quantity: int
    days_of_inventory_remaining: float
    expected_shortage: int
    stockout_risk: str # Low, Medium, High, Critical
    suggested_action: str
    lead_time_days: int
    calculation_breakdown: str

# Forecast Request & Response
class ForecastRequest(BaseModel):
    company_id: Optional[str] = "comp_abc"
    warehouse_id: Optional[str] = "wh_nagpur"
    product_id: Optional[str] = None
    category: Optional[str] = None
    horizon_days: int = 30 # 7, 14, 30, 60, 90
    model_name: Optional[str] = "ensemble" # seasonal_naive, random_forest, xgboost, ensemble

class ForecastPoint(BaseModel):
    date: str
    actual: Optional[float] = None
    predicted: float
    lower_bound: float
    upper_bound: float

class ForecastMetrics(BaseModel):
    mae: float
    rmse: float
    wape: float
    mape: float
    r2: float

class ForecastResponse(BaseModel):
    forecast_id: str
    company_id: str
    warehouse_id: str
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    model_used: str
    model_version: str
    horizon_days: int
    generated_at: str
    metrics: ForecastMetrics
    points: List[ForecastPoint]
    historical_points: List[Dict[str, Any]]

# Datasets
class DatasetValidationReport(BaseModel):
    total_rows: int
    total_columns: int
    valid_rows: int
    invalid_rows: int
    missing_values_count: int
    duplicate_rows_count: int
    outliers_detected: int
    columns_detected: List[str]
    missing_columns: List[str]
    quality_score: float # 0 - 100%
    issues: List[str]

class DatasetItem(BaseModel):
    id: str
    name: str
    filename: str
    company_id: str
    warehouse_id: str
    source_type: str # CSV, Excel, REST API, Database
    rows_count: int
    columns_count: int
    quality_score: float
    status: str # ready, processing, error
    uploaded_at: str
    last_updated: str
    validation_report: Optional[DatasetValidationReport] = None

# MLOps & Experiment Tracking
class Hyperparameters(BaseModel):
    n_estimators: Optional[int] = 100
    learning_rate: Optional[float] = 0.05
    max_depth: Optional[int] = 6
    lag_days: Optional[List[int]] = [1, 7, 14, 30]
    rolling_windows: Optional[List[int]] = [7, 14, 30]

class ExperimentRun(BaseModel):
    run_id: str
    experiment_name: str
    model_name: str
    algorithm: str
    dataset_version: str
    hyperparameters: Dict[str, Any]
    metrics: ForecastMetrics
    training_duration_sec: float
    created_at: str
    artifact_uri: str
    status: str # FINISHED, FAILED, RUNNING

class RegisteredModel(BaseModel):
    model_id: str
    name: str
    algorithm: str
    version: str
    stage: ModelStatus
    dataset_version: str
    accuracy_pct: float
    mae: float
    rmse: float
    wape: float
    r2: float
    trained_at: str
    deployed_at: Optional[str] = None
    description: str

# Pipeline
class PipelineStageLog(BaseModel):
    stage_name: str
    status: str
    duration_sec: float
    logs: List[str]
    metrics: Optional[Dict[str, Any]] = None

class PipelineRun(BaseModel):
    run_id: str
    pipeline_name: str
    started_at: str
    completed_at: Optional[str] = None
    status: PipelineStatus
    duration_sec: float
    stages: List[PipelineStageLog]
    triggered_by: str # manual, scheduled, drift_threshold

# Model Monitoring & Drift
class FeatureDriftMetric(BaseModel):
    feature_name: str
    drift_score: float # p-value or distance
    drift_detected: boolean = Field(..., alias="drift_detected")
    baseline_mean: float
    current_mean: float

class MonitoringOverview(BaseModel):
    timestamp: str
    model_id: str
    model_version: str
    prediction_count_24h: int
    avg_latency_ms: float
    error_rate_pct: float
    data_freshness_hours: float
    data_drift_score: float
    drift_detected: bool
    feature_drift_details: List[Dict[str, Any]]
    prediction_drift_detected: bool
    current_mae: float
    baseline_mae: float

# Alerts
class AlertItem(BaseModel):
    id: str
    title: str
    category: AlertCategory
    severity: AlertSeverity
    message: str
    source: str
    timestamp: str
    is_read: bool = False
    action_url: Optional[str] = None

# What-If Request
class WhatIfRequest(BaseModel):
    product_id: str
    price_change_pct: float = 0.0 # e.g. -10 for 10% discount
    marketing_boost_pct: float = 0.0 # e.g. +20 for ad campaign
    holiday_season: bool = False
    supply_delay_days: int = 0
