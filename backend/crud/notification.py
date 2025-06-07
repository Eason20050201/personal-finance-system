# backend/crud/notification.py
from sqlalchemy.orm import Session
from models.notification import Notification

def get_user_notifications(db: Session, user_id: int, unread_only: bool = False):
    query = db.query(Notification).filter(Notification.user_id == user_id)
    if unread_only:
        query = query.filter(Notification.is_read == False)
    return query.order_by(Notification.created_at.desc()).all()
