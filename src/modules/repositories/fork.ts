import { prisma } from "@/infrastructure/database/client";

export async function forkRepository(userId: string, targetRepositoryId: string, customSlug?: string) {
  const targetRepo = await prisma.repository.findUnique({
    where: { id: targetRepositoryId },
    include: {
      agents: {
        include: {
          versions: {
            orderBy: { publishedAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!targetRepo) {
    throw new Error("Target repository not found.");
  }

  const slug = customSlug?.toLowerCase() || targetRepo.slug;

  const existingFork = await prisma.repository.findUnique({
    where: {
      ownerId_slug: {
        ownerId: userId,
        slug,
      },
    },
  });

  if (existingFork) {
    throw new Error(`You already have a repository named '${slug}'.`);
  }

  const forkedRepo = await prisma.$transaction(async (tx) => {
    const repo = await tx.repository.create({
      data: {
        ownerId: userId,
        name: `${targetRepo.name} (Fork)`,
        slug,
        description: targetRepo.description ? `Forked from ${targetRepo.slug}: ${targetRepo.description}` : `Forked from ${targetRepo.slug}`,
        visibility: targetRepo.visibility,
        forkedFromId: targetRepo.id,
        defaultVersion: targetRepo.defaultVersion,
      },
      include: {
        owner: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        forkedFrom: {
          select: { id: true, slug: true, owner: { select: { username: true } } },
        },
      },
    });

    // Clone agents and default version
    for (const agent of targetRepo.agents) {
      const clonedAgent = await tx.agent.create({
        data: {
          repositoryId: repo.id,
          name: agent.name,
          description: agent.description,
          type: agent.type,
        },
      });

      if (agent.versions.length > 0) {
        const latestVersion = agent.versions[0];
        await tx.agentVersion.create({
          data: {
            agentId: clonedAgent.id,
            version: latestVersion.version,
            configuration: latestVersion.configuration as any,
            inputSchema: latestVersion.inputSchema as any,
            outputSchema: latestVersion.outputSchema as any,
            releaseNotes: `Forked from version ${latestVersion.version}`,
            publishedById: userId,
          },
        });
      }
    }

    // Record FORK_CREATED ContributionEvent
    await tx.contributionEvent.create({
      data: {
        userId,
        repositoryId: repo.id,
        eventType: "FORK_CREATED",
        metadata: { forkedFromId: targetRepo.id, forkedFromSlug: targetRepo.slug },
      },
    });

    return repo;
  });

  return forkedRepo;
}
