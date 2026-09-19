import { z } from "zod";
import { prisma } from "@/infrastructure/database/client";
import { IssueStatus } from "@prisma/client";

export const CreateIssueSchema = z.object({
  repositoryId: z.string().min(1),
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  body: z.string().min(1, "Body is required"),
});

export type CreateIssueInput = z.infer<typeof CreateIssueSchema>;

export async function createIssue(userId: string, input: CreateIssueInput) {
  const validated = CreateIssueSchema.parse(input);

  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      const issue = await prisma.$transaction(async (tx) => {
        const highestIssue = await tx.issue.findFirst({
          where: { repositoryId: validated.repositoryId },
          orderBy: { number: "desc" },
          select: { number: true },
        });

        const nextNumber = (highestIssue?.number || 0) + 1;

        const created = await tx.issue.create({
          data: {
            repositoryId: validated.repositoryId,
            authorId: userId,
            number: nextNumber,
            title: validated.title,
            body: validated.body,
            status: IssueStatus.OPEN,
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
            eventType: "ISSUE_CREATED",
            metadata: { issueId: created.id, issueNumber: nextNumber },
          },
        });

        return created;
      });

      return issue;
    } catch (err: any) {
      if (err.code === "P2002" && attempts < maxAttempts) {
        // Unique constraint conflict on concurrent creation -> retry
        continue;
      }
      throw err;
    }
  }

  throw new Error("Failed to create issue due to high concurrency. Please try again.");
}

export async function listIssues(repositoryId: string, status?: IssueStatus) {
  return prisma.issue.findMany({
    where: {
      repositoryId,
      ...(status ? { status } : {}),
    },
    include: {
      author: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function closeIssue(userId: string, issueId: string) {
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: { repository: true },
  });

  if (!issue) {
    throw new Error("Issue not found.");
  }

  if (issue.authorId !== userId && issue.repository.ownerId !== userId) {
    throw new Error("Unauthorized: Only the issue author or repository owner can close this issue.");
  }

  return prisma.issue.update({
    where: { id: issueId },
    data: { status: IssueStatus.CLOSED },
  });
}
