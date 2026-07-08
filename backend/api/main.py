from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from pydantic import BaseModel
import os
import pandas as pd
import io
from services.ml_engine import process_churn_file

load_dotenv()

app = FastAPI(title="Telecom Churn API")

def _parse_env_list(value, default):
    if not value:
        return default
    return [item.strip() for item in value.split(",") if item.strip()]

frontend_origins = _parse_env_list(
    os.getenv("CORS_ORIGINS"),
    ["http://localhost:5173", "http://127.0.0.1:5173"],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_EXTENSIONS = ('.csv', '.xlsx', '.xls')

# --- 🔒 AUTHENTICATION SETUP (Placeholder for future JWT/Bcrypt) ---
security = HTTPBearer()

HARDCODED_USER = os.getenv("ADMIN_USERNAME", "admin")
HARDCODED_PASS = os.getenv("ADMIN_PASSWORD", "admin123")
DUMMY_TOKEN = os.getenv("DUMMY_TOKEN", "dummy_jwt_token_for_now")

class LoginRequest(BaseModel):
    username: str
    password: str

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Middleware: Cross-checks the token. Later: Verify JWT signature here."""
    if credentials.credentials != DUMMY_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return credentials.credentials

@app.post("/api/login")
def login(request: LoginRequest):
    if request.username == HARDCODED_USER and request.password == HARDCODED_PASS:
        return {"status": "success", "token": DUMMY_TOKEN}
    raise HTTPException(status_code=401, detail="Invalid username or password")
# -------------------------------------------------------------------


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/predict-churn")
async def predict_churn_endpoint(
    file: UploadFile = File(...), 
    token: str = Depends(verify_token) # Protects this endpoint
):
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