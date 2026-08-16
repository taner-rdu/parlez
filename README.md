# ~parlez~

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
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **External services**: Anthropic (grading/generation), DeepL (translation), Google Cloud TTS
- **Infra**: Pulumi (AWS RDS/VPC), AWS Secrets Manager for all credentials

## Running locally

```bash
just setup      # install backend + frontend dependencies
just db-up       # start Postgres (or point DATABASE_URL at your own instance)
just backend     # http://localhost:8000
just frontend    # http://localhost:5173
```

All secrets (API key, database URL, Anthropic/DeepL/GCP credentials) are
resolved from AWS Secrets Manager — see `backend/app/config.py`. Requests to
the backend must include the API key as a bearer token.

## Tests

```bash
just test              # backend unit tests
just test-integration  # integration tests (requires backend running)
```
