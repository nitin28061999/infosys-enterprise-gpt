import jwt
from jwt.exceptions import InvalidTokenError
from datetime import datetime, timedelta, timezone
from config.env_config import envConfig
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException

oauth2_scheme = OAuth2PasswordBearer( tokenUrl="/api/auth/signin" )


def create_access_token(data: dict) -> str:
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=envConfig.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload.update({'exp': expire})

    return jwt.encode(payload, envConfig.SECRET_KEY, algorithm=envConfig.ALGORITHM)


def verify_access_token(token: str = Depends(oauth2_scheme)) -> dict :
    try:
        payload = jwt.decode(token, envConfig.SECRET_KEY, algorithms=[envConfig.ALGORITHM])
        return payload

    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="invalid or expired token")