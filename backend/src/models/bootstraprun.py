from sqlmodel import SQLModel, Field
from uuid import uuid4, UUID
from datetime import datetime
from sqlalchemy import Column, LargeBinary


class BootstrapRun(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    submission_id: UUID = Field(foreign_key="submission.id", index=True, ondelete="CASCADE")
    n_trials: int
    n_bootstrap_days: int
    max_sharpe_distribution_pickle: bytes | None = Field(default=None, sa_column=Column(LargeBinary))
    completed_at: datetime | None = None
