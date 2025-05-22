from sqlalchemy.orm import Session
from models.savings_goal import SavingsGoal
from schemas.savings_goal import SavingsGoalCreate
from schemas.savings_goal import SavingsGoalUpdate

# ➕ 建立一筆儲蓄目標
def create_savings_goal(db: Session, goal_in: SavingsGoalCreate):
    db_goal = SavingsGoal(**goal_in.dict())
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

# 📥 查詢某使用者的所有儲蓄目標
def get_savings_goals_by_user(db: Session, user_id: int):
    return db.query(SavingsGoal).filter(SavingsGoal.user_id == user_id).all()

def update_savings_goal(db: Session, goal_id: int, goal_in: SavingsGoalUpdate):
    goal = db.query(SavingsGoal).filter(SavingsGoal.goal_id == goal_id).first()
    if not goal:
        return None
    for field, value in goal_in.dict(exclude_unset=True).items():
        setattr(goal, field, value)
    db.commit()
    db.refresh(goal)
    return goal

def delete_savings_goal(db: Session, goal_id: int):
    goal = db.query(SavingsGoal).filter(SavingsGoal.goal_id == goal_id).first()
    if not goal:
        return None
    db.delete(goal)
    db.commit()
    return goal