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
|
├── notebooks/                
│   └── churn_training_pipeline.ipynb
│
└── requirements.txt            # Your pip dependencies

## Local Backend Setup

Use a virtual environment so the backend dependencies stay isolated from your global Python install.

### Windows PowerShell
```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m uvicorn api.main:app --reload
```

### Windows CMD
```bat
cd backend
python -m venv .venv
.venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m uvicorn api.main:app --reload
```

If you only want the server command after installation, you can run:

```bash
python -m uvicorn api.main:app --reload
```