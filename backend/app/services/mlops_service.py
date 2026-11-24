import time
import uuid
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from ..models.schemas import (
    ExperimentRun, RegisteredModel, ModelStatus, PipelineRun,
    PipelineStageLog, PipelineStatus, MonitoringOverview,
    AlertItem, AlertSeverity, AlertCategory, ForecastMetrics
)
from .data_service import data_service

class MLOpsService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MLOpsService, cls).__new__(cls)
            cls._instance.initialized = False
        return cls._instance

    def __init__(self):
        if self.initialized:
            return
        self.experiments: List[ExperimentRun] = []
        self.models: List[RegisteredModel] = []
        self.pipeline_runs: List[PipelineRun] = []
        self.alerts: List[AlertItem] = []
        self._init_defaults()
        self.initialized = True

    def _init_defaults(self):
        # 1. Registered Models in MLflow Registry
        self.models = [
            RegisteredModel(
                model_id="mod_ens_v2_4",
                name="DemandFlow-Ensemble-Meta",
                algorithm="GradientBoost + Random Forest + Seasonal Naive",
                version="v2.4.0",
                stage=ModelStatus.PRODUCTION,
                dataset_version="ds_abc_2024_2026",
                accuracy_pct=94.7,
                mae=4.12,
                rmse=6.85,
                wape=8.4,
                r2=0.912,
                trained_at="2026-11-20 14:32:00",
                deployed_at="2026-11-20 16:00:00",
                description="Production meta-forecaster with cyclical calendar and 30-day lag features."
            ),
            RegisteredModel(
                model_id="mod_xgb_v2_3",
                name="DemandFlow-XGBoost-Deep",
                algorithm="Extreme Gradient Boosting",
                version="v2.3.1",
                stage=ModelStatus.STAGING,
                dataset_version="ds_abc_2024_2026",
                accuracy_pct=93.2,
                mae=4.89,
                rmse=7.42,
                wape=9.8,
                r2=0.884,
                trained_at="2026-11-18 10:15:00",
                deployed_at=None,
                description="Candidate model tuned for high volatility promotional seasons."
            ),
            RegisteredModel(
                model_id="mod_rf_v2_2",
                name="DemandFlow-RandomForest-Base",
                algorithm="Random Forest Regressor",
                version="v2.2.0",
                stage=ModelStatus.ARCHIVED,
                dataset_version="ds_abc_2024_2025",
                accuracy_pct=89.5,
                mae=6.45,
                rmse=9.30,
                wape=13.2,
                r2=0.812,
                trained_at="2026-09-04 11:20:00",
                deployed_at="2026-09-04 12:00:00",
                description="Previous baseline model prior to multi-warehouse spatial conditioning."
            ),
            RegisteredModel(
                model_id="mod_naive_v1",
                name="DemandFlow-SeasonalNaive-Baseline",
                algorithm="Seasonal Naive (7-Day Cycle)",
                version="v1.0.0",
                stage=ModelStatus.DEVELOPMENT,
                dataset_version="ds_abc_2024_2026",
                accuracy_pct=81.2,
                mae=10.20,
                rmse=14.50,
                wape=19.4,
                r2=0.690,
                trained_at="2026-11-01 08:00:00",
                deployed_at=None,
                description="Heuristic reference baseline for computing relative skill score."
            )
        ]

        # 2. Experiment Tracking Runs
        exp_names = [
            ("DemandFlow-Ensemble-Meta", "Ensemble", {"n_estimators": 100, "learning_rate": 0.08, "lags": [1, 7, 14, 30]}, 4.12, 6.85, 8.4, 0.912, 38.4),
            ("DemandFlow-XGBoost-Deep", "GradientBoosting", {"n_estimators": 120, "learning_rate": 0.05, "max_depth": 6}, 4.89, 7.42, 9.8, 0.884, 29.1),
            ("DemandFlow-RandomForest-Base", "RandomForest", {"n_estimators": 150, "max_depth": 10}, 5.62, 8.10, 11.5, 0.850, 44.2),
            ("DemandFlow-LightGBM-Fast", "LightGBM", {"num_leaves": 31, "learning_rate": 0.1}, 5.04, 7.60, 10.1, 0.875, 12.8),
            ("DemandFlow-Prophet-Additive", "Prophet", {"yearly_seasonality": True, "weekly_seasonality": True}, 6.10, 9.20, 12.8, 0.820, 52.0),
        ]
        for name, algo, params, mae, rmse, wape, r2, dur in exp_names:
            self.experiments.append(ExperimentRun(
                run_id=f"run_{uuid.uuid4().hex[:8]}",
                experiment_name="demand_forecast_mlops_benchmarks",
                model_name=name,
                algorithm=algo,
                dataset_version="ds_abc_2024_2026",
                hyperparameters=params,
                metrics=ForecastMetrics(mae=mae, rmse=rmse, wape=wape, mape=wape*0.9, r2=r2),
                training_duration_sec=dur,
                created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                artifact_uri=f"s3://demandflow-mlops-artifacts/models/{name}/weights.pkl",
                status="FINISHED"
            ))

        # 3. Pipelines Execution History
        self.pipeline_runs.append(PipelineRun(
            run_id="pipe_run_20261120_01",
            pipeline_name="Nightly-Demand-Retraining-Pipeline",
            started_at="2026-11-20 02:00:00",
            completed_at="2026-11-20 02:06:45",
            status=PipelineStatus.COMPLETED,
            duration_sec=405.0,
            triggered_by="scheduled",
            stages=[
                PipelineStageLog(stage_name="1. Data Ingestion", status="completed", duration_sec=14.2, logs=["Connected to source feeds", "Read 14,600 daily records for 4 warehouses"]),
                PipelineStageLog(stage_name="2. Data Validation", status="completed", duration_sec=8.5, logs=["Schema schema validation passed", "Zero non-null violations", "Quality score 98.6%"]),
                PipelineStageLog(stage_name="3. Data Cleaning", status="completed", duration_sec=12.1, logs=["Handled missing promotional flags", "Filtered out invalid test SKUs"]),
                PipelineStageLog(stage_name="4. Feature Engineering", status="completed", duration_sec=45.0, logs=["Generated lag-1, lag-7, lag-14, lag-30", "Cyclical sine/cosine encodings computed"]),
                PipelineStageLog(stage_name="5. Model Training", status="completed", duration_sec=180.4, logs=["Trained Random Forest, GBM, and Ensemble candidates", "Cross-validation 5-fold completed"]),
                PipelineStageLog(stage_name="6. Model Evaluation", status="completed", duration_sec=32.0, logs=["Ensemble achieved WAPE 8.4%, MAE 4.12", "Criteria WAPE < 10% satisfied"]),
                PipelineStageLog(stage_name="7. Model Registration", status="completed", duration_sec=15.8, logs=["Model registered as v2.4.0 in MLflow registry", "Weights saved to artifact storage"]),
                PipelineStageLog(stage_name="8. Model Deployment", status="completed", duration_sec=72.0, logs=["Deployed to production inference pods with rolling zero-downtime update"]),
                PipelineStageLog(stage_name="9. Model Monitoring", status="completed", duration_sec=25.0, logs=["Baseline drift reference updated", "Monitoring metrics streaming live"]),
            ]
        ))

        # 4. System & Business Alerts
        self.alerts = [
            AlertItem(
                id="alt_1",
                title="Critical Stockout Imminent: UltraBook Pro",
                category=AlertCategory.EXPECTED_STOCKOUT,
                severity=AlertSeverity.CRITICAL,
                message="Pune High-Tech Distribution Center has 25 units remaining. Predicted 7-day demand is 85 units. Expected shortage: 60 units.",
                source="Inventory Optimization Engine",
                timestamp="2026-11-24 18:30:00",
                is_read=False,
                action_url="/dashboard/inventory"
            ),
            AlertItem(
                id="alt_2",
                title="Low Stock Warning: RO+UV Mineral Water Purifier",
                category=AlertCategory.INVENTORY_SHORTAGE,
                severity=AlertSeverity.HIGH,
                message="Nagpur Central Logistics Hub inventory is at 65 units (below safety stock ceiling). Reorder point triggered.",
                source="Warehouse Nagpur",
                timestamp="2026-11-24 16:45:00",
                is_read=False,
                action_url="/dashboard/inventory"
            ),
            AlertItem(
                id="alt_3",
                title="Feature Distribution Drift Detected",
                category=AlertCategory.DATA_DRIFT,
                severity=AlertSeverity.MEDIUM,
                message="Feature 'lag_7' distribution shifted p-value=0.038 (threshold 0.05). Caused by post-Diwali sales normalization.",
                source="Evidently Drift Monitor",
                timestamp="2026-11-24 14:10:00",
                is_read=False,
                action_url="/dashboard/monitoring"
            ),
            AlertItem(
                id="alt_4",
                title="Pipeline Execution Successful",
                category=AlertCategory.SYSTEM,
                severity=AlertSeverity.LOW,
                message="Nightly demand retraining pipeline completed all 9 stages in 6m 45s with WAPE 8.4%.",
                source="MLOps Pipeline Coordinator",
                timestamp="2026-11-24 02:06:45",
                is_read=True,
                action_url="/dashboard/pipeline"
            )
        ]

    def run_pipeline(self, pipeline_name: str = "Production-Demand-Retraining-Pipeline", trigger: str = "manual") -> PipelineRun:
        start_time = datetime.now()
        run_id = f"pipe_run_{int(start_time.timestamp())}"

        stages = [
            ("1. Data Ingestion", 2.1, ["Connecting to database and warehouse endpoints...", "Ingested 18,250 records across 4 distribution hubs."]),
            ("2. Data Validation", 1.8, ["Running Great Expectations & schema validator...", "Validated schema: 100% columns aligned, 0 critical anomalies."]),
            ("3. Data Cleaning", 2.4, ["Executing outlier filtering and missing value imputations...", "Cleaned dataset ready with 98.9% quality score."]),
            ("4. Feature Engineering", 4.2, ["Generating time-series lags [1, 7, 14, 30] and rolling windows [7, 14, 30]...", "Encoded cyclical calendar features (sin/cos)."]),
            ("5. Model Training", 6.5, ["Fitting Gradient Boosting and Random Forest regressors...", "Optimized hyper-parameters using 5-fold rolling-origin backtesting."]),
            ("6. Model Evaluation", 2.0, ["Evaluating model against held-out validation window...", "Metrics: MAE=3.98, RMSE=6.42, WAPE=7.92%, R²=0.925."]),
            ("7. Model Registration", 1.5, [f"Registering model version v2.5.0-{run_id[-4:]}...", "Logged artifacts and parameter manifests to MLflow registry."]),
            ("8. Model Deployment", 2.2, ["Promoting to Production stage...", "Canary deployment passed health probes. Inference API updated."]),
            ("9. Model Monitoring", 1.2, ["Resetting baseline drift distributions...", "Real-time accuracy and latency monitoring active."]),
        ]

        stage_logs = []
        total_dur = 0.0
        for name, dur, logs in stages:
            stage_logs.append(PipelineStageLog(
                stage_name=name,
                status="completed",
                duration_sec=dur,
                logs=logs
            ))
            total_dur += dur

        completed_time = start_time + timedelta(seconds=total_dur)
        new_run = PipelineRun(
            run_id=run_id,
            pipeline_name=pipeline_name,
            started_at=start_time.strftime("%Y-%m-%d %H:%M:%S"),
            completed_at=completed_time.strftime("%Y-%m-%d %H:%M:%S"),
            status=PipelineStatus.COMPLETED,
            duration_sec=round(total_dur, 1),
            stages=stage_logs,
            triggered_by=trigger
        )

        self.pipeline_runs.insert(0, new_run)
        return new_run

    def get_monitoring_overview(self) -> MonitoringOverview:
        prod_model = next((m for m in self.models if m.stage == ModelStatus.PRODUCTION), self.models[0])
        return MonitoringOverview(
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            model_id=prod_model.model_id,
            model_version=prod_model.version,
            prediction_count_24h=148520,
            avg_latency_ms=18.4,
            error_rate_pct=0.02,
            data_freshness_hours=0.5,
            data_drift_score=0.042, # Under 0.05 threshold
            drift_detected=False,
            feature_drift_details=[
                {"feature": "lag_1", "p_value": 0.42, "status": "stable", "drift": False},
                {"feature": "lag_7", "p_value": 0.082, "status": "stable", "drift": False},
                {"feature": "rolling_mean_7", "p_value": 0.15, "status": "stable", "drift": False},
                {"feature": "promotion", "p_value": 0.38, "status": "stable", "drift": False},
                {"feature": "dayofweek", "p_value": 0.99, "status": "stable", "drift": False},
            ],
            prediction_drift_detected=False,
            current_mae=prod_model.mae,
            baseline_mae=prod_model.mae * 0.98
        )

    def deploy_model(self, model_id: str) -> RegisteredModel:
        target_model = None
        for m in self.models:
            if m.model_id == model_id:
                m.stage = ModelStatus.PRODUCTION
                m.deployed_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                target_model = m
            elif m.stage == ModelStatus.PRODUCTION:
                m.stage = ModelStatus.ARCHIVED

        if not target_model:
            raise ValueError(f"Model ID {model_id} not found")
        return target_model

    def rollback_model(self, model_id: str) -> RegisteredModel:
        return self.deploy_model(model_id)

mlops_service = MLOpsService()
