from sqlmodel import SQLModel, create_engine, Session
from src.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
)


def create_db_and_tables():
    from src.models import user , submission, strategy, decayprediction, commitment, clusterrun, bootstraprun    
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session