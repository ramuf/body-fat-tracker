import uuid
from typing import Any, List

from fastapi import APIRouter, HTTPException
from sqlmodel import select, desc

from app.api.deps import CurrentUser, SessionDep
from app.models.body_metric import (
    BodyMetric,
    BodyMetricCreate,
    BodyMetricRead,
    BodyMetricUpdate,
)

router = APIRouter()

@router.post("/", response_model=BodyMetricRead)
async def create_body_metric(
    *, session: SessionDep, current_user: CurrentUser, metric_in: BodyMetricCreate
) -> Any:
    """
    Create new body metric.
    """
    metric = BodyMetric.model_validate(metric_in, update={"user_id": current_user.id})
    session.add(metric)
    await session.commit()
    await session.refresh(metric)
    return metric

@router.get("/", response_model=List[BodyMetricRead])
async def read_body_metrics(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve body metrics.
    """
    statement = (
        select(BodyMetric)
        .where(BodyMetric.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .order_by(desc(BodyMetric.date))
    )
    result = await session.exec(statement)
    metrics = result.all()
    return metrics

@router.get("/{id}", response_model=BodyMetricRead)
async def read_body_metric(
    *, session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Any:
    """
    Get body metric by ID.
    """
    metric = await session.get(BodyMetric, id)
    if not metric:
        raise HTTPException(status_code=404, detail="Body metric not found")
    if metric.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return metric

@router.put("/{id}", response_model=BodyMetricRead)
async def update_body_metric(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    metric_in: BodyMetricUpdate,
) -> Any:
    """
    Update a body metric.
    """
    metric = await session.get(BodyMetric, id)
    if not metric:
        raise HTTPException(status_code=404, detail="Body metric not found")
    if metric.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    update_data = metric_in.model_dump(exclude_unset=True)
    metric.sqlmodel_update(update_data)
    session.add(metric)
    await session.commit()
    await session.refresh(metric)
    return metric

@router.delete("/{id}", response_model=BodyMetricRead)
async def delete_body_metric(
    *, session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Any:
    """
    Delete a body metric.
    """
    metric = await session.get(BodyMetric, id)
    if not metric:
        raise HTTPException(status_code=404, detail="Body metric not found")
    if metric.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    await session.delete(metric)
    await session.commit()
    return metric
