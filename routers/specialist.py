from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
import database

router = APIRouter()

DISEASE_TO_SPECIALTY = {
    "Acne": "Dermatologist",
    "Fungal infection": "Dermatologist",
    "Psoriasis": "Dermatologist",
    "Impetigo": "Dermatologist",
    "Heart attack": "Cardiologist",
    "Hypertension ": "Cardiologist",
    "Bronchial Asthma": "Pulmonologist",
    "Pneumonia": "Pulmonologist",
    "Tuberculosis": "Pulmonologist",
    "GERD": "Gastroenterologist",
    "Gastroenteritis": "Gastroenterologist",
    "Jaundice": "Gastroenterologist",
    "Peptic ulcer diseae": "Gastroenterologist",
    "Typhoid": "Gastroenterologist",
    "hepatitis A": "Gastroenterologist",
    "Hepatitis B": "Gastroenterologist",
    "Hepatitis C": "Gastroenterologist",
    "Hepatitis D": "Gastroenterologist",
    "Hepatitis E": "Gastroenterologist",
    "Alcoholic hepatitis": "Gastroenterologist",
    "Chronic cholestasis": "Gastroenterologist",
    "Arthritis": "Rheumatologist",
    "Cervical spondylosis": "Rheumatologist",
    "Osteoarthristis": "Rheumatologist",
    "Diabetes ": "Endocrinologist",
    "Hyperthyroidism": "Endocrinologist",
    "Hypoglycemia": "Endocrinologist",
    "Hypothyroidism": "Endocrinologist",
    "Migraine": "Neurologist",
    "Paralysis (brain hemorrhage)": "Neurologist",
    "Allergy": "General Physician",
    "Common Cold": "General Physician",
    "Chicken pox": "General Physician",
    "Dengue": "General Physician",
    "Malaria": "General Physician",
    "Drug Reaction": "General Physician",
    "Dimorphic hemmorhoids(piles)": "General Surgeon",
    "Varicose veins": "General Surgeon",
    "Urinary tract infection": "Urologist",
    "(vertigo) Paroymsal  Positional Vertigo": "ENT Specialist",
    "AIDS": "Infectious Disease Specialist"
}

@router.get("/", response_model=List[schemas.SpecialistResponse])
def get_specialists(disease: str, db: Session = Depends(database.get_db)):
    """Fetch recommended specialists based on a disease name."""
    specialty = DISEASE_TO_SPECIALTY.get(disease)
    
    if not specialty:
        # Fallback to General Physician if unknown
        specialty = "General Physician"

    specialists = db.query(models.Specialist).filter(models.Specialist.specialty == specialty).all()
    
    # If no specialists found for the exact specialty, fallback to general physician
    if not specialists and specialty != "General Physician":
        specialists = db.query(models.Specialist).filter(models.Specialist.specialty == "General Physician").all()
        
    return specialists
