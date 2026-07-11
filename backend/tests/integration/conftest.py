import pytest

from tests.utils.mint_token import mint_token


def pytest_addoption(parser):
    parser.addoption("--api-token", action="store", default=None, help="Bearer token for API auth")


@pytest.fixture
def auth_headers(request):
    token = request.config.getoption("--api-token") or mint_token("default@parlez.dev", 24)
    return {"Authorization": f"Bearer {token}"}
