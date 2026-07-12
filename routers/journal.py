from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

import models
import schemas
import database
from auth_utils import get_current_user

router = APIRouter()

@router.post("/", response_model=schemas.JournalEntryResponse, status_code=status.HTTP_201_CREATED)
def create_journal_entry(
    entry_in: schemas.JournalEntryCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Create a new health journal entry."""
    entry = models.JournalEntry(
        user_id=current_user.id,
        date=entry_in.date,
        temperature=entry_in.temperature,
        blood_pressure=entry_in.blood_pressure,
        mood=entry_in.mood
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@router.get("/", response_model=List[schemas.JournalEntryResponse])
def get_journal_entries(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Get all journal entries for the current user, ordered by date desc."""
    entries = (
        db.query(models.JournalEntry)
        .filter(models.JournalEntry.user_id == current_user.id)
        .order_by(models.JournalEntry.date.desc())
        .all()
    )
    return entries
