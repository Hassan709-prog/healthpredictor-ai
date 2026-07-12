import re
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from database import engine, Base
from routers import auth, predict, admin, specialist, journal

# Create tables if they don't exist yet (works for both SQLite dev and Supabase)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HealthPredictor AI API",
    description="AI-powered symptom analysis and health prediction platform.",
    version="1.0.0",
)

# Allow any localhost/127.0.0.1 origin on any port (covers Vite's dynamic port allocation)
CORS_ORIGIN_REGEX = re.compile(r"https?://(localhost|127\.0\.0\.1)(:\d+)?")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)


# ── Global 500 handler: always inject CORS so browser shows real error ──
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    origin = request.headers.get("origin", "")
    headers = {}
    if CORS_ORIGIN_REGEX.fullmatch(origin):
        headers["Access-Control-Allow-Origin"] = origin
        headers["Access-Control-Allow-Credentials"] = "true"
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"},
        headers=headers,
    )


app.include_router(auth.router,    prefix="/api/auth",    tags=["Auth"])
app.include_router(predict.router, prefix="/api/predict", tags=["Predict"])
app.include_router(admin.router,   prefix="/api/admin",   tags=["Admin"])
app.include_router(specialist.router, prefix="/api/specialist", tags=["Specialist"])
app.include_router(journal.router, prefix="/api/journal", tags=["Journal"])


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "HealthPredictor AI API is running."}
