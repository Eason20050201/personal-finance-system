from sqlalchemy import Column, Integer, ForeignKey, Date, Enum, DECIMAL, DateTime, String, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class TransactionType(str, enum.Enum):
    income = "income"
    expense = "expense"

class Transaction(Base):
    __tablename__ = "transactions"

    transaction_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.account_id"))
    category_id = Column(Integer, ForeignKey("categories.category_id"))
    amount = Column(DECIMAL(15, 2), nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    transaction_date = Column(Date, nullable=False)  
    note = Column(Text)  
    tags = Column(JSON) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    recurring_id = Column(Integer)

    # user = relationship("User", back_populates="transactions")
    # category = relationship("Category", back_populates="transactions")
    # account = relationship("Account", back_populates="transactions")