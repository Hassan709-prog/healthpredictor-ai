from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
import database
from auth_utils import get_current_user, require_admin, get_password_hash

router = APIRouter()


# ═══════════════════════════════════════════════════════
#  STATISTICS
# ═══════════════════════════════════════════════════════

@router.get("/stats", response_model=schemas.AdminStats)
def get_stats(
    db: Session = Depends(database.get_db),
    _admin: models.User = Depends(require_admin),
):
    """Dashboard statistics: user counts, prediction counts, etc."""
    total_users = db.query(models.User).count()
    active_users = db.query(models.User).filter(models.User.status == "Active").count()
    suspended_users = db.query(models.User).filter(models.User.status == "Suspended").count()
    total_predictions = db.query(models.Prediction).count()
    total_symptoms = db.query(models.Symptom).count()
    total_diseases = db.query(models.Disease).count()

    return schemas.AdminStats(
        total_users=total_users,
        active_users=active_users,
        suspended_users=suspended_users,
        total_predictions=total_predictions,
        total_symptoms=total_symptoms,
        total_diseases=total_diseases,
    )


# ═══════════════════════════════════════════════════════
#  USERS
# ═══════════════════════════════════════════════════════

@router.get("/users", response_model=List[schemas.UserResponse])
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
    _admin: models.User = Depends(require_admin),
):
    """List all registered users (paginated)."""
    return db.query(models.User).order_by(models.User.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(database.get_db),
    _admin: models.User = Depends(require_admin),
):
    """Get a single user by ID."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    return user


@router.put("/users/{user_id}", response_model=schemas.UserResponse)
def update_user(
    user_id: int,
    updates: schemas.UserAdminUpdate,
    db: Session = Depends(database.get_db),
    _admin: models.User = Depends(require_admin),
):
    """Admin: update a user's role, status, or profile fields."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    if updates.name is not None:
        user.name = updates.name
    if updates.age is not None:
        user.age = updates.age
    if updates.gender is not None:
        user.gender = updates.gender
    if updates.status is not None:
        if updates.status not in ("Active", "Suspended"):
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Status must be 'Active' or 'Suspended'.")
        user.status = updates.status
    if updates.role is not None:
        if updates.role not in ("user", "admin"):
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Role must be 'user' or 'admin'.")
        user.role = updates.role

    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(database.get_db),
    admin: models.User = Depends(require_admin),
):
    """Admin: permanently delete a user and their predictions."""
    if user_id == admin.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot delete your own account via this endpoint.")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    # Cascade delete their predictions
    db.query(models.Prediction).filter(models.Prediction.user_id == user_id).delete()
    db.delete(user)
    db.commit()


# ═══════════════════════════════════════════════════════
#  PREDICTIONS (admin view)
# ═══════════════════════════════════════════════════════

