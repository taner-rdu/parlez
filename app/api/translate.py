import deepl
from fastapi import APIRouter, HTTPException

from app.api.schemas import TranslateRequest, TranslateResponse
from app.config import settings

router = APIRouter()


@router.post("/translate", response_model=TranslateResponse)
async def translate(request: TranslateRequest) -> TranslateResponse:
    if not settings.deepl_api_key:
        raise HTTPException(status_code=500, detail="DeepL API key not configured")

    translator = deepl.Translator(settings.deepl_api_key)

    try:
        result = translator.translate_text(
            request.text,
            source_lang=request.source_lang,
            target_lang=request.target_lang,
        )

    except deepl.AuthorizationException:
        raise HTTPException(
            status_code=401, detail="Translation service authentication failed"
        )
    except deepl.QuotaExceededException:
        raise HTTPException(status_code=429, detail="Translation quota exceeded")
    except deepl.DeepLException:
        raise HTTPException(status_code=502, detail="Translation service unavailable")

    return TranslateResponse(
        translated_text=result.text,
        source_lang=request.source_lang,
        target_lang=request.target_lang,
    )
