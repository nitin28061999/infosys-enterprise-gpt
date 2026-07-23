from supabase import create_client
from config.env_config import envConfig
from fastapi import UploadFile
import uuid



supabase = create_client(
    envConfig.SUPABASE_URL,
    envConfig.SUPABASE_KEY
)






async def supabase_upload(file: UploadFile) -> str:

        try:
              extension = file.filename.split(".")[-1]

              filename = f"{uuid.uuid4()}.{extension}"

              path = f"documents/{filename}"

              file_bytes = await file.read()

              response = supabase.storage.from_(  envConfig.SUPABASE_BUCKET ).upload(path=path,file=file_bytes,file_options={"content-type": file.content_type})

              return path

        except Exception as e:
               print(e)
               raise