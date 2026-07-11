import logging
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.deps import require_api_key
from .api.translate import router as translate_router
from .api.routes.vocab import router as vocab_router
from .api.routes.conjugation import router as conjugation_router
from .api.routes.sentences import router as sentences_router
from .api.routes.tts import router as tts_router

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Parlez", description="A translation practice app")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost:\d+",
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(translate_router, dependencies=[Depends(require_api_key)])
app.include_router(vocab_router, dependencies=[Depends(require_api_key)])
app.include_router(conjugation_router, dependencies=[Depends(require_api_key)])
app.include_router(sentences_router, dependencies=[Depends(require_api_key)])
app.include_router(tts_router, dependencies=[Depends(require_api_key)])


@app.get("/health")
async def health_check():
    return {"status": "ok"}
