from datetime import datetime, timezone
from typing import Any
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel
from sqlalchemy import Column, JSON, LargeBinary


class Submission(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    strategy_id: UUID = Field(foreign_key="strategy.id", index=True, ondelete="CASCADE")
    equity_curve_pickle: bytes | None = Field(default=None, sa_column=Column(LargeBinary))
    metadata_json: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))