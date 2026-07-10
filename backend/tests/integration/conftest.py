import pytest


def pytest_addoption(parser):
    parser.addoption("--api-token", action="store", default=None, help="Bearer token for API auth")


@pytest.fixture
def auth_headers(request):
    token = request.config.getoption("--api-token")
    return {"Authorization": f"Bearer {token}"}