@router.get("/predictions", response_model=List[schemas.PredictionResponse])
def list_all_predictions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
    _admin: models.User = Depends(require_admin),
):
    """List every prediction in the system (paginated)."""
    return (
        db.query(models.Prediction)
        .order_by(models.Prediction.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/predictions/user/{user_id}", response_model=List[schemas.PredictionResponse])
def list_predictions_for_user(
    user_id: int,
    db: Session = Depends(database.get_db),
    _admin: models.User = Depends(require_admin),
):
    """List all predictions for a specific user."""
    return (
        db.query(models.Prediction)
        .filter(models.Prediction.user_id == user_id)
        .order_by(models.Prediction.created_at.desc())
        .all()
    )


@router.delete("/predictions/{prediction_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_prediction(
    prediction_id: int,
    db: Session = Depends(database.get_db),
    _admin: models.User = Depends(require_admin),
):
    """Admin: delete any prediction by ID."""
    pred = db.query(models.Prediction).filter(models.Prediction.id == prediction_id).first()
    if not pred:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prediction not found.")
    db.delete(pred)
    db.commit()


# ═══════════════════════════════════════════════════════
#  SYMPTOMS (admin CRUD)
# ═══════════════════════════════════════════════════════

@router.get("/symptoms", response_model=List[schemas.SymptomResponse])
def list_symptoms(
    db: Session = Depends(database.get_db),
    _admin: models.User = Depends(require_admin),
):
    """List all symptoms."""
    return db.query(models.Symptom).order_by(models.Symptom.name).all()


@router.post("/symptoms", response_model=schemas.SymptomResponse, status_code=status.HTTP_201_CREATED)
def create_symptom(
    symptom_in: schemas.SymptomCreate,
    db: Session = Depends(database.get_db),
    _admin: models.User = Depends(require_admin),
):
    """Create a new symptom."""
    existing = db.query(models.Symptom).filter(models.Symptom.name == symptom_in.name).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Symptom already exists.")
    symptom = models.Symptom(name=symptom_in.name)
    db.add(symptom)
    db.commit()
    db.refresh(symptom)
    return symptom


@router.put("/symptoms/{symptom_id}", response_model=schemas.SymptomResponse)
def update_symptom(
    symptom_id: int,
    symptom_in: schemas.SymptomCreate,
    db: Session = Depends(database.get_db),
    _admin: models.User = Depends(require_admin),
):
    """Update a symptom's name."""
    symptom = db.query(models.Symptom).filter(models.Symptom.id == symptom_id).first()
    if not symptom:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Symptom not found.")
    symptom.name = symptom_in.name
    db.commit()
    db.refresh(symptom)
    return symptom


@router.delete("/symptoms/{symptom_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_symptom(
    symptom_id: int,
    db: Session = Depends(database.get_db),
    _admin: models.User = Depends(require_admin),
):
    """Delete a symptom."""
    symptom = db.query(models.Symptom).filter(models.Symptom.id == symptom_id).first()
    if not symptom:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Symptom not found.")
    db.delete(symptom)
    db.commit()


# ═══════════════════════════════════════════════════════
#  DISEASES (admin CRUD)
# ═══════════════════════════════════════════════════════

@router.get("/diseases", response_model=List[schemas.DiseaseResponse])
def list_diseases(
    db: Session = Depends(database.get_db),
    _admin: models.User = Depends(require_admin),
):
    """List all diseases."""
    return db.query(models.Disease).order_by(models.Disease.name).all()


@router.post("/diseases", response_model=schemas.DiseaseResponse, status_code=status.HTTP_201_CREATED)
def create_disease(
    disease_in: schemas.DiseaseCreate,
    db: Session = Depends(database.get_db),
    _admin: models.User = Depends(require_admin),
):
    """Create a new disease entry."""
    existing = db.query(models.Disease).filter(models.Disease.name == disease_in.name).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Disease already exists.")
    disease = models.Disease(name=disease_in.name, description=disease_in.description)
    db.add(disease)
    db.commit()
    db.refresh(disease)
    return disease


@router.get("/diseases/{disease_id}", response_model=schemas.DiseaseResponse)
def get_disease(
    disease_id: int,
    db: Session = Depends(database.get_db),
    _admin: models.User = Depends(require_admin),
):
    """Get a single disease by ID."""
    disease = db.query(models.Disease).filter(models.Disease.id == disease_id).first()
    if not disease:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Disease not found.")
    return disease


@router.put("/diseases/{disease_id}", response_model=schemas.DiseaseResponse)
def update_disease(
    disease_id: int,
    disease_in: schemas.DiseaseUpdate,
    db: Session = Depends(database.get_db),
    _admin: models.User = Depends(require_admin),
):
    """Update a disease's name or description."""
    disease = db.query(models.Disease).filter(models.Disease.id == disease_id).first()
    if not disease:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Disease not found.")
    if disease_in.name is not None:
        disease.name = disease_in.name
    if disease_in.description is not None:
        disease.description = disease_in.description
    db.commit()
    db.refresh(disease)
    return disease


@router.delete("/diseases/{disease_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_disease(
    disease_id: int,
    db: Session = Depends(database.get_db),
    _admin: models.User = Depends(require_admin),
):
    """Delete a disease."""
    disease = db.query(models.Disease).filter(models.Disease.id == disease_id).first()
    if not disease:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Disease not found.")
    db.delete(disease)
    db.commit()
