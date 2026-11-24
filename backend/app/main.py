import os
import uuid
import pandas as pd
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from .models.schemas import (
    CompanyBase, CompanyCreate, WarehouseBase, WarehouseCreate,
    ProductBase, ProductCreate, DatasetItem, DatasetValidationReport,
    ForecastRequest, ForecastResponse, InventoryRecommendation,
    ExperimentRun, RegisteredModel, PipelineRun, MonitoringOverview,
    AlertItem, WhatIfRequest
)
from .services.data_service import data_service
from .services.ml_engine import ml_engine
from .services.inventory_service import inventory_service
from .services.mlops_service import mlops_service

app = FastAPI(
    title="DemandFlow AI — Enterprise MLOps & Demand Forecasting Engine",
    description="REST API service for intelligent supply-chain demand forecasting, inventory optimization, and MLOps lifecycle management.",
    version="2.4.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "DemandFlow AI MLOps Service",
        "version": "2.4.0",
        "environment": "production",
        "timestamp": datetime.now().isoformat(),
        "total_products": len(data_service.products),
        "total_warehouses": len(data_service.warehouses),
        "total_historical_records": len(data_service.sales_df)
    }

# ----------------- Companies -----------------
@app.get("/api/companies", response_model=List[CompanyBase])
def list_companies():
    return list(data_service.companies.values())

@app.post("/api/companies", response_model=CompanyBase)
def create_company(item: CompanyCreate):
    cid = f"comp_{uuid.uuid4().hex[:6]}"
    new_comp = CompanyBase(
        id=cid,
        name=item.name,
        industry=item.industry or "Retail",
        currency=item.currency or "INR",
        status="active"
    )
    data_service.companies[cid] = new_comp
    return new_comp

# ----------------- Warehouses -----------------
@app.get("/api/warehouses", response_model=List[WarehouseBase])
def list_warehouses(company_id: Optional[str] = None):
    items = list(data_service.warehouses.values())
    if company_id and company_id != "all":
        items = [w for w in items if w.company_id == company_id]
    return items

@app.post("/api/warehouses", response_model=WarehouseBase)
def create_warehouse(item: WarehouseCreate):
    wid = f"wh_{item.city.lower().replace(' ', '_')}_{uuid.uuid4().hex[:4]}"
    new_wh = WarehouseBase(
        id=wid,
        company_id=item.company_id,
        name=item.name,
        city=item.city,
        state=item.state,
        country=item.country or "India",
        capacity_sqft=item.capacity_sqft,
        current_utilization_pct=45.0,
        manager=item.manager,
        status="operational"
    )
    data_service.warehouses[wid] = new_wh
    return new_wh

# ----------------- Products -----------------
@app.get("/api/products", response_model=List[ProductBase])
def list_products(
    warehouse_id: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None
):
    items = list(data_service.products.values())
    if warehouse_id and warehouse_id != "all":
        items = [p for p in items if p.warehouse_id == warehouse_id]
    if category and category != "all":
        items = [p for p in items if p.category.lower() == category.lower()]
    if search:
        s = search.lower()
        items = [p for p in items if s in p.name.lower() or s in p.sku.lower() or s in p.brand.lower()]
    return items

@app.post("/api/products", response_model=ProductBase)
def create_product(item: ProductCreate):
    pid = f"prod_{uuid.uuid4().hex[:8]}"
    new_prod = ProductBase(
        id=pid,
        company_id=item.company_id,
        warehouse_id=item.warehouse_id,
        name=item.name,
        category=item.category,
        brand=item.brand,
        sku=item.sku,
        description=item.description,
        unit_price=item.unit_price,
        cost_price=item.cost_price,
        supplier=item.supplier,
        current_inventory=item.current_inventory,
        minimum_stock=item.minimum_stock,
        maximum_stock=item.maximum_stock,
        lead_time_days=item.lead_time_days,
        demand_trend="stable",
        predicted_demand_7d=int(item.current_inventory * 0.25)
    )
    data_service.products[pid] = new_prod
    return new_prod

@app.put("/api/products/{product_id}", response_model=ProductBase)
def update_product(product_id: str, item: ProductCreate):
    if product_id not in data_service.products:
        raise HTTPException(status_code=404, detail="Product not found")
    existing = data_service.products[product_id]
    existing.name = item.name
    existing.category = item.category
    existing.brand = item.brand
    existing.sku = item.sku
    existing.unit_price = item.unit_price
    existing.cost_price = item.cost_price
    existing.supplier = item.supplier
    existing.current_inventory = item.current_inventory
    existing.minimum_stock = item.minimum_stock
    existing.maximum_stock = item.maximum_stock
    existing.lead_time_days = item.lead_time_days
    return existing

@app.delete("/api/products/{product_id}")
def delete_product(product_id: str):
    if product_id in data_service.products:
        del data_service.products[product_id]
        return {"success": True, "message": f"Product {product_id} deleted"}
    raise HTTPException(status_code=404, detail="Product not found")

# ----------------- Datasets -----------------
@app.get("/api/datasets", response_model=List[DatasetItem])
def list_datasets():
    return data_service.datasets

