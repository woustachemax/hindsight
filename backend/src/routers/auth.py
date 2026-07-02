from authlib.integrations.starlette_client import OAuth, OAuthError
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.responses import RedirectResponse
from sqlmodel import Session, select

from src.config import settings
from src.core.auth import (
    generate_token,
    get_current_user,
    hash_password,
    verify_password,
)
from src.db import get_session
from src.models.user import User
from schemas import UserLogin, UserRead, UserRegister


router = APIRouter()


oauth = OAuth()
oauth.register(
    name="google",
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


def _set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=settings.ENV == "production",
        samesite="lax",
        max_age=settings.JWT_EXPIRE_MINUTES * 60,
    )


@router.post("/register", response_model=UserRead)
def register(
    payload: UserRegister,
    response: Response,
    session: Session = Depends(get_session),
):
    existing = session.exec(select(User).where(User.email == payload.email)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    _set_auth_cookie(response, generate_token(user.id))
    return user


@router.post("/login", response_model=UserRead)
def login(
    payload: UserLogin,
    response: Response,
    session: Session = Depends(get_session),
):
    user = session.exec(select(User).where(User.email == payload.email)).first()
    if (
        not user
        or not user.password_hash
        or not verify_password(payload.password, user.password_hash)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    _set_auth_cookie(response, generate_token(user.id))
    return user


@router.get("/google/login")
async def google_login(request: Request):
    return await oauth.google.authorize_redirect(request, settings.GOOGLE_REDIRECT_URI)


@router.get("/google/callback")
async def google_callback(request: Request, session: Session = Depends(get_session)):
    try:
        token = await oauth.google.authorize_access_token(request)
    except OAuthError:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=oauth")

    info = await oauth.google.userinfo(token=token)
    email = info["email"]

    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        user = User(
            email=email,
            name=info.get("name", ""),
            picture_url=info.get("picture"),
        )
        session.add(user)
        session.commit()
        session.refresh(user)
    elif info.get("picture") and user.picture_url != info.get("picture"):
        user.picture_url = info.get("picture")
        session.add(user)
        session.commit()
        session.refresh(user)

    response = RedirectResponse(url=settings.FRONTEND_URL)
    _set_auth_cookie(response, generate_token(user.id))
    return response


@router.get("/me", response_model=UserRead)
def me(user: User = Depends(get_current_user)):
    return user


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"ok": True}