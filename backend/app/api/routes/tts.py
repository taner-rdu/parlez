from fastapi import APIRouter
from fastapi.responses import Response
from google.cloud import texttospeech
from pydantic import BaseModel

from app.config import get_gcp_credentials

router = APIRouter()


class TTSRequest(BaseModel):
    text: str


@router.post("/tts")
def synthesize(request: TTSRequest):
    client = texttospeech.TextToSpeechClient(credentials=get_gcp_credentials())
    response = client.synthesize_speech(
        input=texttospeech.SynthesisInput(text=request.text),
        voice=texttospeech.VoiceSelectionParams(
            language_code="fr-FR",
            name="fr-FR-Neural2-C",
        ),
        audio_config=texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3,
        ),
    )
    return Response(content=response.audio_content, media_type="audio/mpeg")
