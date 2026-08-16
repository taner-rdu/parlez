# \~parlez\~

A French translation practice app. Generate exercises tailored to a topic and
CEFR level, translate them, and get graded, sentence-by-sentence feedback
from Claude — while building up a personal vocabulary list as you go.

<img width="2506" height="1014" alt="image" src="https://github.com/user-attachments/assets/2b2443a0-eb1b-4b43-b0cb-b49e0d537bd7" />

<img width="2538" height="696" alt="image" src="https://github.com/user-attachments/assets/9c7e1760-822e-454c-a036-1092f103b6f7" />


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

Single-user right now, authenticated with a static API key. Not yet deployed
publicly — planned once OAuth is in place.
