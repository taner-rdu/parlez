def test_health_check_does_not_require_auth(playwright):
    ctx = playwright.request.new_context(base_url="http://localhost:8000")
    response = ctx.get("/health")
    assert response.status == 200
    ctx.dispose()


def test_protected_route_rejects_missing_token(playwright):
    ctx = playwright.request.new_context(base_url="http://localhost:8000")
    response = ctx.post("/translate", data={"text": "Hello", "source_lang": "EN", "target_lang": "FR"})
    assert response.status == 401
    ctx.dispose()


def test_protected_route_rejects_invalid_token(playwright):
    ctx = playwright.request.new_context(
        base_url="http://localhost:8000",
        extra_http_headers={"Authorization": "Bearer garbage"},
    )
    response = ctx.post("/translate", data={"text": "Hello", "source_lang": "EN", "target_lang": "FR"})
    assert response.status == 401
    ctx.dispose()


def test_protected_route_accepts_valid_token(playwright, auth_headers):
    ctx = playwright.request.new_context(base_url="http://localhost:8000", extra_http_headers=auth_headers)
    response = ctx.post("/translate", data={"text": "Hello", "source_lang": "EN", "target_lang": "FR"})
    assert response.status != 401
    ctx.dispose()
