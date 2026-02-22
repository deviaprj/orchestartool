# OrchestraTool

**OrchestraTool** is a meta-orchestration system that generates multi-agent architecture configurations and Agile project structures.  It produces specialised agent instruction files that delegate work to an autonomous coding agent ("Super Codex").

## Core concept

```
User Request → Clarification Questions → Agent Architecture (JSON/YAML) → Agile Backlog → Task Delegation
```

The tool follows a mandatory three-phase approach:

| Phase | Name | What happens |
|---|---|---|
| 1 | **Interrogation** | Ask clarifying questions before generating anything |
| 2 | **Architecture & Configuration** | Output a structured YAML/JSON config defining each agent |
| 3 | **Agile Backlog & Delegation** | Break work into User Stories and Technical Tasks |

See [`orchestrator_blueprint.md`](./orchestrator_blueprint.md) for the full prompt template.

## Repository layout

```
orchestartool/
├── orchestrator_blueprint.md      # Core prompt / blueprint (Phase 1-3)
├── marketplace-architecture.yaml  # Example: 7-agent marketplace config
├── marketplace-backlog.md         # Example: full Agile backlog
└── marketplace-yoojo/             # Example generated application (Next.js)
```

## Quick start – example app (`marketplace-yoojo`)

The `marketplace-yoojo` directory is a fully generated Next.js marketplace application produced by the OrchestraTool workflow.

### Prerequisites

- Node.js ≥ 18
- PostgreSQL ≥ 14  *(or use the Docker Compose setup below)*

### Local setup

```bash
cd marketplace-yoojo
bash setup.sh          # installs deps, copies .env.example, runs DB migrations
npm run dev            # start dev server → http://localhost:3000
```

### Container setup (Docker Compose)

```bash
cd marketplace-yoojo
cp .env.example .env   # review and edit values
docker compose up --build
```

The app is available at `http://localhost:3000`.  
PostgreSQL data is persisted in the `postgres_data` Docker volume.

### Environment variables

Copy `.env.example` to `.env` and configure at minimum:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Random secret for JWT signing |
| `STRIPE_SECRET_KEY` | optional | Stripe payments (test mode) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | optional | Geolocation features |

## Using OrchestraTool for your own project

1. Open `orchestrator_blueprint.md` in your AI assistant (Copilot Chat, Claude, etc.).
2. Replace `[INSÉRER TON PROJET ICI]` with your project description.
3. The assistant will ask Phase 1 questions — answer them.
4. It will then generate a YAML agent config (Phase 2) and an Agile backlog (Phase 3).
5. Feed the generated config back to your coding agent to implement the project.

## Agent configuration format

Each agent in the generated YAML follows this schema:

```yaml
agents:
  - role: "Brief description"
    persona: "Personality and communication style"
    system_instructions: |
      Detailed operational guidelines…
    output_format: "Expected output structure"
```

## Development notes

- Logging: the app uses a structured logger (`src/lib/logger.ts`) that outputs JSON in production and human-readable text in development.
- Error handling: centralised helpers live in `src/lib/errors.ts`.
- Environment validation: `src/lib/env.ts` validates required variables at startup and fails fast with a clear message if any are missing.

