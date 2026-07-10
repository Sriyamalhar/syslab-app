# SysLab

> **Build. Break. Scale.** — An interactive distributed systems playground for engineers who want to understand modern architectures by designing them, simulating traffic through them, and injecting failures to see what breaks.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24-green)](https://nodejs.org/)

---

## What is SysLab?

SysLab is a visual systems design tool that lets you:

- **Design** multi-tier, microservice, and event-driven architectures on an interactive canvas
- **Simulate** realistic traffic propagation with concurrency, queueing, and latency modeling
- **Break things** with Chaos Engineering — kill servers, crash databases, inject network partitions, and watch your system respond in real time
- **Monitor** every node with live dashboards — requests/sec, CPU, latency, error rate, and health

It's a portfolio/learning tool built to mirror the kinds of systems you'd design in a senior engineering interview or an SRE runbook, made tangible and interactive.

---

## Screenshots

| Landing | Dashboard | Canvas Editor |
|---|---|---|
| ![Landing](docs/screenshots/landing.png) | ![Dashboard](docs/screenshots/dashboard.png) | ![Canvas](docs/screenshots/canvas.png) |

| Simulation Running | Chaos Panel | Monitoring |
|---|---|---|
| ![Simulation](docs/screenshots/simulation.png) | ![Chaos](docs/screenshots/chaos.png) | ![Monitoring](docs/screenshots/monitoring.png) |

---

## Features

### Interactive Canvas
- 40+ node types across 11 categories: Client Layer, Networking, Auth, Services, Processing, Data, Storage, Messaging, Infrastructure, External, Observability
- Drag-and-drop from a categorized palette, drag-to-connect edges
- Infinite pan and zoom, snap-to-grid
- Undo / redo (full history stack)
- Copy / paste nodes
- Export canvas as JSON, import from JSON
- Autosave with debounce to backend

### Simulation Engine
- Click **Run** to start a 500ms tick loop propagating requests through your topology
- Each node models: capacity limits, processing time, queue length, CPU utilization
- Traffic fans out across outgoing edges with realistic distribution
- Requests that hit failed or overloaded nodes are dropped and counted toward error rate

### Chaos Engineering Panel
| Failure Mode | Effect |
|---|---|
| Kill Server | Target node → 100% failure |
| Crash DB | All DATA-category nodes fail |
| Disconnect Network | Drops all in-flight packets |
| High Latency | 8× processing time on target |
| Packet Loss | Probabilistic request drops |
| Cache Failure | Redis/Cache nodes fail |
| DNS Failure | DNS nodes fail |
| Auth Failure | All Auth-category nodes fail |
| API Timeout | All requests to target time out |

### Monitoring Dashboard
- Live charts (Recharts): requests/sec, CPU %, latency, success rate
- Per-node health table with last-tick metrics
- Aggregated system-wide stats in header

### Project Management
- Create, rename, duplicate, delete projects
- Four starter templates: Microservices, Event-Driven, Three-Tier, Kubernetes
- JWT auth — register and log in, data persisted per user

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, TypeScript |
| Styling | Tailwind CSS v4, Framer Motion |
| Canvas | React Flow v12 (`@xyflow/react`) |
| State | Zustand |
| Charts | Recharts |
| Routing | Wouter |
| API client | Orval-generated React Query hooks |
| Backend | Express 5, Node.js 24 |
| Auth | JWT (`jsonwebtoken`), bcrypt (`bcryptjs`) |
| Database | PostgreSQL, Drizzle ORM |
| Validation | Zod v4, drizzle-zod |
| Monorepo | pnpm workspaces |
| API spec | OpenAPI 3.1 (single source of truth) |

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9
- PostgreSQL database

### Setup

```bash
# Clone
git clone https://github.com/Sriyamalhar/syslab-app.git
cd syslab

# Install dependencies
pnpm install

# Build shared libraries
pnpm run typecheck

# Set environment variables
cp .env.example .env
# Fill in DATABASE_URL and SESSION_SECRET

# Push database schema
pnpm --filter @workspace/db run push

# Start both servers (two terminals)
pnpm --filter @workspace/api-server run dev   # API on :8080
pnpm --filter @workspace/syslab run dev       # Frontend on :5173
```

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgres://user:pass@localhost:5432/syslab` |
| `SESSION_SECRET` | Secret used to sign JWTs — any long random string |

---

## Project Structure

```
.
├── artifacts/
│   ├── syslab/                  # React + Vite frontend
│   │   └── src/
│   │       ├── components/
│   │       │   ├── canvas/      # React Flow canvas, node types, chaos, monitoring
│   │       │   ├── landing/     # Landing page sections
│   │       │   ├── layout/      # Navbar, Sidebar, Footer
│   │       │   └── ui/          # shadcn/ui primitives
│   │       ├── pages/           # Landing, Login, Register, Dashboard, Editor
│   │       ├── simulation/      # Simulation engine & node defaults
│   │       ├── store/           # Zustand stores (canvas, simulation, auth)
│   │       └── types/           # Canvas type definitions
│   └── api-server/              # Express API
│       └── src/
│           ├── routes/          # auth, projects, health
│           └── middlewares/     # JWT auth
├── lib/
│   ├── api-spec/
│   │   └── openapi.yaml         # OpenAPI 3.1 spec (source of truth)
│   ├── api-client-react/        # Orval-generated React Query hooks
│   ├── api-zod/                 # Orval-generated Zod schemas
│   └── db/                      # Drizzle schema & migrations
└── pnpm-workspace.yaml
```

---

## API

All routes are prefixed `/api`.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Sign in, receive JWT |
| GET | `/api/auth/me` | ✓ | Current user |
| GET | `/api/projects` | ✓ | List user's projects |
| POST | `/api/projects` | ✓ | Create project (blank or from template) |
| GET | `/api/projects/:id` | ✓ | Get project |
| PATCH | `/api/projects/:id` | ✓ | Update title / canvas data |
| DELETE | `/api/projects/:id` | ✓ | Delete project |
| POST | `/api/projects/:id/duplicate` | ✓ | Duplicate project |

Regenerate the API client after spec changes:
```bash
pnpm --filter @workspace/api-spec run codegen
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

[MIT](LICENSE) © 2026 Sriyamalhar
