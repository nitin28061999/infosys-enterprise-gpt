from fastapi import HTTPException


def permission_context_builder(curr_user:dict)->dict:
    user_id=curr_user.get("id")
    user_role=curr_user.get("role")
    user_department=curr_user.get("department")

    if not user_id or not user_role or not user_department:
        raise HTTPException(
        status_code=401,
        detail="Invalid User authentication data",
        )

    if user_role=="admin":
        return {
        "user_id":user_id,
        "user_role": user_role,
        "user_department":user_department,
        "can_access-all_documemnt":True,
        "allowed_departments": [],
        "allowed_cofidentiality":[
            "public",
            "internal",
            "confidential"
            "retricted"
        ],
        "allowed_access_scope":[
            "all",
            "department",
            "owner"
        ]
        }

    if user_role=="knowledge_owner":
            return {
            "user_id":user_id,
            "role": user_role,
            "department":user_department,
            "can_access-all_documemnt":False,
            "allowed_departments":[user_department],
            "allowed_cofidentiality":[
                "public",
                "internal",
                "confidential"
            ],
            "allowed_access_scope":[
                "all",
                "department",
                "owner"
            ]
            }

    if user_role=="employee":
         return{

              "user_id":user_id,
              "role":user_role,
              "department":user_department,
              "can_access_all-document":False,
              "allowed_departments":[user_department],
              "allowed_cofidentiality":[
                   "public",
                   "department"
              ],
              "allowed_access_scope":[
                   "all",
                   "department"
              ]
         }

    raise HTTPException(
         status_code=403,
         details="unsupported User role",
    )

if __name__=='__main__':
     curr_user = {
          "id": "001",
          "role": "employee",
          "department": "IT"
     }
     output = permission_context_builder(curr_user)
     print(output)