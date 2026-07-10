# Contributing to SysLab

Thank you for your interest in contributing! This document explains how to get the project running locally, the conventions we follow, and how to submit changes.

---

## Development Setup

### Prerequisites

- **Node.js** ≥ 20 (we use 24 in production)
- **pnpm** ≥ 9
- **PostgreSQL** ≥ 15

### Steps

```bash
git clone https://github.com/Sriyamalhar/syslab-app.git
cd syslab
pnpm install

# Set up environment
cp .env.example .env
# Edit .env — fill in DATABASE_URL and SESSION_SECRET

# Push schema to your local database
pnpm --filter @workspace/db run push

# Run both servers (separate terminals)
pnpm --filter @workspace/api-server run dev   # :8080
pnpm --filter @workspace/syslab run dev       # :5173
```

---

## Monorepo Layout

This is a pnpm workspace monorepo. All packages live under `artifacts/` or `lib/`.

| Package | Path | Purpose |
|---|---|---|
| `@workspace/syslab` | `artifacts/syslab` | React + Vite frontend |
| `@workspace/api-server` | `artifacts/api-server` | Express API backend |
| `@workspace/api-spec` | `lib/api-spec` | OpenAPI 3.1 spec + codegen |
| `@workspace/api-client-react` | `lib/api-client-react` | Generated React Query hooks |
| `@workspace/api-zod` | `lib/api-zod` | Generated Zod schemas |
| `@workspace/db` | `lib/db` | Drizzle ORM schema + push script |

---

## Common Tasks

### Add an API endpoint

1. Edit `lib/api-spec/openapi.yaml`
2. Run `pnpm --filter @workspace/api-spec run codegen`
3. Implement the route in `artifacts/api-server/src/routes/`
4. Use the generated hook in the frontend

### Add a node type

1. Add an entry to `NodeCategory` in `artifacts/syslab/src/types/canvas.ts`
2. Add defaults to `artifacts/syslab/src/simulation/nodeDefaults.ts`
3. Register icon + color mappings in `artifacts/syslab/src/components/canvas/NodeTypes.tsx`
4. Add the node to the palette in `NodePalette.tsx`

### Add a chaos mode

1. Add the type to `activeChaos` in `artifacts/syslab/src/store/useSimulationStore.ts`
2. Implement its effect in `artifacts/syslab/src/simulation/engine.ts`
3. Add a button to `artifacts/syslab/src/components/canvas/ChaosPanel.tsx`

### Database schema changes

1. Edit `lib/db/src/schema/`
2. Run `pnpm --filter @workspace/db run push` to apply to dev DB
3. Commit the schema file — Drizzle Kit handles migration state

---

## Code Style

- **TypeScript** — strict mode, no `any` unless cast explicitly and commented
- **Naming** — PascalCase for components, camelCase for functions and variables, SCREAMING_SNAKE for enum values
- **Imports** — absolute (`@/components/...`) inside `syslab`, workspace-relative (`@workspace/...`) across packages
- **Components** — prefer named exports, co-locate styles in Tailwind classes
- **Commits** — use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`

---

## Pull Requests

1. Fork the repo and create a branch: `git checkout -b feat/my-feature`
2. Make your changes with clear, focused commits
3. Run `pnpm run typecheck` — it must pass with no errors
4. Open a PR against `main` with a description of what changed and why
5. Add screenshots if it's a UI change

---

## Reporting Issues

Open a GitHub issue with:
- What you expected
- What happened instead
- Steps to reproduce
- Browser / OS / Node version if relevant
