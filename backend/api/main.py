from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
from services.ml_engine import process_churn_file

app = FastAPI(title="Telecom Churn API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Connects to React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_EXTENSIONS = ('.csv', '.xlsx', '.xls')

@app.post("/api/predict-churn")
async def predict_churn_endpoint(file: UploadFile = File(...)):
    filename = file.filename.lower()
    if not any(filename.endswith(ext) for ext in ALLOWED_EXTENSIONS):
        raise HTTPException(
            status_code=400,
            detail="Only CSV or Excel (.xlsx, .xls) files are allowed."
        )

    try:
        contents = await file.read()

        if filename.endswith('.csv'):
            df_raw = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        else:
            # .xlsx / .xls — requires openpyxl installed
            df_raw = pd.read_excel(io.BytesIO(contents))

        result = process_churn_file(df_raw)

        return {
            "status": "success",
            "roi_metrics": result["roi_metrics"],
            "action_plan": result["action_plan"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))