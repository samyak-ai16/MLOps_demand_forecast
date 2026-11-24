import math
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from ..models.schemas import InventoryRecommendation
from .data_service import data_service

class InventoryService:
    def get_recommendations(
        self,
        warehouse_id: Optional[str] = None,
        category: Optional[str] = None,
        service_level_z: float = 1.645 # 95% cycle service level
    ) -> List[InventoryRecommendation]:
        recommendations = []
        sales_df = data_service.sales_df

        for pid, prod in data_service.products.items():
            if warehouse_id and warehouse_id != "all" and prod.warehouse_id != warehouse_id:
                continue
            if category and category != "all" and prod.category != category:
                continue

            wh = data_service.warehouses.get(prod.warehouse_id)
            wh_name = wh.name if wh else prod.warehouse_id

            # Calculate historical daily demand metrics for product in warehouse
            prod_sales = sales_df[(sales_df["product_id"] == pid) & (sales_df["warehouse_id"] == prod.warehouse_id)]
            if len(prod_sales) > 30:
                recent_sales = prod_sales.tail(60)["units_sold"]
                avg_daily_demand = max(1.0, float(recent_sales.mean()))
                std_daily_demand = max(0.5, float(recent_sales.std()))
            else:
                avg_daily_demand = max(1.0, float(prod.current_inventory * 0.05))
                std_daily_demand = max(0.5, avg_daily_demand * 0.3)

            lead_time = max(1, prod.lead_time_days)

            # Safety Stock: SS = Z * sqrt(LeadTime) * StdDailyDemand
            safety_stock = int(math.ceil(service_level_z * math.sqrt(lead_time) * std_daily_demand))

            # Reorder Point: ROP = (Average Daily Demand * Lead Time) + Safety Stock
            demand_during_lead_time = avg_daily_demand * lead_time
            reorder_point = int(math.ceil(demand_during_lead_time + safety_stock))

            # Predicted demand over 7 and 30 days
            pred_demand_7d = int(round(avg_daily_demand * 7 * (1.1 if prod.demand_trend == "up" else 1.0)))
            pred_demand_30d = int(round(avg_daily_demand * 30 * (1.1 if prod.demand_trend == "up" else 1.0)))

            # Economic Reorder Quantity / Batch Size
            # EOQ formula with estimated ordering cost S=500 and holding cost H=0.20*UnitCost
            holding_cost = max(10.0, prod.cost_price * 0.15)
            annual_demand = avg_daily_demand * 365
            eoq = math.sqrt((2 * annual_demand * 800) / holding_cost)
            reorder_qty = max(prod.minimum_stock, int(round(max(eoq, demand_during_lead_time * 1.5))))

            # Days of Inventory Remaining
            days_remaining = round(prod.current_inventory / (avg_daily_demand + 1e-4), 1)

            # Expected Shortage & Risk
            current_stock = prod.current_inventory
            expected_shortage = max(0, int(round(demand_during_lead_time - current_stock)))

            if current_stock <= prod.minimum_stock or current_stock < demand_during_lead_time:
                stockout_risk = "Critical"
                suggested_action = f"URGENT REORDER: Place purchase order for {reorder_qty} units immediately to prevent stockout in {max(1, int(days_remaining))} days."
            elif current_stock <= reorder_point:
                stockout_risk = "High"
                suggested_action = f"REORDER TRIGGERED: Inventory below ROP ({reorder_point} units). Order {reorder_qty} units from {prod.supplier}."
            elif current_stock > prod.maximum_stock or days_remaining > 45:
                stockout_risk = "Overstock"
                suggested_action = f"OVERSTOCK ALERT: Inventory exceeds optimum ceiling ({current_stock} > {prod.maximum_stock}). Recommend targeted promotion or warehouse transfer."
            else:
                stockout_risk = "Low"
                suggested_action = f"OPTIMAL: Stock level is healthy with {days_remaining} days coverage. Next reorder expected around ROP ({reorder_point} units)."

            breakdown = (
                f"Warehouse: {wh.city if wh else 'Hub'} | Product: {prod.name} | "
                f"Current stock: {current_stock} units | Lead time: {lead_time} days | "
                f"Avg daily demand: {avg_daily_demand:.1f} | Safety stock: {safety_stock} units | "
                f"Reorder point (ROP): {reorder_point} units | "
                f"Predicted 7d demand: {pred_demand_7d} units | "
                f"Expected shortage during lead time: {expected_shortage} units | "
                f"Suggested reorder batch: {reorder_qty} units"
            )

            recommendations.append(InventoryRecommendation(
                product_id=pid,
                product_name=prod.name,
                warehouse_id=prod.warehouse_id,
                warehouse_name=wh_name,
                current_stock=current_stock,
                predicted_demand_7d=pred_demand_7d,
                predicted_demand_30d=pred_demand_30d,
                safety_stock=safety_stock,
                reorder_point=reorder_point,
                reorder_quantity=reorder_qty,
                days_of_inventory_remaining=days_remaining,
                expected_shortage=expected_shortage,
                stockout_risk=stockout_risk,
                suggested_action=suggested_action,
                lead_time_days=lead_time,
                calculation_breakdown=breakdown
            ))

        return recommendations

inventory_service = InventoryService()
