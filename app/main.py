import logging

from fastapi import FastAPI

from app.api.translate import router as translate_router

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Parlez", description="A translation practice app")

app.include_router(translate_router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}
