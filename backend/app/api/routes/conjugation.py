import json

import anthropic
from fastapi import APIRouter, HTTPException

from ..schemas import ConjugationRequest, ConjugationResponse
from ...config import get_anthropic_api_key

router = APIRouter(prefix="/conjugation", tags=["conjugation"])

TENSES = [
    "Présent",
    "Passé composé",
    "Imparfait",
    "Futur simple",
    "Conditionnel présent",
    "Subjonctif présent",
]

SYSTEM_PROMPT = (
    "You are a French language expert. "
    "Respond with valid JSON only — no prose, no markdown fences."
)

USER_PROMPT_TEMPLATE = """Determine if "{verb}" is a valid, conjugatable French verb.

If it is NOT a valid French verb, respond with exactly:
{{"valid": false, "error": "Not a valid French verb"}}

If it IS a valid French verb, respond with exactly this structure (fill in all conjugated forms):
{{
  "valid": true,
  "Présent":              {{"je": "", "tu": "", "il/elle/on": "", "nous": "", "vous": "", "ils/elles": ""}},
  "Passé composé":        {{"je": "", "tu": "", "il/elle/on": "", "nous": "", "vous": "", "ils/elles": ""}},
  "Imparfait":            {{"je": "", "tu": "", "il/elle/on": "", "nous": "", "vous": "", "ils/elles": ""}},
  "Futur simple":         {{"je": "", "tu": "", "il/elle/on": "", "nous": "", "vous": "", "ils/elles": ""}},
  "Conditionnel présent": {{"je": "", "tu": "", "il/elle/on": "", "nous": "", "vous": "", "ils/elles": ""}},
  "Subjonctif présent":   {{"je": "", "tu": "", "il/elle/on": "", "nous": "", "vous": "", "ils/elles": ""}}
}}"""


@router.post("", response_model=ConjugationResponse)
async def conjugate(request: ConjugationRequest) -> ConjugationResponse:
    api_key = get_anthropic_api_key()
    if not api_key:
        raise HTTPException(status_code=500, detail="Anthropic API key not configured")

    client = anthropic.Anthropic(api_key=api_key)

    try:
        message = client.messages.create(
            model="claude-opus-4-7",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": USER_PROMPT_TEMPLATE.format(verb=request.verb.strip())}
            ],
        )
    except anthropic.AuthenticationError:
        raise HTTPException(status_code=500, detail="Anthropic API key invalid")
    except anthropic.APIError:
        raise HTTPException(status_code=502, detail="Conjugation service unavailable")

    try:
        data = json.loads(message.content[0].text)
    except (json.JSONDecodeError, IndexError, KeyError):
        raise HTTPException(status_code=502, detail="Unexpected response from conjugation service")

    if not data.get("valid", False):
        return ConjugationResponse(valid=False, error=data.get("error", "Not a valid French verb"))

    tenses = {tense: data[tense] for tense in TENSES if tense in data}
    return ConjugationResponse(valid=True, tenses=tenses)
