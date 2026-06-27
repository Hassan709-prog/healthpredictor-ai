from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ────────────────────────── Auth / Users ──────────────────────────

class UserBase(BaseModel):
    email: EmailStr
    name: str
    age: Optional[int] = None
    gender: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    password: Optional[str] = None


class UserAdminUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    status: Optional[str] = None   # "Active" | "Suspended"
    role: Optional[str] = None     # "user" | "admin"


class UserResponse(UserBase):
    id: int
    role: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# ────────────────────────── Predictions ──────────────────────────

class PredictionCreate(BaseModel):
    symptoms: List[str]


class PredictionResponse(BaseModel):
    id: int
    user_id: int
    symptoms: str
    disease: str
    confidence: Optional[float] = None
    recommendations: str
    created_at: datetime

    class Config:
        from_attributes = True


# ────────────────────────── Symptoms ──────────────────────────

class SymptomCreate(BaseModel):
    name: str


class SymptomResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


# ────────────────────────── Diseases ──────────────────────────

class DiseaseCreate(BaseModel):
    name: str
    description: Optional[str] = None


class DiseaseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class DiseaseResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


# ────────────────────────── Admin Stats ──────────────────────────

class AdminStats(BaseModel):
    total_users: int
    active_users: int
    suspended_users: int
    total_predictions: int
    total_symptoms: int
    total_diseases: int
