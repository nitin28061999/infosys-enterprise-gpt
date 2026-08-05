from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from config.db_config import get_db
from .user_model import User, Role
from .user_schema import UserUpdate
from config.logger_config import logger



class UserService:

    def __init__(self, db: Session = Depends(get_db) ):
        self.db = db 
    

    def get_user(self, id: int):
        
        user = self.db.query(User).filter(User.id == id, User.is_deleted == False).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user 




    def get_users(self):

        users = self.db.query(User).filter(User.role == Role.EMPLOYEE, User.is_deleted == False).all()
        return users

    

    def update_user(self, user_id: int, data: UserUpdate):
        
        user = self.db.query(User).filter(User.id == user_id, User.is_deleted == False).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        update_data = data.model_dump(exclude_unset= True)

        if not update_data:
            raise HTTPException(status_code=400, detail="No fields provided for update")


        try:
            for key, val in update_data.items():
                setattr(user, key, val)       

            self.db.commit()
            self.db.refresh(user) 
            return user
        
        except Exception as e:
            self.db.rollback()
            logger.exception("Failed to update user. user_id=%s", user_id)
            raise
            


    def delete_user(self, user_id:int):

        user = self.db.query(User).filter(User.id == user_id, User.is_deleted == False).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        try:
            user.is_deleted = True
            self.db.commit()
            self.db.refresh(user)
            return user
        except:
            self.db.rollback()
            logger.exception("Failed to delete user. ")
            raise HTTPException(status_code=400, detail="Failed to delete user")

        



