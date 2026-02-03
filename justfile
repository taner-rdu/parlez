# Justfile for Parlez - a translation practice app
# Run commands with: just <command>

# Install dependencies and setup playwright browsers
setup:
    uv sync
    uv run playwright install

# Start development server with hot reload on http://localhost:8000
dev:
    uv run uvicorn app.main:app --reload

# Run all tests with pytest
test:
    uv run pytest

# Format code with black and auto-fix ruff issues
fmt:
    uv run black .
    uv run ruff check --fix .

# Check code style without making changes
lint:
    uv run ruff check .
    uv run black --check .

# Run tests with coverage report
test-cov:
    uv run pytest --cov=app --cov-report=term-missing

# Clean Python cache files
clean:
    find . -type d -name __pycache__ -exec rm -rf {} +
    find . -type f -name "*.pyc" -delete

# Start database
db-up:
    docker compose up -d

# Stop database
db-down:
    docker compose down

# Stop and remove data (fresh start)
db-reset:
    docker compose down -v
    docker compose up -d

# View logs
db-logs:
    docker compose logs -f postgres

# Connect to psql CLI
db-shell:
    docker compose exec postgres psql -U parlez_user -d parlez
