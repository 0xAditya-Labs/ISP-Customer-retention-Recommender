import joblib
import pandas as pd
import numpy as np
import os

# Get absolute paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCALER_PATH = os.path.join(BASE_DIR, 'models', 'churn_scaler.pkl')
COLS_PATH = os.path.join(BASE_DIR, 'models', 'expected_columns.pkl')

scaler = joblib.load(SCALER_PATH)
expected_columns = joblib.load(COLS_PATH)

def clean_and_prepare_data(df_raw: pd.DataFrame):
    """Cleans raw CSV and translates it into the 34 math features the model expects.
    I HAVE ASSUMED THAT INPUT DATA I GOT IS PREPRCESSED AND CLEAN, THEN ALSO I HAVE APPLIED THIS 
    SO I CAN PLAY SAFE"""
    df_fe = df_raw.copy()
    
    # --- 1. DATA CLEANING ---
    df_fe['TotalCharges'] = pd.to_numeric(df_fe['TotalCharges'], errors='coerce').fillna(0.0)
    
    # --- 2. FEATURE ENGINEERING ---
    service_cols = ['PhoneService', 'MultipleLines', 'OnlineSecurity', 'OnlineBackup', 
                    'DeviceProtection', 'TechSupport', 'StreamingTV', 'StreamingMovies']
    
    df_fe['services_count'] = df_fe[service_cols].map(lambda x: 1 if x == 'Yes' else 0).sum(axis=1)
    
    contract_map = {'Month-to-month': 1, 'One year': 2, 'Two year': 3}
    df_fe['contract_score'] = df_fe['Contract'].map(contract_map)
    df_fe['loyalty_index'] = df_fe['contract_score'] * np.log1p(df_fe['tenure'])
    df_fe['is_early_tenure'] = (df_fe['tenure'] <= 3).astype(int)
    
    df_fe['no_support'] = ((df_fe['OnlineSecurity'] != 'Yes') & 
                           (df_fe['TechSupport'] != 'Yes') & 
                           (df_fe['DeviceProtection'] != 'Yes')).astype(int)
                           
    df_fe['is_manual_payment'] = df_fe['PaymentMethod'].isin(['Electronic check', 'Mailed check']).astype(int)
    df_fe['clv_proxy'] = df_fe['MonthlyCharges'] * (df_fe['tenure'] + 1)
    df_fe['is_fiber'] = (df_fe['InternetService'] == 'Fiber optic').astype(int)

    # --- 3. ENCODING ---
    binary_yes_no = ['Partner', 'Dependents', 'PhoneService', 'MultipleLines', 
                     'OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 
                     'TechSupport', 'StreamingTV', 'StreamingMovies', 'PaperlessBilling']
                     
    for col in binary_yes_no:
        if col in df_fe.columns:
            df_fe[col] = df_fe[col].apply(lambda x: 1 if x == 'Yes' else 0)
            
    if 'SeniorCitizen' in df_fe.columns:
        df_fe['SeniorCitizen'] = df_fe['SeniorCitizen'].astype(int)

    multi_cat = ['InternetService', 'Contract', 'PaymentMethod']
    df_encoded = pd.get_dummies(df_fe, columns=multi_cat)

    # --- 4. COLUMN ALIGNMENT (The Dummy Variable Trap Safeguard) ---
    for col in expected_columns:
        if col not in df_encoded.columns:
            df_encoded[col] = 0

    df_final_math = df_encoded[expected_columns]
    
    # --- 5. SCALING ---
    scaled_data = scaler.transform(df_final_math)
    df_scaled = pd.DataFrame(scaled_data, columns=expected_columns)
    
    return df_scaled, df_fe['clv_proxy']


