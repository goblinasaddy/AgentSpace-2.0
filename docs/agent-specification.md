# AgentSpace Agent Specification

## Purpose

The AgentSpace Agent Specification defines the canonical representation of an agent so that agents can be discovered, executed, evaluated, versioned and verified consistently.

The specification is intentionally provider-agnostic.

## Conceptual structure

```yaml
name: example-agent
version: 1.0.0

description: Short description

type: input-output

runtime:
  provider: gemini
  model: <model>

input:
  schema: ...

output:
  schema: ...

capabilities:
  - text-generation

tools:
  - ...

permissions:
  network: false
  filesystem: false

evaluation:
  test_cases:
    - ...

metadata:
  categories:
    - coding
  tags:
    - debugging
```

## Required concepts

Every publishable agent should define:

- identity,
- description,
- version,
- input contract,
- output contract,
- runtime requirements,
- capabilities,
- permissions,
- ownership,
- visibility.

## Agent types

Initial types:

- Chat
- Input/Output
- Tool
- Workflow

Future types:

- MCP
- Multi-agent
- Autonomous workflow

## Input/output contracts

Agents should expose structured schemas whenever practical.

This allows AgentSpace to:

- validate requests,
- generate UI forms,
- evaluate outputs,
- integrate through API,
- and compare agents.

## Capabilities

Capabilities describe what an agent can do.

Examples:

- web_search
- code_execution
- file_processing
- vision
- retrieval
- browser
- structured_output

Capabilities are descriptive and must not automatically imply that an agent is trustworthy.

## Permissions

Permissions describe potentially sensitive access.

Examples:

- network
- filesystem
- browser
- credentials
- external APIs

Permissions are relevant to Security Screening.

## Versioning

Use semantic versioning where applicable:

```text
MAJOR.MINOR.PATCH
```

A published version should be immutable.

Changes create a new version.
