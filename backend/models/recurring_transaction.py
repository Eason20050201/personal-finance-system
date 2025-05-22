from sqlalchemy import Column, Integer, ForeignKey, String, Date, DECIMAL, Text
from sqlalchemy.orm import relationship
from database import Base

from models.user import User

class RecurringTransaction(Base):
    __tablename__ = "recurring_transactions"

    recurring_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.account_id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.category_id"), nullable=False)
    amount = Column(DECIMAL(15, 2), nullable=False)
    type = Column(String(10), nullable=False)
    note = Column(Text)
    frequency = Column(String(10), nullable=False)  # 'daily', 'weekly', 'monthly'
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    next_occurrence = Column(Date, nullable=False)

    # Optional relationships
    # user = relationship("User", back_populates="recurring_transactions")
    # account = relationship("Account", back_populates="recurring_transactions")
    # category = relationship("Category", back_populates="recurring_transactions")