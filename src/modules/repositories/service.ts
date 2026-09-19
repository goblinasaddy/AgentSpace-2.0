import { z } from "zod";
import { prisma } from "@/infrastructure/database/client";
import { RepositoryVisibility } from "@prisma/client";

export const CreateRepositorySchema = z.object({
  name: z.string().min(2, "Repository name must be at least 2 characters").max(50),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/, "Slug can only contain alphanumeric characters, hyphens, and underscores"),
  description: z.string().optional(),
  visibility: z.nativeEnum(RepositoryVisibility).default(RepositoryVisibility.PUBLIC),
  organizationId: z.string().optional(),
});

export type CreateRepositoryInput = z.infer<typeof CreateRepositorySchema>;

export async function createRepository(userId: string, input: CreateRepositoryInput) {
  const validated = CreateRepositorySchema.parse(input);

  const existing = await prisma.repository.findUnique({
    where: {
      ownerId_slug: {
        ownerId: userId,
        slug: validated.slug.toLowerCase(),
      },
    },
  });

  if (existing) {
    throw new Error(`Repository with slug '${validated.slug}' already exists for this owner.`);
  }

  const repository = await prisma.repository.create({
    data: {
      ownerId: userId,
      organizationId: validated.organizationId,
      name: validated.name,
      slug: validated.slug.toLowerCase(),
      description: validated.description,
      visibility: validated.visibility,
    },
    include: {
      owner: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
    },
  });

  // Record ContributionEvent
  await prisma.contributionEvent.create({
    data: {
      userId,
      repositoryId: repository.id,
      eventType: "REPO_CREATED",
      metadata: { repositorySlug: repository.slug },
    },
  });

  return repository;
}

export async function getRepositoryByOwnerAndSlug(ownerUsername: string, slug: string) {
  const user = await prisma.user.findUnique({
    where: { username: ownerUsername.toLowerCase() },
  });

  if (!user) {
    return null;
  }

  return prisma.repository.findUnique({
    where: {
      ownerId_slug: {
        ownerId: user.id,
        slug: slug.toLowerCase(),
      },
    },
    include: {
      owner: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
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
}

export async function assertRepoOwnership(userId: string, repositoryId: string) {
  const repo = await prisma.repository.findUnique({
    where: { id: repositoryId },
  });

  if (!repo) {
    throw new Error("Repository not found.");
  }

  if (repo.ownerId !== userId) {
    throw new Error("Unauthorized: You do not own this repository.");
  }

  return repo;
}
