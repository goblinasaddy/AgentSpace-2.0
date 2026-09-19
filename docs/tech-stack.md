# AgentSpace — Technology Stack

## Frontend

### Next.js + React + TypeScript

Reasons:

- strong full-stack web foundation,
- server rendering,
- routing,
- API integration,
- TypeScript support,
- mature ecosystem.

### Tailwind CSS

Used for design-system implementation and responsive layouts.

### shadcn/ui + Radix UI

Used for accessible, composable primitives.

### TanStack Query

Used where client-side server-state management is useful.

### React Hook Form + Zod

Used for complex forms and runtime validation.

### Lucide

Primary icon library.

### Typography

- Inter — product UI
- JetBrains Mono — code/configuration/logs

## Backend

### TypeScript / Node.js

Use the same language across the primary application and workers.

The initial backend can live within the Next.js application boundary. Worker workloads are separated when asynchronous execution is required.

## Database

### PostgreSQL

Primary relational database.

### Prisma

ORM and schema management.

PostgreSQL is preferred because AgentSpace has strong relationships between:

- users,
- repositories,
- agents,
- versions,
- runs,
- battles,
- contributions,
- verification,
- organizations.

## Authentication

Use the existing authentication solution only if it satisfies the final security model. Otherwise standardize on an authentication layer compatible with the application architecture.

Authentication and authorization must remain separate concepts.

## AI

### Provider abstraction

Gemini is the initial provider, but no domain model should assume Gemini is the only model provider.

The runtime exposes a provider interface.

## Queue

### Redis + BullMQ

Used for:

- executions,
- battles,
- verification jobs,
- evaluations,
- indexing,
- notifications.

## Object storage

### S3-compatible storage

Cloudflare R2 or AWS S3 are suitable implementations.

Store:

- PDFs,
- repository assets,
- large files,
- reports,
- generated artifacts.

## Search

V1:

- PostgreSQL full-text search.

Later:

- pgvector,
- semantic search,
- hybrid retrieval.

## Observability

### Sentry

Application errors.

### PostHog

Product analytics.

### OpenTelemetry

Tracing as the system becomes distributed.

## Testing

### Vitest

Unit and service tests.

### Playwright

End-to-end browser tests.

### Contract tests

For API and runtime boundaries.

## Deployment

Initial target:

- Vercel or equivalent for the web application,
- managed PostgreSQL,
- managed Redis,
- S3-compatible object storage,
- worker deployment appropriate to workload.

Infrastructure should remain portable enough to migrate to AWS/GCP when scale requires it.

## Engineering principle

Choose boring, reliable infrastructure for the foundation and reserve complexity for the parts that create product differentiation: agent runtime, evaluation, verification and discovery.
