import uuid
from datetime import date as date_type
from sqlmodel import Field, SQLModel, Relationship
from app.models.user import User

class BodyMetricBase(SQLModel):
    date: date_type = Field(default_factory=date_type.today)
    weight: float
    body_fat_percentage: float | None = None
    muscle_mass: float | None = None
    water_percentage: float | None = None
    bmi: float | None = None
    ffmi: float | None = None
    bmr: float | None = None
    notes: str | None = None

class BodyMetric(BodyMetricBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    
    user: User = Relationship()

class BodyMetricCreate(BodyMetricBase):
    pass

class BodyMetricRead(BodyMetricBase):
    id: uuid.UUID
    user_id: uuid.UUID

class BodyMetricUpdate(SQLModel):
    date: date_type | None = None
    weight: float | None = None
    body_fat_percentage: float | None = None
    muscle_mass: float | None = None
    water_percentage: float | None = None
    bmi: float | None = None
    ffmi: float | None = None
    bmr: float | None = None
    notes: str | None = None
