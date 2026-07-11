def test_health_check_does_not_require_auth(playwright, base_url):
    ctx = playwright.request.new_context(base_url=base_url)
    response = ctx.get("/health")
    assert response.status == 200
    ctx.dispose()


def test_protected_route_rejects_missing_token(playwright, base_url):
    ctx = playwright.request.new_context(base_url=base_url)
    response = ctx.post("/translate", data={"text": "Hello", "source_lang": "EN", "target_lang": "FR"})
    assert response.status == 401
    ctx.dispose()


def test_protected_route_rejects_invalid_token(playwright, base_url):
    ctx = playwright.request.new_context(
        base_url=base_url,
        extra_http_headers={"Authorization": "Bearer garbage"},
    )
    response = ctx.post("/translate", data={"text": "Hello", "source_lang": "EN", "target_lang": "FR"})
    assert response.status == 401
    ctx.dispose()


def test_protected_route_accepts_valid_token(playwright, base_url, auth_headers):
    ctx = playwright.request.new_context(base_url=base_url, extra_http_headers=auth_headers)
    response = ctx.post("/translate", data={"text": "Hello", "source_lang": "EN", "target_lang": "FR"})
    assert response.status != 401
    ctx.dispose()
