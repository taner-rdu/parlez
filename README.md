# \~parlez\~

A French translation practice app. Generate exercises tailored to a topic and
CEFR level, translate them, and get graded, sentence-by-sentence feedback
from Claude — while building up a personal vocabulary list as you go.

<img width="2506" height="1014" alt="image" src="https://github.com/user-attachments/assets/2b2443a0-eb1b-4b43-b0cb-b49e0d537bd7" />

## Features

- **Phrases** — generate English → French translation exercises for any topic
  (e.g. "asking for a table at a restaurant"), CEFR level (A1–C2), and tense.
  Submit a translation and get an AI-graded score with an explanation of what
  was right or wrong.
- **Vocabulaire** — track words you know and words you're learning; sentence
  generation can draw on either list to keep exercises relevant.
- **Traduction** — quick one-off translation via DeepL.
- **Conjugaison** — look up verb conjugations.
- Optional text-to-speech playback of French phrases.

## Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind, React Router
- **Backend**: FastAPI, SQLAlchemy
- **Database**: [Neon](https://neon.tech) (serverless Postgres)
- **External services**: Anthropic (grading/generation), DeepL (translation), Google Cloud TTS
- **Infra**: Pulumi (AWS VPC/IAM), AWS Secrets Manager for all credentials

## Database

Production and CI both connect to a Neon Postgres database. The connection
string lives in AWS Secrets Manager as `parlez/database-url` and is the only
place the backend reads it from (`get_database_url()` in
`backend/app/config.py`) — there is no local env var override.

For local development you have two options:

- Point at your own Neon branch/project by putting the connection string in
  `parlez/database-url` (requires AWS credentials with access to that
  secret), or
- Run a disposable local Postgres instead: `docker-compose.yml` / `just db-up`
  brings one up on `localhost:5432`. Note this only works if you temporarily
  restore an env var read in `config.py`, since the backend currently always
  resolves the URL from Secrets Manager.

Migrations are managed with Alembic (`backend/alembic/`) — run `uv run
alembic upgrade head` from `backend/` against whichever database you're
targeting.

`infrastructure/__main__.py` still provisions an AWS RDS instance from an
earlier iteration of this project (before moving to Neon); it's unused by the
app today.

## Running locally

```bash
just setup      # install backend + frontend dependencies
just backend     # http://localhost:8000
just frontend    # http://localhost:5173
```

All secrets (API key, database URL, Anthropic/DeepL/GCP credentials) are
resolved from AWS Secrets Manager — see `backend/app/config.py`. You'll need
AWS credentials with read access to the `parlez/*` secrets. Requests to the
backend must include the API key as a bearer token.

## Tests

```bash
just test              # backend unit tests
just test-integration  # integration tests (requires backend running)
```
