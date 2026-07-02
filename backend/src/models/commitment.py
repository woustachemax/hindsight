
from datetime import datetime, timezone
from typing import Any
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel
from sqlalchemy import Column, JSON


class Commitment(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    submission_id: UUID = Field(foreign_key="submission.id", index=True, ondelete="CASCADE")
    committed_sharpe: float
    commit_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    tracking_history_json: list[Any] = Field(default_factory=list, sa_column=Column(JSON))
