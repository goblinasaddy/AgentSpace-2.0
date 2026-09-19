import { prisma } from "@/infrastructure/database/client";

export async function starRepository(userId: string, repositoryId: string) {
  const existing = await prisma.star.findUnique({
    where: {
      userId_repositoryId: {
        userId,
        repositoryId,
      },
    },
  });

  if (existing) {
    return existing;
  }

  const star = await prisma.$transaction(async (tx) => {
    const newStar = await tx.star.create({
      data: {
        userId,
        repositoryId,
      },
    });

    await tx.contributionEvent.create({
      data: {
        userId,
        repositoryId,
        eventType: "STARRED",
      },
    });

    return newStar;
  });

  return star;
}

export async function unstarRepository(userId: string, repositoryId: string) {
  try {
    await prisma.star.delete({
      where: {
        userId_repositoryId: {
          userId,
          repositoryId,
        },
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function getStarCount(repositoryId: string): Promise<number> {
  return prisma.star.count({
    where: { repositoryId },
  });
}

export async function hasUserStarred(userId: string, repositoryId: string): Promise<boolean> {
  const count = await prisma.star.count({
    where: { userId, repositoryId },
  });
  return count > 0;
}
