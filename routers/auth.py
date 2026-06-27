from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import models
import schemas
import database
from auth_utils import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
)

router = APIRouter()


# ─────────────────────────── Register ───────────────────────────

@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register(user_in: schemas.UserCreate, db: Session = Depends(database.get_db)):
    """Register a new user and return a JWT token immediately."""
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered.",
        )

    new_user = models.User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        name=user_in.name,
        age=user_in.age,
        gender=user_in.gender,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.email, "id": new_user.id, "role": new_user.role})
    return {"access_token": token, "token_type": "bearer", "user": new_user}


# ─────────────────────────── Login ───────────────────────────

@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(database.get_db)):
    """Authenticate a user and return a JWT token."""
    db_user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not db_user or not verify_password(credentials.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )
    if db_user.status != "Active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been suspended. Please contact an administrator.",
        )

    token = create_access_token({"sub": db_user.email, "id": db_user.id, "role": db_user.role})
    return {"access_token": token, "token_type": "bearer", "user": db_user}


# ─────────────────────────── Current User ───────────────────────────

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return current_user


@router.put("/me", response_model=schemas.UserResponse)
def update_me(
    updates: schemas.UserUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Update the currently authenticated user's profile."""
    if updates.name is not None:
        current_user.name = updates.name
    if updates.age is not None:
        current_user.age = updates.age
    if updates.gender is not None:
        current_user.gender = updates.gender
    if updates.password is not None:
        current_user.hashed_password = get_password_hash(updates.password)

    db.commit()
    db.refresh(current_user)
    return current_user
