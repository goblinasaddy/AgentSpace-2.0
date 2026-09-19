import { z } from "zod";
import { prisma } from "@/infrastructure/database/client";
import { PullRequestStatus } from "@prisma/client";

export const CreatePullRequestSchema = z.object({
  repositoryId: z.string().min(1),
  sourceRepoId: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  description: z.string().optional(),
});

export type CreatePullRequestInput = z.infer<typeof CreatePullRequestSchema>;

export async function createPullRequest(userId: string, input: CreatePullRequestInput) {
  const validated = CreatePullRequestSchema.parse(input);

  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      const pr = await prisma.$transaction(async (tx) => {
        const highestPR = await tx.pullRequest.findFirst({
          where: { repositoryId: validated.repositoryId },
          orderBy: { number: "desc" },
          select: { number: true },
        });

        const nextNumber = (highestPR?.number || 0) + 1;

        const created = await tx.pullRequest.create({
          data: {
            repositoryId: validated.repositoryId,
            authorId: userId,
            sourceRepoId: validated.sourceRepoId,
            number: nextNumber,
            title: validated.title,
            description: validated.description,
            status: PullRequestStatus.OPEN,
          },
          include: {
            author: {
              select: { id: true, username: true, displayName: true, avatarUrl: true },
            },
          },
        });

        await tx.contributionEvent.create({
          data: {
            userId,
            repositoryId: validated.repositoryId,
            eventType: "PR_CREATED",
            metadata: { prId: created.id, prNumber: nextNumber },
          },
        });

        return created;
      });

      return pr;
    } catch (err: any) {
      if (err.code === "P2002" && attempts < maxAttempts) {
        continue;
      }
      throw err;
    }
  }

  throw new Error("Failed to create Pull Request due to high concurrency. Please try again.");
}

export async function listPullRequests(repositoryId: string, status?: PullRequestStatus) {
  return prisma.pullRequest.findMany({
    where: {
      repositoryId,
      ...(status ? { status } : {}),
    },
    include: {
      author: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      sourceRepo: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function mergePullRequest(userId: string, pullRequestId: string) {
  const pr = await prisma.pullRequest.findUnique({
    where: { id: pullRequestId },
    include: { repository: true },
  });

  if (!pr) {
    throw new Error("Pull Request not found.");
  }

  if (pr.repository.ownerId !== userId) {
    throw new Error("Unauthorized: Only the repository owner can merge pull requests.");
  }

  if (pr.status !== PullRequestStatus.OPEN) {
    throw new Error(`Cannot merge a pull request that is already ${pr.status.toLowerCase()}.`);
  }

  const merged = await prisma.$transaction(async (tx) => {
    const updated = await tx.pullRequest.update({
      where: { id: pullRequestId },
      data: { status: PullRequestStatus.MERGED },
    });

    await tx.contributionEvent.create({
      data: {
        userId,
        repositoryId: pr.repositoryId,
        eventType: "PR_MERGED",
        metadata: { prId: pr.id, prNumber: pr.number },
      },
    });

    return updated;
  });

  return merged;
}
