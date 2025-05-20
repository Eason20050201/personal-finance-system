from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Account(Base):
    __tablename__ = "accounts"

    account_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    account_name = Column(String(100), nullable=False)
    account_type = Column(String(20), nullable=False)
    currency = Column(String(10), default="TWD")
    balance = Column(DECIMAL(15, 2), default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # user = relationship("User", back_populates="account")
    # transactions = relationship("Transaction", back_populates="account")