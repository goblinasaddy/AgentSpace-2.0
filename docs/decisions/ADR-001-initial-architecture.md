# ADR-001: Initial AgentSpace Architecture

## Status

Accepted

## Context

AgentSpace needs to evolve from a Hackathon prototype into a production-oriented platform supporting repositories, agent execution, evaluation, verification and future enterprise workloads.

The system needs strong domain modeling without prematurely creating a large microservice architecture.

## Decision

Use a modular full-stack architecture initially:

- Next.js + React + TypeScript for web and application API.
- PostgreSQL for relational domain data.
- Prisma for database access/schema management.
- Redis + BullMQ for asynchronous jobs.
- S3-compatible object storage for large artifacts.
- Separate worker process for execution/evaluation/verification jobs.
- Provider abstraction for AI model integrations.

## Rationale

This gives the team:

- fast development,
- one primary language,
- strong relational data support,
- asynchronous execution,
- clear security boundaries,
- and a path to extract services later.

## Consequences

Positive:

- lower operational complexity,
- fast iteration,
- strong type sharing,
- straightforward local development.

Negative:

- some boundaries must be enforced through code conventions initially,
- high-scale workloads may eventually require service extraction.

## Revisit when

Extract dedicated services when one or more of these becomes true:

- independent scaling is required,
- security isolation requires it,
- deployment frequency creates operational problems,
- runtime workloads materially differ from web workloads,
- enterprise isolation requirements demand dedicated infrastructure.
