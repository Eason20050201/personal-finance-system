from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, DateTime
from sqlalchemy.orm import relationship
from utils.date_utils import now_tw
from database import Base

class Budget(Base):
    __tablename__ = "budgets"

    budget_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.category_id"), nullable=True)
    amount = Column(DECIMAL(15, 2), nullable=False)
    period = Column(String(10), nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    notify_interval_days = Column(Integer, default=1)  
    last_notified_at = Column(DateTime, nullable=True)     
    created_at = Column(DateTime, default=now_tw)

    # user = relationship("User", back_populates="budgets")
    # category = relationship("Category")