@app.post("/api/datasets/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    company_id: str = Form("comp_abc"),
    warehouse_id: str = Form("all"),
    name: str = Form("Custom Demand Dataset")
):
    try:
        content = await file.read()
        if file.filename.endswith(".csv"):
            import io
            df = pd.read_csv(io.BytesIO(content))
        elif file.filename.endswith((".xls", ".xlsx")):
            import io
            df = pd.read_excel(io.BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="Only CSV and Excel files are supported")

        validation = data_service.validate_dataset(df)
        ds_id = f"ds_{uuid.uuid4().hex[:8]}"

        dataset_entry = DatasetItem(
            id=ds_id,
            name=name,
            filename=file.filename,
            company_id=company_id,
            warehouse_id=warehouse_id,
            source_type="User CSV Upload",
            rows_count=validation.total_rows,
            columns_count=validation.total_columns,
            quality_score=validation.quality_score,
            status="ready" if validation.invalid_rows == 0 else "warning",
            uploaded_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            last_updated=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            validation_report=validation
        )
        data_service.datasets.insert(0, dataset_entry)
        return {"success": True, "dataset": dataset_entry, "validation": validation}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ----------------- Forecasting -----------------
@app.post("/api/forecast", response_model=ForecastResponse)
def generate_forecast(req: ForecastRequest):
    return ml_engine.generate_forecast(
        company_id=req.company_id or "comp_abc",
        warehouse_id=req.warehouse_id or "all",
        product_id=req.product_id,
        category=req.category,
        horizon_days=req.horizon_days,
        model_name=req.model_name or "ensemble"
    )

@app.get("/api/forecast/{forecast_id}")
def get_forecast(forecast_id: str):
    # Generates fresh forecast state
    return ml_engine.generate_forecast("comp_abc", "all", horizon_days=30)

# ----------------- Inventory Optimization -----------------
@app.get("/api/inventory/recommendations", response_model=List[InventoryRecommendation])
def get_inventory_recommendations(
    warehouse_id: Optional[str] = None,
    category: Optional[str] = None
):
    return inventory_service.get_recommendations(warehouse_id=warehouse_id, category=category)

# ----------------- Models & MLflow Registry -----------------
@app.get("/api/models", response_model=List[RegisteredModel])
def list_models():
    return mlops_service.models

@app.post("/api/models/{model_id}/deploy", response_model=RegisteredModel)
def deploy_model(model_id: str):
    try:
        return mlops_service.deploy_model(model_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.post("/api/models/{model_id}/rollback", response_model=RegisteredModel)
def rollback_model(model_id: str):
    try:
        return mlops_service.rollback_model(model_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

# ----------------- Experiments -----------------
@app.get("/api/experiments", response_model=List[ExperimentRun])
def list_experiments():
    return mlops_service.experiments

# ----------------- Pipelines -----------------
@app.get("/api/pipelines", response_model=List[PipelineRun])
def list_pipelines():
    return mlops_service.pipeline_runs

@app.post("/api/pipelines/run", response_model=PipelineRun)
def trigger_pipeline(pipeline_name: Optional[str] = "Nightly-Demand-Retraining-Pipeline"):
    return mlops_service.run_pipeline(pipeline_name=pipeline_name, trigger="manual")

# ----------------- Monitoring & Drift -----------------
@app.get("/api/monitoring", response_model=MonitoringOverview)
def get_monitoring():
    return mlops_service.get_monitoring_overview()

# ----------------- Alerts -----------------
@app.get("/api/alerts", response_model=List[AlertItem])
def list_alerts():
    return mlops_service.alerts

# ----------------- What-If Simulation -----------------
@app.post("/api/whatif")
def simulate_whatif(req: WhatIfRequest):
    prod = data_service.products.get(req.product_id)
    base_demand = prod.predicted_demand_7d if prod else 50

    # Price elasticity calculation: assumed e = -1.2
    price_factor = 1.0 + (-1.2 * (req.price_change_pct / 100.0))
    # Marketing elasticity: assumed +0.4 factor
    marketing_factor = 1.0 + (0.4 * (req.marketing_boost_pct / 100.0))
    holiday_factor = 1.35 if req.holiday_season else 1.0

    simulated_demand_7d = max(0, int(round(base_demand * price_factor * marketing_factor * holiday_factor)))
    delta_units = simulated_demand_7d - base_demand
    pct_change = round(((simulated_demand_7d - base_demand) / (base_demand + 1e-4)) * 100, 1)

    # Financial impact
    new_unit_price = prod.unit_price * (1.0 + (req.price_change_pct / 100.0)) if prod else 100.0
    projected_revenue = round(simulated_demand_7d * new_unit_price, 2)
    base_revenue = round(base_demand * (prod.unit_price if prod else 100.0), 2)
    revenue_delta = round(projected_revenue - base_revenue, 2)

    return {
        "product_id": req.product_id,
        "product_name": prod.name if prod else req.product_id,
        "base_demand_7d": base_demand,
        "simulated_demand_7d": simulated_demand_7d,
        "demand_delta_units": delta_units,
        "demand_pct_change": pct_change,
        "projected_revenue": projected_revenue,
        "revenue_delta": revenue_delta,
        "risk_assessment": "High Stockout Risk" if simulated_demand_7d > (prod.current_inventory if prod else 100) else "Within Safe Inventory Buffer"
    }

# ----------------- Reset / Seed Demo Data -----------------
@app.post("/api/seed-demo-data")
def seed_demo_data():
    data_service._initialize_demo_data()
    return {
        "success": True,
        "message": "Demo data refreshed for ABC Retail Distribution across 4 warehouses (Nagpur, Pune, Mumbai, Nashik) and 15 products with 730 days of daily sales."
    }
