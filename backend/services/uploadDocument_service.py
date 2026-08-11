from fastapi import UploadFile, HTTPException
from config.env_config import envConfig
from config.supabase_config import supabase
from config.logger_config import logger
import uuid



async def supabase_upload(file: UploadFile) -> str:

        try:
                if not file.filename:
                        raise HTTPException(status_code=400, detail="Uploaded file has no filename.")

                extension = file.filename.rsplit(".")[-1].lower()

                if extension not  in ["pdf", "docx", "txt"]:
                       raise HTTPException(status_code=400, detail="Only PDF, DOCX and TXT files are allowed.")

                filename = f"{uuid.uuid4()}.{extension}"

                path = f"documents/{filename}"

                file_bytes = await file.read()

                content_type = file.content_type or "application/octet-stream"

                response = supabase.storage.from_(envConfig.SUPABASE_BUCKET ).upload(path=path,file=file_bytes,file_options={"content-type": content_type})

                logger.info("File uploaded successfully")
                return path

        except HTTPException:
            raise
        except Exception as e:
                logger.exception(f"Supabase upload failed: {e}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to upload file: {str(e)}") from e