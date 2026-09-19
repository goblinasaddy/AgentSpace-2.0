# AgentSpace — System Architecture

## 1. Architectural goals

AgentSpace 2.0 must support:

- modular agent execution,
- multiple model providers,
- versioned agent artifacts,
- secure execution,
- asynchronous workloads,
- evaluation,
- verification,
- marketplace discovery,
- API access,
- and future enterprise isolation.

## 2. High-level architecture

```text
                         ┌─────────────────────┐
                         │     Web Client      │
                         │ Next.js / React     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Application API   │
                         │ JWT Auth / RBAC     │
                         │ Rate Limit Guard    │
                         └───────┬─────┬───────┘
                                 │     │
                    ┌────────────┘     └─────────────┐
                    ▼                                ▼
             ┌──────────────┐                ┌──────────────┐
             │ PostgreSQL   │                │ Object Store │
             │ Relational DB│                │ Files/assets │
             └──────────────┘                └──────────────┘

                                 API (202 Accepted)
                                   │
                                   ▼
                         ┌─────────────────────┐
                         │ Queue / Worker Layer│
                         │ Redis + BullMQ      │
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  ▼                 ▼                 ▼
           Runtime Worker     Battle Worker    Verification Worker
           (Sandbox 30s)      (Parallel Runs)  (Security Suite)
                  │                 │                 │
                  ▼                 ▼                 ▼
           Model Providers      Evaluators      Security Sandbox
```

## 3. Application layers

### Presentation layer

Responsible for:

- pages,
- components,
- forms,
- loading/error states,
- accessibility,
- client-side interaction.

### Application layer

Responsible for:

- use cases,
- authorization,
- validation,
- orchestration,
- transactions.

### Domain layer

Responsible for:

- Agent,
- Repository,
- Version,
- Run,
- Battle,
- Verification,
- Contribution,
- User,
- Organization.

Business rules should live here rather than inside UI components.

### Infrastructure layer

Responsible for:

- PostgreSQL,
- object storage,
- Redis,
- model providers,
- email/notifications,
- observability.

## 4. Agent execution architecture

```text
Execution Request
      ↓
Authentication
      ↓
Authorization
      ↓
Load Agent Version
      ↓
Validate Input
      ↓
Create Run
      ↓
Queue Job
      ↓
Agent Runtime
      ↓
Provider Adapter
      ↓
Model / Tools
      ↓
Validate Output
      ↓
Persist Result
      ↓
Return Result
```

## 5. Provider abstraction

The runtime must not directly depend on one model vendor.

```text
Agent Runtime
     ↓
ModelProvider interface
     ├── GeminiProvider
     ├── OpenAIProvider
     ├── AnthropicProvider
     └── FutureProvider
```

Agent configuration references a provider/model capability without coupling the domain model to one SDK.

## 6. Asynchronous workloads

Use the queue for:

- long-running agent runs,
- battles,
- evaluations,
- verification,
- indexing,
- notifications,
- analytics aggregation.

Short CRUD operations can remain synchronous.

## 7. Repository architecture

An AgentSpace repository is a logical software artifact.

```text
Repository
 ├── Agent
 │    ├── Version
 │    ├── Configuration
 │    ├── Files
 │    └── Evaluations
 ├── Issues
 ├── Pull Requests
 ├── Fork lineage
 └── Activity
```

## 8. Verification architecture

Verification is tied to a specific artifact version.

```text
Artifact Version
      ↓
Verification Request
      ↓
Security Gate
      ↓
Selected Verification Methodologies
      ↓
Verification Tests
      ↓
Evidence
      ↓
Verification Result
      ↓
Badge + Report
```

## 9. Trust boundaries

Untrusted content includes:

- user-submitted agent files,
- prompts,
- tool definitions,
- repository files,
- uploaded documents,
- external URLs,
- model-generated code.

Untrusted agent code must never execute inside the main application process.

## 10. Scaling strategy

V1 should use modular services without premature microservice complexity.

Start with:

- one Next.js application,
- one worker application,
- PostgreSQL,
- Redis,
- object storage.

Extract dedicated services only when workload, isolation, or operational requirements justify them.
