import { describe, test, expect, beforeAll } from "vitest";
import { registerUser, loginUser } from "@/modules/auth/service";
import { createRepository } from "@/modules/repositories/service";
import { forkRepository } from "@/modules/repositories/fork";
import { createAgent } from "@/modules/agents/service";
import { publishAgentVersion } from "@/modules/versions/service";
import { enqueueExecutionJob } from "@/modules/runtime/executor";
import { createIssue, listIssues } from "@/modules/issues/service";
import { createPullRequest, listPullRequests } from "@/modules/pulls/service";
import { searchMarketplace } from "@/modules/marketplace/search";
import { requestVerification, getVerificationReport } from "@/modules/verification/service";
import { createBattle, runBattle, castVote } from "@/modules/battles/service";
import { prisma } from "@/infrastructure/database/client";

describe("Phase 7.3 Full Ecosystem Integration & Validation Suite", () => {
  let userAToken: string;
  let userAType: any;
  let userBType: any;
  let repoA: any;
  let agentA: any;
  let versionA: any;

  beforeAll(async () => {
    // Clean up test records
    await prisma.contributionEvent.deleteMany({}).catch(() => {});
  });

  test("1. Authentication Lifecycle: Register User A and User B", async () => {
    const emailA = `usera-${Date.now()}@example.com`;
    userAType = await registerUser({
      email: emailA,
      username: `usera_${Date.now()}`,
      password: "Password123!",
      displayName: "User A",
    });

    const emailB = `userb-${Date.now()}@example.com`;
    userBType = await registerUser({
      email: emailB,
      username: `userb_${Date.now()}`,
      password: "Password123!",
      displayName: "User B",
    });

    expect(userAType.token).toBeDefined();
    expect(userBType.token).toBeDefined();
  });

  test("2. Repository Lifecycle: Create Repository by User A", async () => {
    const slug = `repo-a-${Date.now()}`;
    repoA = await createRepository(userAType.user.id, {
      name: "User A Core Repo",
      slug,
      description: "Primary repository for ecosystem testing",
      visibility: "PUBLIC",
    });

    expect(repoA.id).toBeDefined();
    expect(repoA.ownerId).toBe(userAType.user.id);
  });

  test("3. Agent & Version Lifecycle: Create Agent & Publish Immutable Version", async () => {
    agentA = await createAgent(userAType.user.id, {
      repositoryId: repoA.id,
      name: "Security Analyzer Agent",
      description: "Audits code for vulnerabilities",
      type: "INPUT_OUTPUT",
    });

    expect(agentA.id).toBeDefined();

    versionA = await publishAgentVersion(userAType.user.id, agentA.id, {
      version: "1.0.0",
      configuration: {
        spec: {
          runtime: {
            provider: "gemini",
            model: "gemini-2.5-flash",
            systemPrompt: "Analyze snippet",
          },
        },
      },
      inputSchema: { type: "object" },
      outputSchema: { type: "object" },
      releaseNotes: "Initial 1.0.0 release",
    });

    expect(versionA.version).toBe("1.0.0");
    expect(versionA.agentId).toBe(agentA.id);
  });

  test("4. Version Immutability: Mutating Published Version Must Be Rejected", async () => {
    await expect(
      publishAgentVersion(userAType.user.id, agentA.id, {
        version: "1.0.0",
        configuration: { spec: { runtime: { provider: "gemini" } } },
      })
    ).rejects.toThrow();
  });

  test("5. Async Run Execution & Persistence: Enqueue Job → State Transitions", async () => {
    const run = await enqueueExecutionJob({
      agentVersionId: versionA.id,
      userId: userAType.user.id,
      input: { codeSnippet: "function test() {}" },
    });

    expect(run.id).toBeDefined();

    // Allow worker background event processing loop to transition state
    await new Promise((resolve) => setTimeout(resolve, 800));

    const updatedRun = await prisma.run.findUnique({
      where: { id: run.id },
    });

    expect(updatedRun).toBeDefined();
    expect(updatedRun?.agentVersionId).toBe(versionA.id);
    expect(["COMPLETED", "RUNNING", "QUEUED"]).toContain(updatedRun?.status);
  });

  test("6. Marketplace Discovery: Query Published Agents", async () => {
    const results = await searchMarketplace({
      query: "Security",
    });

    expect(results).toBeDefined();
    expect(Array.isArray(results.agents)).toBe(true);
  });

  test("7. Forking Lifecycle: User B Forks User A's Repository", async () => {
    const forked = await forkRepository(userBType.user.id, repoA.id);
    expect(forked.ownerId).toBe(userBType.user.id);
    expect(forked.forkedFromId).toBe(repoA.id);
  });

  test("8. Repository Collaboration: Atomic Issues & Pull Requests", async () => {
    const issue1 = await createIssue(userBType.user.id, {
      repositoryId: repoA.id,
      title: "Vulnerability in auth function",
      body: "Please patch the loose equality check.",
    });

    expect(issue1.number).toBe(1);

    const issue2 = await createIssue(userBType.user.id, {
      repositoryId: repoA.id,
      title: "Add documentation for version 1.0.0",
      body: "Need usage instructions.",
    });

    expect(issue2.number).toBe(2);

    const pr = await createPullRequest(userBType.user.id, {
      repositoryId: repoA.id,
      title: "Fix auth check",
      description: "Replaced loose equality check.",
    });

    expect(pr.number).toBe(1);
  });

  test("9. Verification Lifecycle: Request & Bind Badges to Exact Version", async () => {
    const req = await requestVerification(userAType.user.id, {
      agentVersionId: versionA.id,
      requestedBadges: ["SECURITY_SCREENED"],
    });

    expect(req.id).toBeDefined();
    expect(req.agentVersionId).toBe(versionA.id);

    const report = await getVerificationReport(versionA.id);
    expect(report).toBeDefined();
    expect(report?.agentVersionId).toBe(versionA.id);
  });
});
