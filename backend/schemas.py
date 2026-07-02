from sqlmodel import SQLModel, Field
from datetime import datetime
from uuid import UUID
from typing import Any


class UserRegister(SQLModel):
    name: str
    email: str
    password: str


class UserLogin(SQLModel):
    email: str
    password: str


class OAuthUserCreate(SQLModel):
    name: str
    email: str
    picture_url: str | None = None


class UserRead(SQLModel):
    id: UUID
    name: str
    email: str
    picture_url: str | None = None
    created_at: datetime

