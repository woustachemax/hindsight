from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from sqlalchemy import text
from src.config import settings
from src.db import create_db_and_tables, get_session
from src.routers import auth
from starlette.middleware.sessions import SessionMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(title='Hindsight Backend', lifespan=lifespan)
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix='/auth', tags=["auth"])


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/db-ping")
def db_ping(session: Session = Depends(get_session)):
    session.execute(text("SELECT 1"))
    return {"db": "ok"}
