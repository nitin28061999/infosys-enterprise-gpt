from fastapi import HTTPException
from src.users.user_model import Role


def permission_context_builder(curr_user:dict)->dict:
    user_id=curr_user.get("id")
    user_role=curr_user.get("role")
    user_department=curr_user.get("department")

    if not user_id or not user_role or not user_department:
        raise HTTPException(
        status_code=401,
        detail="Invalid User authentication data",
        )

    if user_role== Role.ADMIN:
        return {
        "user_id":user_id,
        "user_role": user_role,
        "user_department":user_department,
        "can_access_all_documents":True,
        "allowed_departments": [],
        "allowed_confidentiality":[ "PUBLIC", "INTERNAL", "CONFIDENTIAL", "RESTRICTED" ],
        "allowed_access_scope":[ "ALL", "DEPARTMENT", "OWNER" ]
        }

    if user_role==Role.KNOWLEDGE_OWNER:
            return {
            "user_id": user_id,
            "user_role": user_role,
            "user_department": user_department,
            "can_access_all_documents": False,
            "allowed_confidentiality": [
                "PUBLIC",
                "INTERNAL",
                "CONFIDENTIAL"
            ],
            "allowed_access_scope": [
                "ALL",
                "DEPARTMENT",
                "OWNER"
            ]
            }

    if user_role== Role.EMPLOYEE:
         return{

            "user_id": user_id,
            "user_role": user_role,
            "user_department": user_department,
            "can_access_all_documents": False,
            "allowed_confidentiality": [
                "PUBLIC",
                "INTERNAL"
            ],
            "allowed_access_scope": [
                "ALL",
                "DEPARTMENT"
            ]
         }

    raise HTTPException(
         status_code=403,
         detail="unsupported User role",
    )


def can_access_document(document_metadata: dict, permission_context: dict):

  
    # admin
     if permission_context["can_access_all_documents"]:
          return True

    # Check confidentiality
     confidentiality  = document_metadata.get("confidentiality")
     if confidentiality not in permission_context["allowed_confidentiality"]:
          return False

     # Check access scope
     access_scope = document_metadata.get("access_scope")

        #  ALL
     if access_scope == "ALL":
          return True

        # DEPARTMENT
     if access_scope == "DEPARTMENT":
          document_department  = document_metadata.get('department')

          return document_department == permission_context["user_department"]

        # OWNER
     if access_scope == "OWNER":
          document_owner_id = document_metadata.get("owner_id")
          return document_owner_id == permission_context["user_id"]



     return False
    