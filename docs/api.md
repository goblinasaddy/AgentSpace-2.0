# AgentSpace API

## API principles

- RESTful resource boundaries for V1.
- JSON request/response bodies.
- Versioned API namespace.
- Authentication required for private/user-owned resources.
- Explicit authorization on every mutation.
- Zod/domain validation at boundaries.
- Stable error format.

## Base path

```text
/api/v1
```

## Initial resource groups

### Authentication

Handled by the authentication layer.

### Users

```text
GET    /users/:username
PATCH  /users/me
```

### Repositories

```text
POST   /repositories
GET    /repositories/:owner/:repo
PATCH  /repositories/:owner/:repo
DELETE /repositories/:owner/:repo
```

### Agents

```text
GET    /agents
GET    /agents/:id
POST   /repositories/:repo/agents
PATCH  /agents/:id
```

### Versions

```text
GET    /agents/:id/versions
POST   /agents/:id/versions
GET    /agents/:id/versions/:version
```

### Runs

```text
POST   /agents/:id/runs
GET    /runs/:id
GET    /agents/:id/runs
```

### Battles

```text
POST   /battles
GET    /battles/:id
POST   /battles/:id/run
POST   /battles/:id/votes
```

### Verification

```text
POST   /verification/requests
GET    /verification/requests/:id
GET    /agents/:id/verification
GET    /verification/reports/:id
```

### Social/repository

```text
POST   /repositories/:id/stars
DELETE /repositories/:id/stars

POST   /repositories/:id/forks

GET    /repositories/:id/issues
POST   /repositories/:id/issues

GET    /repositories/:id/pulls
POST   /repositories/:id/pulls
```

## Standard response shape

Successful responses should remain consistent.

Example:

```json
{
  "data": {},
  "meta": {}
}
```

## Standard error shape

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request is invalid.",
    "details": []
  }
}
```

Do not expose stack traces or internal provider errors to clients.

## Runtime API principle

The public API should not expose internal model-provider implementation details unless explicitly requested.

A consumer should interact with an AgentSpace agent, not with Gemini/OpenAI/other provider-specific execution logic.
