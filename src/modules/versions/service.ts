import { z } from "zod";
import { prisma } from "@/infrastructure/database/client";
import { parseAgentSpec, AgentSpec } from "../agents/spec.schema";
import { assertRepoOwnership } from "../repositories/service";

export const PublishVersionSchema = z.object({
  agentId: z.string().min(1, "Agent ID is required"),
  rawSpec: z.string().min(1, "Agent Specification content is required"),
  releaseNotes: z.string().optional(),
});

export type PublishVersionInput = z.infer<typeof PublishVersionSchema>;

export async function publishAgentVersion(userId: string, input: PublishVersionInput) {
  const validated = PublishVersionSchema.parse(input);

  const agent = await prisma.agent.findUnique({
    where: { id: validated.agentId },
    include: { repository: true },
  });

  if (!agent) {
    throw new Error("Agent not found.");
  }

  await assertRepoOwnership(userId, agent.repositoryId);

  const parsedSpec = parseAgentSpec(validated.rawSpec);
  if (!parsedSpec.success) {
    throw new Error(parsedSpec.error);
  }

  const spec: AgentSpec = parsedSpec.data;
  const versionTag = spec.metadata.version;

  // Enforce Immutability Rule: Cannot overwrite an existing published version
  const existingVersion = await prisma.agentVersion.findUnique({
    where: {
      agentId_version: {
        agentId: agent.id,
        version: versionTag,
      },
    },
  });

  if (existingVersion) {
    throw new Error(
      `Agent version '${versionTag}' has already been published and is immutable. Increment the version in your specification to publish a new release.`
    );
  }

  const agentVersion = await prisma.$transaction(async (tx) => {
    const published = await tx.agentVersion.create({
      data: {
        agentId: agent.id,
        version: versionTag,
        configuration: spec as any,
        inputSchema: spec.spec.input.schema,
        outputSchema: spec.spec.output.schema,
        releaseNotes: validated.releaseNotes || `Published version ${versionTag}`,
        publishedById: userId,
      },
    });

    // Update repository defaultVersion
    await tx.repository.update({
      where: { id: agent.repositoryId },
      data: { defaultVersion: versionTag },
    });

    // Record ContributionEvent
    await tx.contributionEvent.create({
      data: {
        userId,
        repositoryId: agent.repositoryId,
        eventType: "VERSION_PUBLISHED",
        metadata: { agentId: agent.id, version: versionTag },
      },
    });

    return published;
  });

  return agentVersion;
}

export async function getAgentVersion(agentId: string, version: string) {
  return prisma.agentVersion.findUnique({
    where: {
      agentId_version: {
        agentId,
        version,
      },
    },
    include: {
      agent: {
        include: {
          repository: {
            include: {
              owner: {
                select: { id: true, username: true, displayName: true, avatarUrl: true },
              },
            },
          },
        },
      },
      publishedBy: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
    },
  });
}
