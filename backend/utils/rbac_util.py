from fastapi import Depends, HTTPException
from .jwt_util import verify_access_token 


class RBAC:

    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles
    
    def __call__(self, curr_user= Depends(verify_access_token)):
        role = curr_user['role']
        if role not in self.allowed_roles:
            raise HTTPException(status_code=403, detail="Permission denied")
        return curr_user 
    

admin_only = RBAC(["ADMIN"])
knowledge_owner_only = RBAC(["ADMIN", "KNOWLEDGE_OWNER"])
employee_only = RBAC(["ADMIN", "KNOWLEDGE_OWNER", "EMPLOYEE"])