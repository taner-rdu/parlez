def test_post_translate_returns_french_translation(playwright):
    ctx = playwright.request.new_context(base_url="http://localhost:8000")
    response = ctx.post("/translate", data={"text": "Hello", "source_lang": "EN", "target_lang": "FR"})
    assert response.status == 200
    body = response.json()
    assert body["translated_text"] == "Bonjour"
    assert body["source_lang"] == "EN"
    assert body["target_lang"] == "FR"
    ctx.dispose()
