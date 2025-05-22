from sqlalchemy import Column, Integer, String, DECIMAL, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
from utils.date_utils import now_tw

class SavingsGoal(Base):
    __tablename__ = "savings_goals"

    goal_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    name = Column(String(100), nullable=False)
    target_amount = Column(DECIMAL(15, 2), nullable=False)
    current_amount = Column(DECIMAL(15, 2), default=0)
    target_date = Column(Date)
    note = Column(String)
    created_at = Column(DateTime, default=now_tw)
    
    # user = relationship("User", back_populates="savings_goals")
