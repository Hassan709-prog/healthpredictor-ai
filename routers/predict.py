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


import os
import numpy as np
import joblib

# Determine absolute path to the HealthPredictor files
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "HealthPredictor")

# Load model and encoders once at module level to avoid reloading on each request
try:
    _model = joblib.load(os.path.join(MODEL_DIR, "xgboost_model.pkl"))
    _label_encoder = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))
    _feature_columns = joblib.load(os.path.join(MODEL_DIR, "feature_columns.pkl"))
except Exception as e:
    print(f"Warning: Could not load ML models. Error: {e}")
    _model, _label_encoder, _feature_columns = None, None, []

def ai_predict(symptoms: List[str]) -> dict:
    """
    Real ML-based predictor using XGBoost.
    """
    if _model is None or _label_encoder is None or not _feature_columns:
        return {
            "disease": "System Error: Model Not Loaded",
            "confidence": 0.0,
            "recommendations": "The AI model is currently unavailable."
        }

    recommendations_map = {
        "Fungal infection": "Keep the affected area clean and dry. Apply over-the-counter antifungal creams. Avoid sharing personal items like towels.",
        "Allergy": "Identify and avoid allergens. Consider over-the-counter antihistamines. Keep windows closed during high pollen seasons.",
        "GERD": "Eat smaller, more frequent meals. Avoid spicy and acidic foods. Do not lie down immediately after eating.",
        "Chronic cholestasis": "Maintain a balanced diet low in fat. Stay hydrated. Consult a hepatologist for further evaluation.",
        "Drug Reaction": "Stop taking the suspected medication immediately. Seek emergency medical care if experiencing difficulty breathing.",
        "Peptic ulcer diseae": "Avoid NSAIDs, alcohol, and spicy foods. Eat smaller meals. Consult a gastroenterologist.",
        "AIDS": "Adhere strictly to antiretroviral therapy (ART). Maintain a healthy lifestyle to support the immune system.",
        "Diabetes ": "Monitor blood sugar levels regularly. Maintain a balanced diet and exercise routine. Consult an endocrinologist.",
        "Gastroenteritis": "Stay hydrated with clear fluids. Rest and eat bland foods when tolerated. Seek medical help if unable to keep fluids down.",
        "Bronchial Asthma": "Use prescribed inhalers as directed. Avoid asthma triggers like smoke or pollen. Have an asthma action plan.",
        "Hypertension ": "Reduce sodium intake. Exercise regularly. Monitor blood pressure and take prescribed medications.",
        "Migraine": "Rest in a quiet, dark room during an attack. Identify and avoid migraine triggers. Stay hydrated.",
        "Cervical spondylosis": "Perform neck stretching exercises. Maintain good posture. Use a supportive pillow while sleeping.",
        "Paralysis (brain hemorrhage)": "Seek immediate emergency medical attention. Rehabilitation and physical therapy will be required.",
        "Jaundice": "Stay hydrated and rest. Avoid alcohol and fatty foods. Consult a doctor to determine the underlying cause.",
        "Malaria": "Seek immediate medical treatment for antimalarial medication. Rest and stay hydrated.",
        "Chicken pox": "Rest and avoid scratching blisters. Use calamine lotion for itching. Stay isolated to prevent spreading.",
        "Dengue": "Stay hydrated. Rest and take acetaminophen for fever (avoid aspirin or ibuprofen). Seek emergency care if severe.",
        "Typhoid": "Complete the full course of prescribed antibiotics. Practice good hygiene and drink safe water.",
        "hepatitis A": "Rest and stay hydrated. Avoid alcohol and fatty foods. Practice good hand hygiene.",
        "Hepatitis B": "Avoid alcohol. Follow up regularly with a hepatologist. Practice safe sex.",
        "Hepatitis C": "Consult a hepatologist for antiviral treatment. Avoid alcohol to protect the liver.",
        "Hepatitis D": "Requires management by a specialist as it occurs with Hepatitis B. Avoid alcohol.",
        "Hepatitis E": "Rest and stay hydrated. Avoid alcohol. Usually resolves on its own but requires medical monitoring.",
        "Alcoholic hepatitis": "Stop drinking alcohol immediately. Eat a nutritious diet. Seek medical help for withdrawal symptoms.",
        "Tuberculosis": "Strictly complete the long-term antibiotic regimen. Cover your mouth when coughing. Ensure good ventilation.",
        "Common Cold": "Rest and drink plenty of fluids. Use over-the-counter cold remedies for symptoms. Wash hands frequently.",
        "Pneumonia": "Take prescribed antibiotics if bacterial. Get plenty of rest and drink fluids. Seek emergency care if breathing is difficult.",
        "Dimorphic hemmorhoids(piles)": "Eat a high-fiber diet. Drink plenty of water. Use over-the-counter topical treatments.",
        "Heart attack": "Call emergency services immediately. Chew aspirin if available and not allergic. Stay as calm as possible.",
        "Varicose veins": "Elevate your legs when resting. Wear compression stockings. Avoid prolonged standing or sitting.",
        "Hypothyroidism": "Take prescribed thyroid hormone replacement daily. Monitor symptoms and get regular blood tests.",
        "Hyperthyroidism": "Follow treatment plan (medication or radioactive iodine). Avoid excess caffeine. Monitor heart rate.",
        "Hypoglycemia": "Consume fast-acting carbohydrates (like juice or candy) immediately. Monitor blood sugar levels closely.",
        "Osteoarthristis": "Engage in low-impact exercises. Maintain a healthy weight. Use pain relievers as recommended.",
        "Arthritis": "Stay active with gentle exercises. Apply heat or cold packs to joints. Consult a rheumatologist.",
        "(vertigo) Paroymsal  Positional Vertigo": "Perform Epley maneuver as guided by a doctor. Avoid sudden head movements. Sit down when dizzy.",
        "Acne": "Wash face twice daily with a gentle cleanser. Avoid picking at pimples. Use non-comedogenic products.",
        "Urinary tract infection": "Drink plenty of water to flush bacteria. Complete the prescribed antibiotic course. Avoid holding urine.",
        "Psoriasis": "Keep skin moisturized. Use prescribed topical treatments. Identify and avoid triggers like stress.",
        "Impetigo": "Keep the sores clean and covered. Apply prescribed antibiotic ointment. Wash hands frequently to prevent spread."
    }

    # Clean the internal feature columns to remove leading spaces (e.g. ' sweating' -> 'sweating')
    cleaned_features = [f.strip() for f in _feature_columns]

    # Normalize incoming symptoms (e.g. "Skin Rash" -> "skin_rash")
    input_symptoms = [s.strip().lower().replace(" ", "_") for s in symptoms]
    
    # Create feature vector
    input_data = np.zeros(len(_feature_columns))
    
    for symptom in input_symptoms:
        if symptom in cleaned_features:
            index = cleaned_features.index(symptom)
            input_data[index] = 1
            
    input_data = input_data.reshape(1, -1)
    
    # Predict
    prediction = _model.predict(input_data)
    disease = _label_encoder.inverse_transform(prediction)[0]
    
    # Confidence Score
    probabilities = _model.predict_proba(input_data)
    confidence = round(float(np.max(probabilities)), 2)
    
    # Find specific recommendation or use fallback
    recs = recommendations_map.get(disease)
    if not recs:
        for k, v in recommendations_map.items():
            if k.lower() == disease.lower():
                recs = v
                break
    
    if not recs:
        recs = f"Monitor your symptoms closely. Given the prediction of {disease}, it is highly recommended to consult a specialist for a confirmed diagnosis and personalized treatment plan."
    
    return {
        "disease": disease,
        "confidence": confidence,
        "recommendations": recs
    }


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
        severity_log=json.dumps([s.dict() for s in pred_in.symptom_details]) if pred_in.symptom_details else None
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
