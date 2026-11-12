from datetime import datetime, timezone
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel

class ClusterRun(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id", index=True, ondelete="CASCADE")
    effective_n_trials: int
    total_submissions: int
    computed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
