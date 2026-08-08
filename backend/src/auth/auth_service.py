from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from config.db_config import get_db
from src.users.user_model import User, Role
from .auth_schema import UserCreate
from utils.password_util import hashPassword, verifyPassword
from utils.jwt_util import create_access_token


class AuthService:

    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def signup(self, data: UserCreate, role: Role = Role.EMPLOYEE):

        isExist = self.db.query(User).filter(User.email == data.email).first()

        if isExist:
            raise HTTPException(status_code=409, detail="User already exist")

        hashed_password = hashPassword(data.password)

        try:
            user = User(
                name=data.name,
                email=data.email,
                password=hashed_password,
                department=data.department,
                role=role,
            )

            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)

            return user

        except Exception as e:
            self.db.rollback()
            print(str(e))
            raise HTTPException(status_code=500, detail="Internal Server Error")

    def create_admin(self, data):
        return self.signup(data, Role.ADMIN)

    def create_knowledgeOwner(self, data):
        return self.signup(data, Role.KNOWLEDGE_OWNER)

    def signin(self, form_data: OAuth2PasswordRequestForm):

        user = (
            self.db.query(User)
            .filter(User.email == form_data.username)
            .first()
        )

        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if not verifyPassword(form_data.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        token = create_access_token(
            {
                "id": user.id,
                "role": user.role,
                "department": user.department,
            }
        )

        return token

    def logout(self):
        pass