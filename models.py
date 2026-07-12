from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    status = Column(String, default="Active")       # "Active" | "Suspended"
    role = Column(String, default="user")           # "user" | "admin"
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    symptoms = Column(Text, nullable=False)          # JSON string of symptom list
    disease = Column(String, nullable=False)
    confidence = Column(Float, nullable=True)        # 0.0 – 1.0
    recommendations = Column(Text, nullable=False)
    severity_log = Column(Text, nullable=True)       # JSON string of symptom details (severity, duration)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Symptom(Base):
    __tablename__ = "symptoms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)


class Disease(Base):
    __tablename__ = "diseases"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)


class Specialist(Base):
    __tablename__ = "specialists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    specialty = Column(String, nullable=False)
    location = Column(String, nullable=True)
    contact = Column(String, nullable=True)
    rating = Column(Float, nullable=True)
    image_url = Column(String, nullable=True)


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(String, nullable=False)            # YYYY-MM-DD
    temperature = Column(Float, nullable=True)
    blood_pressure = Column(String, nullable=True)   # e.g., "120/80"
    mood = Column(String, nullable=True)             # e.g., "Great", "Normal", "Bad"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
