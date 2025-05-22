from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from crud import notification as crud
from schemas.notification import NotificationOut
from typing import List

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/{user_id}", response_model=List[NotificationOut])
def read_notifications(user_id: int, unread_only: bool = False, db: Session = Depends(get_db)):
    return crud.get_user_notifications(db, user_id, unread_only=unread_only)

@router.post("/{notification_id}/read", response_model=NotificationOut)
def mark_as_read(notification_id: int, db: Session = Depends(get_db)):
    return crud.mark_notification_read(db, notification_id)