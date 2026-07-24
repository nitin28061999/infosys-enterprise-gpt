from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from config.db_config import get_db
from .user_model import User, Role



class UserService:

    def __init__(self, db: Session = Depends(get_db) ):
        self.db = db 
    

    def get_user(self, id: int):

        user = self.db.query(User).filter(User.id == id).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user 


    def get_users(self):

        users = self.db.query(User).filter(User.role == Role.EMPLOYEE).all()
        return users

    def update_user(self, id, data):
        pass 

    def delete_user(self, id):
        pass



