# Justfile for Parlez - a translation practice app
# Run commands with: just <command>

# Install all dependencies
setup:
    cd backend && uv sync
    cd backend && uv run playwright install
    cd frontend && npm install
    cd backend/tests && npm install

# Start backend dev server on http://localhost:8000
backend:
    cd backend && uv run uvicorn app.main:app --reload

# Start frontend dev server on http://localhost:5173
frontend:
    cd frontend && npm run dev

# Run backend unit tests
test:
    cd backend && uv run pytest

# Run integration tests (requires backend running on localhost:8000)
test-integration:
    cd backend/tests && npx playwright test

# Format backend code
fmt:
    cd backend && uv run black .
    cd backend && uv run ruff check --fix .

# Lint backend code
lint:
    cd backend && uv run ruff check .
    cd backend && uv run black --check .

# Run tests with coverage
test-cov:
    cd backend && uv run pytest --cov=app --cov-report=term-missing

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
