from arq.connections import RedisSettings
from config.env_config import envConfig
from arq import create_pool
from services.background_service import index_document
import model.main_model


redis_settings = RedisSettings(
    # host=envConfig.REDIS_HOST,    # prod
    host=envConfig.REDIS_LOCAL_HOST,    # dev
    port=envConfig.REDIS_PORT
)



class WorkerSettings:

    functions = [
        index_document
    ]

    redis_settings = redis_settings
    max_jobs = 5





class ArqService:

    async def enqueue_index_job(self, document_id: int):
        redis = await create_pool(redis_settings)

        await redis.enqueue_job(
            "index_document",
            document_id
        )

        await redis.close()