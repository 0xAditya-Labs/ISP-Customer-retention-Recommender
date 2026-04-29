<Code_base ie telecom-churn-api>/
│
├── api/
│   ├── __init__.py             # (Empty file)
│   └── main.py                 # The FastAPI router (Receives CSV, returns JSON)
│
├── services/
│   ├── __init__.py             # (Empty file)
│   ├── data_preprocessing.py   # Handles cleaning, feature engineering, and scaling
│   └── ml_engine.py            # Handles model prediction, SHAP, and business logic
│
├── models/                     
│   ├── churn_best_model.pkl    # Dropped from Colab
│   ├── churn_scaler.pkl        # Dropped from Colab
│   └── expected_columns.pkl    # Dropped from Colab
│
└── requirements.txt            # Your pip dependencies