import { describe, it, expect } from "vitest";
import { sanitizeErrorMessage, sanitizePayload } from "../../src/infrastructure/security/sanitizer";
import { canTransitionRunStatus, assertValidRunStateTransition } from "../../src/modules/runtime/state-machine";
import { RunStatus } from "@prisma/client";

describe("Phase 7.2 Security Sanitizer & State Machine Unit Tests", () => {
  it("should redact API keys and DB URIs from error messages", () => {
    const rawError = "Failed connecting to postgresql://admin:secret123@localhost:5432/db with key AIzaSyA1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6";
    const sanitized = sanitizeErrorMessage(rawError);
    expect(sanitized).not.toContain("secret123");
    expect(sanitized).not.toContain("AIzaSyA1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6");
    expect(sanitized).toContain("[REDACTED_SECRET]");
  });

  it("should redact sensitive fields in payload objects", () => {
    const payload = {
      apiKey: "secret_api_key_value",
      userInput: {
        password: "mysecretpassword",
        query: "What is AI?",
      },
    };
    const sanitized = sanitizePayload(payload);
    expect(sanitized.apiKey).toBe("[REDACTED_SECRET]");
    expect(sanitized.userInput.password).toBe("[REDACTED_SECRET]");
    expect(sanitized.userInput.query).toBe("What is AI?");
  });

  it("should enforce valid Run state transitions", () => {
    expect(canTransitionRunStatus(RunStatus.QUEUED, RunStatus.RUNNING)).toBe(true);
    expect(canTransitionRunStatus(RunStatus.RUNNING, RunStatus.COMPLETED)).toBe(true);

    // Terminal states cannot transition
    expect(canTransitionRunStatus(RunStatus.COMPLETED, RunStatus.RUNNING)).toBe(false);
    expect(() => assertValidRunStateTransition(RunStatus.COMPLETED, RunStatus.RUNNING)).toThrow();
  });
});
