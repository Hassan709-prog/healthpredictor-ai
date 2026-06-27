import json
import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
import database
from auth_utils import get_current_user

router = APIRouter()


# ─────────────────────── Mock AI Engine ───────────────────────

DISEASE_MAP = {
    frozenset(["fever", "cough", "sore throat", "runny nose"]): {
        "disease": "Common Cold",
        "confidence": 0.87,
        "recommendations": (
            "Rest well and stay hydrated. Take over-the-counter antihistamines or decongestants "
            "as needed. Gargle with warm salt water for sore throat relief. If symptoms persist "
            "beyond 10 days, consult a doctor."
        ),
    },
    frozenset(["fever", "cough", "shortness of breath", "fatigue"]): {
        "disease": "Influenza (Flu)",
        "confidence": 0.82,
        "recommendations": (
            "Rest at home and avoid contact with others. Stay hydrated. Antiviral medications "
            "(e.g., oseltamivir) may be prescribed within the first 48 hours. Seek immediate "
            "medical attention if breathing worsens."
        ),
    },
    frozenset(["chest pain", "shortness of breath", "sweating", "nausea"]): {
        "disease": "Possible Cardiac Event",
        "confidence": 0.74,
        "recommendations": (
            "SEEK EMERGENCY MEDICAL CARE IMMEDIATELY. Call emergency services (e.g., 911). "
            "Chew an aspirin (325 mg) if not allergic. Do not drive yourself to the hospital."
        ),
    },
    frozenset(["headache", "fever", "stiff neck", "sensitivity to light"]): {
        "disease": "Meningitis (suspected)",
        "confidence": 0.79,
        "recommendations": (
            "SEEK EMERGENCY MEDICAL CARE IMMEDIATELY. Meningitis is a medical emergency. "
            "Antibiotics must be started as soon as possible."
        ),
    },
    frozenset(["abdominal pain", "nausea", "vomiting", "diarrhea"]): {
        "disease": "Gastroenteritis",
        "confidence": 0.85,
        "recommendations": (
            "Stay hydrated with water and electrolyte solutions. Follow a bland diet (BRAT: "
            "bananas, rice, applesauce, toast). Avoid dairy and fatty foods. Consult a doctor "
            "if symptoms last more than 3 days or if there is blood in stool."
        ),
    },
    frozenset(["fatigue", "increased thirst", "frequent urination", "blurred vision"]): {
        "disease": "Possible Diabetes (Type 2)",
        "confidence": 0.71,
        "recommendations": (
            "Consult a doctor for blood glucose testing. Adopt a low-sugar diet and increase "
            "physical activity. Monitor blood sugar levels regularly if already diagnosed."
        ),
    },
    frozenset(["rash", "fever", "joint pain", "red eyes"]): {
        "disease": "Dengue Fever (suspected)",
        "confidence": 0.76,
        "recommendations": (
            "Seek medical attention promptly. Rest and drink plenty of fluids. Take paracetamol "
            "for fever — AVOID ibuprofen or aspirin. Monitor platelet count as directed by a doctor."
        ),
    },
}

_DEFAULT_RESULT = {
    "disease": "Unspecified Condition",
    "confidence": 0.50,
    "recommendations": (
        "Your symptoms do not match a specific condition in our database. Please consult a "
        "qualified healthcare professional for an accurate diagnosis."
    ),
}


def ai_predict(symptoms: List[str]) -> dict:
    """
    Simple rule-based mock AI predictor.
    Finds the disease whose symptom set has the highest overlap with the input.
    """
    symptom_set = frozenset(s.lower().strip() for s in symptoms)
    best_match = None
    best_overlap = 0

    for key, result in DISEASE_MAP.items():
        overlap = len(symptom_set & key)
        if overlap > best_overlap:
            best_overlap = overlap
            best_match = result

    if best_match and best_overlap >= 2:
        # Add slight random noise to confidence to simulate a model
        noise = random.uniform(-0.05, 0.05)
        return {**best_match, "confidence": round(min(0.99, max(0.50, best_match["confidence"] + noise)), 2)}

    return _DEFAULT_RESULT


# ─────────────────────── Endpoints ───────────────────────

@router.post("/", response_model=schemas.PredictionResponse, status_code=status.HTTP_201_CREATED)
def create_prediction(
    pred_in: schemas.PredictionCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Run AI prediction on supplied symptoms and save the result."""
    if not pred_in.symptoms:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="At least one symptom is required.",
        )

    result = ai_predict(pred_in.symptoms)

    prediction = models.Prediction(
        user_id=current_user.id,
        symptoms=json.dumps(pred_in.symptoms),
        disease=result["disease"],
        confidence=result["confidence"],
        recommendations=result["recommendations"],
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)
    return prediction


@router.get("/history", response_model=List[schemas.PredictionResponse])
def get_history(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 50,
):
    """Return the prediction history for the currently authenticated user."""
    predictions = (
        db.query(models.Prediction)
        .filter(models.Prediction.user_id == current_user.id)
        .order_by(models.Prediction.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return predictions


@router.get("/history/{prediction_id}", response_model=schemas.PredictionResponse)
def get_single_prediction(
    prediction_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Fetch a single prediction by ID (must belong to the current user)."""
    prediction = (
        db.query(models.Prediction)
        .filter(
            models.Prediction.id == prediction_id,
            models.Prediction.user_id == current_user.id,
        )
        .first()
    )
    if not prediction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prediction not found.")
    return prediction


@router.delete("/history/{prediction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prediction(
    prediction_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Delete a specific prediction from the user's history."""
    prediction = (
        db.query(models.Prediction)
        .filter(
            models.Prediction.id == prediction_id,
            models.Prediction.user_id == current_user.id,
        )
        .first()
    )
    if not prediction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prediction not found.")
    db.delete(prediction)
    db.commit()


@router.get("/symptoms", response_model=List[schemas.SymptomResponse])
def list_symptoms(db: Session = Depends(database.get_db)):
    """Return all known symptoms (public — no auth required)."""
    return db.query(models.Symptom).order_by(models.Symptom.name).all()
