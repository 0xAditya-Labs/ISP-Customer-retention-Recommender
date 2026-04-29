import joblib
import pandas as pd
import numpy as np
import shap
import os
from .data_preprocessing import clean_and_prepare_data, expected_columns

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'churn_best_model.pkl')

model = joblib.load(MODEL_PATH)

# SHAP TreeExplainer only works for tree models (Random Forest, XGBoost)
try:
    explainer = shap.TreeExplainer(model)
except Exception:
    explainer = None

def process_churn_file(df_raw: pd.DataFrame):
    # 1. Preprocess the data
    df_scaled, clv_series = clean_and_prepare_data(df_raw)
    
    # 2. Predict Probabilities
    probs = model.predict_proba(df_scaled)[:, 1]
    
    # Update raw dataframe with our findings
    df_raw['Churn_Probability'] = probs
    df_raw['clv_proxy'] = clv_series
    df_raw['Priority_Score'] = df_raw['Churn_Probability'] * df_raw['clv_proxy']
    
    # 3. Filter Top 20%
    df_sorted = df_raw.sort_values(by='Priority_Score', ascending=False)
    top_20_cutoff = max(1, int(len(df_sorted) * 0.20))
    df_top_20 = df_sorted.iloc[:top_20_cutoff].copy()
    
    # 4. SHAP Analysis (or Fallback for KNN)
    top_20_scaled = df_scaled.iloc[df_top_20.index]
    
    if explainer:
        shap_values = explainer.shap_values(top_20_scaled)
        if isinstance(shap_values, list):
            shap_values = shap_values[1] 
        top_drivers = [expected_columns[np.argmax(row)] for row in shap_values]
    else:
        # Fallback for non-tree models (like KNN): pick the feature with the highest scaled value
        top_drivers = [expected_columns[np.argmax(row)] for row in top_20_scaled.values]
        
    df_top_20['Top_Churn_Driver'] = top_drivers
    
    # 5. Rule-Based Engine
    median_clv = df_top_20['clv_proxy'].median()
    actions = []
    
    for _, row in df_top_20.iterrows():
        driver = row['Top_Churn_Driver']
        is_vip = row['clv_proxy'] > median_clv 
        
        if driver == 'MonthlyCharges':
            actions.append("Offer 20% VIP Price Match" if is_vip else "Offer 10% Standard Discount")
        elif 'Contract' in driver:
            actions.append("Free Router for 1-Yr Lock" if is_vip else "Waive fee for 1-Yr Lock")
        elif driver == 'no_support' or 'TechSupport' in driver:
            actions.append("VIP Tech Dispatch" if is_vip else "Free Remote Checkup")
        else:
            actions.append("Standard Loyalty Check-in")
            
    df_top_20['Suggested_Action'] = actions
    
    # 6. ROI Math
    users_called = len(df_top_20)
    users_saved = int(users_called * 0.25)
    revenue_saved = users_saved * median_clv
    campaign_cost = users_called * 200
    net_roi = revenue_saved - campaign_cost
    
    # 7. Return clean JSON dictionary
    # Detect phone column (case-insensitive) and normalise its name
    phone_col = next(
        (c for c in df_top_20.columns if c.strip().lower() in ('phone', 'phone number', 'phonenumber')),
        None
    )
    if phone_col:
        df_top_20 = df_top_20.rename(columns={phone_col: 'phone'})

    base_cols = ['customerID', 'clv_proxy', 'Churn_Probability', 'Top_Churn_Driver', 'Suggested_Action']
    export_cols = (['customerID', 'phone'] + [c for c in base_cols if c != 'customerID']
                   if phone_col else base_cols)

    table_data = df_top_20[export_cols].to_dict(orient='records')

    return {
        "roi_metrics": {
            "users_called": users_called,
            "users_saved": users_saved,
            "campaign_cost": campaign_cost,
            "revenue_saved": revenue_saved,
            "net_roi": net_roi
        },
        "action_plan": table_data
    }