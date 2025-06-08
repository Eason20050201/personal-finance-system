from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Category(Base):
    __tablename__ = "categories"

    category_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    name = Column(String(100), nullable=False)
    type = Column(Enum("income", "expense", name="category_type"), nullable=False)
    color_tag = Column(String(20))

    # user = relationship("User", back_populates="category")
    # transactions = relationship("Transaction", back_populates="category")
    # budgets = relationship("Budget", back_populates="category")
