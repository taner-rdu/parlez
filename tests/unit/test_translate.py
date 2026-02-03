import logging

import deepl

from app.config import get_deepl_api_key

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def test_deepl_translate_to_french():
    translator = deepl.Translator(get_deepl_api_key())
    result = translator.translate_text("Hello", target_lang="FR")
    logger.info("DeepL response: %s", result)
    assert result.text == "Bonjour"
