# AgentSpace Verification

> **Trust before you install.**

## Purpose

AgentSpace Verification provides evidence-based trust signals for agents, tools, skills and MCP servers.

It answers:

> **What claims about this artifact have actually been verified?**

It does not attempt to produce a universal quality score.

## Verification principles

1. Security screening is mandatory.
2. Additional verification capabilities are optional.
3. Every badge represents a specific methodology.
4. Verification is version-specific.
5. Reports contain methodology, evidence and limitations.
6. Verification is separate from popularity/reputation.
7. A badge does not guarantee an artifact is universally safe or useful.

## Initial badges

### Security Screened

The artifact passed the defined AgentSpace security screening methodology.

### Reliability Verified

The artifact demonstrated the claimed functionality according to the defined reliability methodology.

### Privacy Verified

Declared data handling was examined against applicable verification requirements.

### Compatibility Verified

The artifact was tested against claimed environments/platforms.

### Performance Verified

The artifact was tested against defined performance criteria.

## Verification lifecycle

```text
Submit artifact version
        ↓
Mandatory security screening
        ↓
Pass?
  ┌─────┴─────┐
  No          Yes
  ↓            ↓
Stop       Select additional
           methodologies
                ↓
          Execute tests
                ↓
          Collect evidence
                ↓
          Generate report
                ↓
          Issue badges
```

## Version specificity

A badge belongs to an exact artifact version.

Example:

```text
ResearchAgent v2.1.4
✓ Security Screened
✓ Reliability Verified
```

When v2.2.0 is released, previous badges do not automatically transfer.

## Verification report

Every verification should retain:

- artifact identity,
- artifact version,
- verification date,
- methodology version,
- environment,
- tests,
- results,
- evidence,
- limitations,
- verifier/system identity.

## User experience

Simple layer:

```text
🛡 Security Screened
✓ Reliability Verified
✓ Compatibility Verified
```

Detailed layer:

```text
View Verification Report
```

The detailed report provides technical evidence without forcing every user to read it.

## External verification API

Future versions should expose verification results to external ecosystems.

Potential consumers:

- GitHub,
- developer tools,
- MCP directories,
- CI/CD,
- enterprise software catalogs,
- IDEs,
- agent runtimes.

## Verification and reputation

These are intentionally separate.

Reputation answers:

> "How is this artifact perceived/used by the community?"

Verification answers:

> "What has AgentSpace actually tested according to a defined methodology?"
