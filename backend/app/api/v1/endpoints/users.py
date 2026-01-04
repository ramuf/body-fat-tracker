from typing import Any, List

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.api.deps import CurrentUser, SessionDep
from app.core.security import get_password_hash
from app.models.user import User, UserCreate, UserRead, UserUpdate
from app.models.body_metric import BodyMetric, BodyMetricRead
from app.core.calculations import calculate_bmi, calculate_ffmi, calculate_bmr, calculate_age

router = APIRouter()


@router.post("/", response_model=UserRead)
@router.post("/signup", response_model=UserRead)
async def create_user(session: SessionDep, user_in: UserCreate) -> Any:
    """
    Create new user.
    """
    statement = select(User).where(User.email == user_in.email)
    result = await session.exec(statement)
    user = result.first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    
    user_data = user_in.model_dump(exclude={"password"})
    user = User(**user_data, hashed_password=get_password_hash(user_in.password))
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


@router.get("/me", response_model=UserRead)
async def read_user_me(current_user: CurrentUser) -> Any:
    """
    Get current user.
    """
    return current_user


@router.patch("/me", response_model=UserRead)
async def update_user_me(
    *,
    session: SessionDep,
    user_in: UserUpdate,
    current_user: CurrentUser,
) -> Any:
    """
    Update own user.
    """
    user_data = user_in.model_dump(exclude_unset=True)
    current_user.sqlmodel_update(user_data)
    session.add(current_user)
    await session.commit()
    await session.refresh(current_user)
    return current_user


@router.post("/me/recalculate-metrics", response_model=List[BodyMetricRead])
async def recalculate_metrics(
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Recalculate BMI, FFMI, and BMR for all body metrics of the current user.
    """
    if not current_user.height:
        raise HTTPException(status_code=400, detail="User height is required for calculations.")
    
    # Fetch all metrics
    statement = select(BodyMetric).where(BodyMetric.user_id == current_user.id)
    result = await session.exec(statement)
    metrics = result.all()
    
    updated_metrics = []
    for metric in metrics:
        # Calculate Age at the time of metric
        age = None
        if current_user.birth_date:
            age = calculate_age(current_user.birth_date, metric.date)
        
        # Calculate BMI
        metric.bmi = calculate_bmi(metric.weight, current_user.height)
        
        # Calculate FFMI
        if metric.body_fat_percentage is not None:
            metric.ffmi = calculate_ffmi(metric.weight, current_user.height, metric.body_fat_percentage)
        
        # Calculate BMR
        if age is not None and current_user.sex:
            metric.bmr = calculate_bmr(metric.weight, current_user.height, age, current_user.sex)
            
        session.add(metric)
        updated_metrics.append(metric)
        
    await session.commit()
    
    return updated_metrics
