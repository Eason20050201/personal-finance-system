from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import crud.savings_goal as goal_crud
import schemas.savings_goal as goal_schema

router = APIRouter(
    prefix="/savings-goals",
    tags=["savings_goals"],
)

# ➕ 建立儲蓄目標
@router.post("/", response_model=goal_schema.SavingsGoalOut)
def create_savings_goal(
    goal_in: goal_schema.SavingsGoalCreate,
    db: Session = Depends(get_db),
):
    print("✅ 收到儲蓄目標請求：", goal_in.dict())
    return goal_crud.create_savings_goal(db, goal_in)

# 📥 查詢某使用者的儲蓄目標
@router.get("/{user_id}", response_model=list[goal_schema.SavingsGoalOut])
def get_savings_goals_by_user(user_id: int, db: Session = Depends(get_db)):
    goals = goal_crud.get_savings_goals_by_user(db, user_id)
    if not goals:
        raise HTTPException(status_code=404, detail="No savings goals found for this user")
    return goals

@router.put("/{goal_id}", response_model=goal_schema.SavingsGoalOut)
def update_savings_goal(
    goal_id: int,
    goal_in: goal_schema.SavingsGoalUpdate,
    db: Session = Depends(get_db),
):
    updated = goal_crud.update_savings_goal(db, goal_id, goal_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Savings goal not found")
    return updated

@router.delete("/{goal_id}")
def delete_savings_goal(goal_id: int, db: Session = Depends(get_db)):
    deleted = goal_crud.delete_savings_goal(db, goal_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Savings goal not found")
    return {"detail": "Savings goal deleted"}