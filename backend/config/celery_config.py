from celery import Celery

celery_app = Celery(
    "document_indexer",
    broker="amqp://guest:guest@localhost:5672//",
    backend="rpc://"
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
)

