import pytest


def pytest_addoption(parser):
    parser.addoption("--api-token", action="store", default=None, help="API key for authenticated requests")


@pytest.fixture
def auth_headers(request):
    token = request.config.getoption("--api-token")
    if not token:
        pytest.fail("--api-token is required to run authenticated integration tests")
    return {"Authorization": f"Bearer {token}"}
