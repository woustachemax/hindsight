from datetime import datetime, timezone
from typing import Any
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel
from sqlalchemy import Column, JSON


class DecayPrediction(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    submission_id: UUID = Field(foreign_key="submission.id", index=True, ondelete="CASCADE")
    predicted_decay: float
    shap_values_json: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    predicted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))