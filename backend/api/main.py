from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
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

# --- 🔒 AUTHENTICATION SETUP (Placeholder for future JWT/Bcrypt) ---
security = HTTPBearer()

class LoginRequest(BaseModel):
    username: str
    password: str

# HARDCODED credentials for now. Later: Check DB & use bcrypt
HARDCODED_USER = "admin"
HARDCODED_PASS = "admin123"
DUMMY_TOKEN = "dummy_jwt_token_for_now"

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