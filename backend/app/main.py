import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.translate import router as translate_router
from .api.routes.vocab import router as vocab_router

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Parlez", description="A translation practice app")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost:\d+",
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(translate_router)
app.include_router(vocab_router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}
