from sqlalchemy import Column, Integer, String, DateTime
from database import Base
from utils.date_utils import now_tw
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)  # 對應 DB 的 name 欄位
    email = Column(String(100), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    currency_preference = Column(String(10))
    created_at = Column(DateTime, default=now_tw)
    
    # accounts = relationship("Account", back_populates="user")
    # categories = relationship("Category", back_populates="user")
    # budgets = relationship("Budget", back_populates="user")
    # transactions = relationship("Transaction", back_populates="user")
    # recurring_transactions = relationship("RecurringTransaction", back_populates="user")
    # savings_goals = relationship("SavingsGoal", back_populates="user")
    notifications = relationship("Notification", back_populates="user")