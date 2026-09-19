import { prisma } from "@/infrastructure/database/client";

export class ForbiddenError extends Error {
  constructor(message = "Forbidden: Access denied") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function assertRepoAccess(userId: string | null, repositoryId: string) {
  const repo = await prisma.repository.findUnique({
    where: { id: repositoryId },
  });

  if (!repo) {
    throw new Error("Repository not found.");
  }

  if (repo.visibility === "PUBLIC") {
    return repo;
  }

  if (!userId || repo.ownerId !== userId) {
    throw new ForbiddenError("Forbidden: You do not have access to this private repository.");
  }

  return repo;
}

export async function assertRepoOwner(userId: string, repositoryId: string) {
  const repo = await prisma.repository.findUnique({
    where: { id: repositoryId },
  });

  if (!repo) {
    throw new Error("Repository not found.");
  }

  if (repo.ownerId !== userId) {
    throw new ForbiddenError("Forbidden: You do not own this repository.");
  }

  return repo;
}

export async function assertAgentAccess(userId: string | null, agentId: string) {
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    include: { repository: true },
  });

  if (!agent) {
    throw new Error("Agent not found.");
  }

  await assertRepoAccess(userId, agent.repositoryId);
  return agent;
}

export async function assertRunAccess(userId: string | null, runId: string) {
  const run = await prisma.run.findUnique({
    where: { id: runId },
    include: {
      agentVersion: {
        include: {
          agent: {
            include: { repository: true },
          },
        },
      },
    },
  });

  if (!run) {
    throw new Error("Run record not found.");
  }

  // Check if owner of run or owner of private repository
  if (run.userId === userId) {
    return run;
  }

  await assertRepoAccess(userId, run.agentVersion.agent.repositoryId);
  return run;
}
