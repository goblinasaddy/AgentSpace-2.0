# AgentSpace — Data Model

## Core entities

### User

Represents an authenticated person.

Key fields:

- id
- username
- display_name
- email
- avatar_url
- bio
- website
- created_at
- updated_at

### Organization

Represents a team/company.

Key fields:

- id
- name
- slug
- description
- owner_id
- visibility
- created_at

### Repository

The top-level container for an agent project.

Key fields:

- id
- owner_id
- organization_id
- name
- slug
- description
- visibility
- default_branch/version
- forked_from_repository_id
- created_at
- updated_at

### Agent

Represents the logical agent within a repository.

Key fields:

- id
- repository_id
- name
- description
- type
- status
- created_at
- updated_at

### AgentVersion

Immutable published version of an agent.

Key fields:

- id
- agent_id
- version
- configuration
- input_schema
- output_schema
- release_notes
- published_by
- published_at

### AgentFile

A versioned file/artifact belonging to an agent version.

### Run

Represents one execution.

Key fields:

- id
- agent_version_id
- user_id
- input
- output
- model_provider
- model_name
- status
- latency_ms
- input_tokens
- output_tokens
- estimated_cost
- error_code
- created_at

### Battle

Represents a comparison session.

Key fields:

- id
- creator_id
- challenge
- status
- created_at
- completed_at

### BattleParticipant

Connects an agent version to a battle.

### BattleResult

Stores output and evaluation data for a participant.

### Vote

Stores a user's preference in an eligible battle.

### Star

Represents a user's star on a repository/agent.

### Fork

Can be represented through repository.forked_from_repository_id plus audit events.

### Issue

Repository issue.

### PullRequest

Contribution proposal between repository/version states.

### ContributionEvent

Immutable activity event used to build contribution history and analytics.

### VerificationRequest

Request to verify a specific artifact version.

### VerificationRun

Execution of a verification methodology.

### VerificationTest

Individual test/check inside a verification run.

### VerificationResult

Outcome and evidence for a test or methodology.

### VerificationBadge

Issued badge tied to an artifact version and verification result.

### VerificationReport

Human-readable evidence package.

### Category

Marketplace classification.

### Tag

Flexible discovery metadata.

## Important relationships

```text
User
 ├── owns → Repository
 ├── creates → AgentVersion
 ├── performs → Run
 ├── creates → Battle
 ├── votes → Battle
 └── contributes → PullRequest

Repository
 ├── contains → Agent
 ├── has → Issues
 ├── has → PullRequests
 └── may fork from → Repository

Agent
 └── has many → AgentVersion

AgentVersion
 ├── produces → Runs
 ├── participates in → Battles
 └── has → VerificationRequests

VerificationRequest
 └── produces → VerificationRun
                         ↓
                  VerificationResults
                         ↓
                  VerificationBadge
                         ↓
                  VerificationReport
```

## Data rules

1. Published agent versions are immutable.
2. Verification always references a specific artifact version.
3. Runs always reference a specific agent version.
4. Authorization must be checked before repository mutation.
5. Activity events should be append-only.
6. Deleting public artifacts should generally be soft deletion/archival rather than destructive deletion.
7. Sensitive credentials must never be stored as plain repository content.
