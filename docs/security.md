# AgentSpace — Security Architecture

## Security objective

AgentSpace must protect:

- user accounts,
- agent source/configuration,
- credentials,
- uploaded documents,
- execution infrastructure,
- model/API keys,
- private repositories,
- enterprise data.

## Core principle

> **Never execute untrusted agent code inside the main web application process.**

## Threat categories

### 1. Malicious agent code

Potential arbitrary code execution.

Mitigation:

- sandboxing,
- restricted permissions,
- execution timeout,
- CPU/memory limits,
- network policy,
- ephemeral environments.

### 2. Credential theft

Mitigation:

- secret manager,
- never expose provider keys to agents unless explicitly authorized,
- redact secrets from logs,
- short-lived credentials where possible.

### 3. Prompt injection

Treat external documents, web content and tool outputs as untrusted input.

Agents must not automatically inherit authority from untrusted content.

### 4. Repository abuse

Mitigation:

- authorization,
- ownership checks,
- rate limiting,
- audit events,
- validation.

### 5. File uploads

Mitigation:

- type validation,
- size limits,
- malware/security scanning where appropriate,
- isolated processing,
- no direct execution.

### 6. Denial of service

Mitigation:

- rate limits,
- quotas,
- queue limits,
- execution timeouts,
- concurrency limits.

## Secrets

Secrets must not be stored in:

- source code,
- agent.yaml,
- README,
- database plaintext fields,
- client-side bundles,
- logs.

## Verification security

Security screening itself must run in an isolated environment.

A malicious artifact must not be able to compromise the verification worker.

## Auditability

Security-sensitive actions should generate audit events:

- login/security changes,
- permission changes,
- repository visibility changes,
- agent publication,
- verification,
- API key operations,
- organization membership changes.

## Security is not a guarantee

Verification results should state the methodology and limitations.

AgentSpace must not claim that passing a screening means an artifact is universally safe.
