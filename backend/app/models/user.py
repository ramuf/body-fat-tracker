import uuid
from datetime import date
from sqlmodel import Field, SQLModel

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)
    birth_date: date | None = Field(default=None)
    sex: str | None = Field(default=None)
    height: float | None = Field(default=None)

class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: uuid.UUID

class UserUpdate(SQLModel):
    email: str | None = None
    password: str | None = None
    full_name: str | None = None
    birth_date: date | None = None
    sex: str | None = None
    height: float | None = None
    is_active: bool | None = None
    is_superuser: bool | None = None
