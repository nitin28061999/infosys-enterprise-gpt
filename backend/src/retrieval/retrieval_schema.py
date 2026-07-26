from pydantic import BaseModel 




class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    success: bool 
    message: str 
    data: None