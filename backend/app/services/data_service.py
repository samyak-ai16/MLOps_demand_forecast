import os
import json
import math
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional, Tuple
from ..models.schemas import (
    CompanyBase, WarehouseBase, ProductBase, DatasetItem, DatasetValidationReport
)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
os.makedirs(DATA_DIR, exist_ok=True)

class DataService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DataService, cls).__new__(cls)
            cls._instance.initialized = False
        return cls._instance

    def __init__(self):
        if self.initialized:
            return
        self.companies: Dict[str, CompanyBase] = {}
        self.warehouses: Dict[str, WarehouseBase] = {}
        self.products: Dict[str, ProductBase] = {}
        self.sales_df: pd.DataFrame = pd.DataFrame()
        self.datasets: List[DatasetItem] = []
        self._initialize_demo_data()
        self.initialized = True

    def _initialize_demo_data(self):
        # 1. Company: ABC Retail Distribution
        company = CompanyBase(
            id="comp_abc",
            name="ABC Retail Distribution",
            industry="Omnichannel Retail & FMCG Supply Chain",
            currency="INR",
            status="active"
        )
        self.companies[company.id] = company

        # 2. Demonstration Warehouses in Maharashtra, India
        wh_data = [
            ("wh_nagpur", "Nagpur Central Logistics Hub", "Nagpur", "Maharashtra", 150000, 78.4, "Rajesh Deshmukh"),
            ("wh_pune", "Pune High-Tech Distribution Center", "Pune", "Maharashtra", 120000, 84.2, "Pooja Kulkarni"),
            ("wh_mumbai", "Mumbai Harbor Fulfillment Port", "Mumbai", "Maharashtra", 200000, 91.0, "Amitabh Verma"),
            ("wh_nashik", "Nashik Agro & Retail Facility", "Nashik", "Maharashtra", 85000, 64.5, "Sunil Shinde"),
        ]
        for wid, wname, city, state, cap, util, mgr in wh_data:
            self.warehouses[wid] = WarehouseBase(
                id=wid,
                company_id=company.id,
                name=wname,
                city=city,
                state=state,
                country="India",
                capacity_sqft=cap,
                current_utilization_pct=util,
                manager=mgr,
                status="operational"
            )

        # 3. Product Catalog
        product_templates = [
            # Electronics
            ("prod_laptop_pro", "UltraBook Pro 15-inch Laptop", "Electronics", "NexTech", "SKU-EL-1001", 64999.0, 52000.0, "Foxconn India", 145, 30, 300, 7),
            ("prod_headphones_nc", "Acoustic ANC Wireless Headphones", "Electronics", "SoundWave", "SKU-EL-1002", 4999.0, 3100.0, "Shenzhen Audio Ltd", 380, 50, 800, 5),
            ("prod_smartwatch", "FitPulse Health Smartwatch V3", "Electronics", "PulseGear", "SKU-EL-1003", 2999.0, 1800.0, "NexTech Corp", 420, 60, 1000, 4),
            ("prod_usb_dock", "10-in-1 USB-C Thunderbolt Hub", "Electronics", "PowerLink", "SKU-EL-1004", 3499.0, 2100.0, "Shenzhen Tech", 210, 40, 500, 5),
            # FMCG & Groceries
            ("prod_organic_tea", "Assam Gold CTC Tea 1kg", "FMCG", "EstateLeaf", "SKU-FM-2001", 450.0, 310.0, "Assam Tea Planters", 850, 150, 2000, 3),
            ("prod_olive_oil", "Extra Virgin Olive Oil 1L", "FMCG", "Mediterranea", "SKU-FM-2002", 899.0, 620.0, "Global Imports", 310, 80, 700, 6),
            ("prod_almonds", "California Jumbo Almonds 500g", "FMCG", "NutriHarvest", "SKU-FM-2003", 550.0, 380.0, "AgroCorp Direct", 620, 100, 1500, 4),
            # Apparel & Footwear
            ("prod_running_shoes", "AirStride Velocity Running Shoes", "Apparel", "StrideFit", "SKU-AP-3001", 3299.0, 1950.0, "Metro Footwear Ltd", 190, 45, 450, 8),
            ("prod_cotton_tee", "Supima Cotton Crewneck Tee Pack", "Apparel", "UrbanBasics", "SKU-AP-3002", 1199.0, 650.0, "Tirupur Textiles", 740, 120, 1800, 4),
            ("prod_denim_jacket", "Classic Vintage Denim Jacket", "Apparel", "UrbanBasics", "SKU-AP-3003", 2799.0, 1600.0, "Tirupur Textiles", 130, 25, 300, 7),
            # Home & Kitchen
            ("prod_air_fryer", "Digital Rapid-Air Fryer 4.5L", "Home & Kitchen", "CookMaster", "SKU-HK-4001", 5499.0, 3600.0, "Bajaj Appliances Ltd", 95, 35, 250, 9),
            ("prod_water_purifier", "RO+UV Mineral Water Purifier", "Home & Kitchen", "PureAqua", "SKU-HK-4002", 12499.0, 8900.0, "AquaTech Industries", 65, 20, 150, 10),
            ("prod_cast_iron", "Pre-seasoned Cast Iron Skillet 28cm", "Home & Kitchen", "CookMaster", "SKU-HK-4003", 1499.0, 920.0, "Coimbatore Castings", 280, 50, 600, 5),
            # Industrial & Storage
            ("prod_storage_tote", "Heavy-Duty Stackable Crates 60L", "Industrial", "DuraPack", "SKU-IN-5001", 850.0, 480.0, "Supreme Plastics Ltd", 490, 100, 1200, 4),
            ("prod_thermal_labels", "Barcode Shipping Labels 4x6 1000ct", "Industrial", "PrintPro", "SKU-IN-5002", 699.0, 410.0, "Papercraft India", 820, 150, 2500, 3),
        ]

        np.random.seed(42)
        wh_keys = list(self.warehouses.keys())

        for p_idx, p in enumerate(product_templates):
            pid, pname, pcat, pbrand, psku, pprice, pcost, psupp, pstock, pmin, pmax, plead = p
            assigned_wh = wh_keys[p_idx % len(wh_keys)]
            self.products[pid] = ProductBase(
                id=pid,
                company_id=company.id,
                warehouse_id=assigned_wh,
                name=pname,
                category=pcat,
                brand=pbrand,
                sku=psku,
                description=f"High-quality commercial grade {pname} supplied through {assigned_wh}.",
                unit_price=pprice,
                cost_price=pcost,
                supplier=psupp,
                current_inventory=pstock,
                minimum_stock=pmin,
                maximum_stock=pmax,
                lead_time_days=plead,
                demand_trend="up" if p_idx % 2 == 0 else "stable",
                predicted_demand_7d=int(pstock * 0.35 + np.random.randint(10, 40))
            )

        # 4. Generate 2+ Years of Realistic Historical Daily Sales Records
        self._generate_historical_sales(company.id)

        # 5. Add initial benchmark dataset to records
        self.datasets.append(DatasetItem(
            id="ds_abc_2024_2026",
            name="ABC Retail Historical Demand 2024-2026",
            filename="abc_historical_daily_sales.csv",
            company_id=company.id,
            warehouse_id="all",
            source_type="Public Benchmark / Demo CSV",
            rows_count=len(self.sales_df),
            columns_count=len(self.sales_df.columns),
            quality_score=98.6,
            status="ready",
            uploaded_at="2026-01-15 09:30:00",
            last_updated="2026-11-20 18:00:00",
            validation_report=DatasetValidationReport(
                total_rows=len(self.sales_df),
                total_columns=len(self.sales_df.columns),
                valid_rows=len(self.sales_df),
                invalid_rows=0,
                missing_values_count=0,
                duplicate_rows_count=0,
                outliers_detected=12,
                columns_detected=list(self.sales_df.columns),
                missing_columns=[],
                quality_score=98.6,
                issues=["12 high-demand promotional outlier points verified as festival sales."]
            )
        ))

    def _generate_historical_sales(self, company_id: str):
        # 730 days (2 full years up to Nov 2026)
        end_date = datetime(2026, 11, 24)
        start_date = end_date - timedelta(days=730)
        date_range = pd.date_range(start=start_date, end=end_date, freq='D')

        records = []
        np.random.seed(42)

        for prod_id, prod in self.products.items():
            base_demand = np.random.uniform(15, 60)
            wh_id = prod.warehouse_id

            for d in date_range:
                # Seasonality components:
                # 1. Day of week (Weekend boost: Saturday & Sunday +30%)
                dow = d.weekday()
                dow_factor = 1.35 if dow in (4, 5, 6) else 0.95

                # 2. Monthly / Festival seasonality (Oct/Nov Diwali spike in India, Dec year-end)
                month = d.month
                month_factor = 1.0
                if month in (10, 11): # Festive season in India
                    month_factor = 1.45
                elif month in (12, 1): # Year end & new year
                    month_factor = 1.25
                elif month in (6, 7): # Mid-year sale
                    month_factor = 1.15

                # 3. Random promotions (8% probability)
                is_promo = np.random.rand() < 0.08
                promo_boost = 1.6 if is_promo else 1.0

                # 4. Holiday effect
                is_holiday = (month == 1 and d.day == 26) or (month == 8 and d.day == 15) or (month == 10 and d.day in (2, 24, 25)) or (month == 11 and d.day in (1, 12, 13))
                holiday_boost = 1.4 if is_holiday else 1.0

                # 5. Stochastic noise
                noise = np.random.normal(0, base_demand * 0.15)
                demand = (base_demand * dow_factor * month_factor * promo_boost * holiday_boost) + noise
                units_sold = max(0, int(round(demand)))

                # Inventory calculation tracking
                inv_level = max(prod.minimum_stock, prod.current_inventory + np.random.randint(-15, 20))

                records.append({
                    "date": d.strftime("%Y-%m-%d"),
                    "company_id": company_id,
                    "warehouse_id": wh_id,
                    "product_id": prod_id,
                    "product_name": prod.name,
                    "category": prod.category,
                    "units_sold": units_sold,
                    "unit_price": prod.unit_price,
                    "discount": 0.15 if is_promo else 0.0,
                    "promotion": is_promo,
                    "inventory_level": inv_level,
                    "supplier_id": prod.supplier,
                    "lead_time": prod.lead_time_days,
                    "holiday": is_holiday,
                    "day_of_week": dow,
                    "revenue": round(units_sold * prod.unit_price * (0.85 if is_promo else 1.0), 2)
                })

        self.sales_df = pd.DataFrame(records)
        # Save snapshot to disk
        csv_path = os.path.join(DATA_DIR, "abc_historical_daily_sales.csv")
        self.sales_df.to_csv(csv_path, index=False)

    def validate_dataset(self, df: pd.DataFrame) -> DatasetValidationReport:
        total_rows = len(df)
        total_cols = len(df.columns)
        required_cols = ["date", "product_id", "units_sold"]
        expected_cols = [
            "date", "company_id", "warehouse_id", "product_id", "product_name",
            "category", "units_sold", "unit_price", "discount", "promotion",
            "inventory_level", "supplier_id", "lead_time", "holiday", "day_of_week"
        ]

        missing_cols = [col for col in required_cols if col not in df.columns]
        detected_cols = list(df.columns)

        missing_val_count = int(df.isnull().sum().sum())
        duplicate_rows = int(df.duplicated().sum())

        issues = []
        invalid_rows = 0

        if missing_cols:
            issues.append(f"Missing mandatory columns: {', '.join(missing_cols)}")
            invalid_rows += total_rows

        if "units_sold" in df.columns:
            neg_sales = (pd.to_numeric(df["units_sold"], errors="coerce") < 0).sum()
            if neg_sales > 0:
                issues.append(f"Detected {neg_sales} negative sales values.")
                invalid_rows += int(neg_sales)

        if "date" in df.columns:
            invalid_dates = pd.to_datetime(df["date"], errors="coerce").isna().sum()
            if invalid_dates > 0:
                issues.append(f"Detected {invalid_dates} invalid date records.")
                invalid_rows += int(invalid_dates)

        # Outlier detection using IQR
        outliers = 0
        if "units_sold" in df.columns:
            numeric_sales = pd.to_numeric(df["units_sold"], errors="coerce").dropna()
            if len(numeric_sales) > 10:
                q25, q75 = numeric_sales.quantile(0.25), numeric_sales.quantile(0.75)
                iqr = q75 - q25
                upper_bound = q75 + (3 * iqr)
                outliers = int((numeric_sales > upper_bound).sum())
                if outliers > 0:
                    issues.append(f"Identified {outliers} statistical demand spike outliers.")

        valid_rows = max(0, total_rows - invalid_rows)
        quality_score = 100.0
        if total_rows > 0:
            quality_score = max(0.0, round(((valid_rows - (missing_val_count * 0.5) - (duplicate_rows * 0.5)) / total_rows) * 100, 1))

        return DatasetValidationReport(
            total_rows=total_rows,
            total_columns=total_cols,
            valid_rows=valid_rows,
            invalid_rows=invalid_rows,
            missing_values_count=missing_val_count,
            duplicate_rows_count=duplicate_rows,
            outliers_detected=outliers,
            columns_detected=detected_cols,
            missing_columns=missing_cols,
            quality_score=quality_score,
            issues=issues
        )

data_service = DataService()
