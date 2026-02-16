from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

from app.main import app

# TestClient lets us call our FastAPI endpoints without starting a real server.
# It simulates HTTP requests in-process.
client = TestClient(app)

# A valid request payload we'll reuse across tests.
PAYLOAD = {"text": "Hello", "source_lang": "EN", "target_lang": "FR"}


# We patch two things:
# 1. get_deepl_api_key — so we don't need a real API key in the environment
# 2. deepl.Translator — so we never call the real DeepL API


@patch("app.api.translate.get_deepl_api_key", return_value="fake-key")
@patch("app.api.translate.deepl.Translator")
def test_translate_success(mock_translator_cls, mock_get_key):
    # mock_translator_cls is the mocked *class*. When our endpoint calls
    # deepl.Translator("fake-key"), it gets back mock_translator — a fake instance.
    mock_translator = MagicMock()
    mock_translator_cls.return_value = mock_translator

    # When our endpoint calls translator.translate_text(...), we want it
    # to return an object with a .text attribute, just like the real API would.
    mock_result = MagicMock()
    mock_result.text = "Bonjour"
    mock_translator.translate_text.return_value = mock_result

    response = client.post("/translate", json=PAYLOAD)

    # Assert the endpoint returned 200 with the expected response shape.
    assert response.status_code == 200
    data = response.json()
    assert data["translated_text"] == "Bonjour"
    assert data["source_lang"] == "EN"
    assert data["target_lang"] == "FR"

    # Verify our endpoint actually called DeepL with the right arguments.
    mock_translator.translate_text.assert_called_once_with(
        "Hello", source_lang="EN", target_lang="FR"
    )


@patch("app.api.translate.get_deepl_api_key", return_value="")
def test_translate_missing_api_key(mock_get_key):
    # When get_deepl_api_key returns an empty string (falsy), the endpoint
    # should return 500 before ever creating a Translator.
    response = client.post("/translate", json=PAYLOAD)

    assert response.status_code == 500
    assert "not configured" in response.json()["detail"].lower()
