import { z } from "zod";
import { prisma } from "@/infrastructure/database/client";
import { AgentType } from "@prisma/client";
import { assertRepoOwnership } from "../repositories/service";

export const CreateAgentSchema = z.object({
  repositoryId: z.string().min(1, "Repository ID is required"),
  name: z.string().min(2, "Agent name is required").max(100),
  description: z.string().optional(),
  type: z.nativeEnum(AgentType).default(AgentType.INPUT_OUTPUT),
});

export type CreateAgentInput = z.infer<typeof CreateAgentSchema>;

export async function createAgent(userId: string, input: CreateAgentInput) {
  const validated = CreateAgentSchema.parse(input);

  await assertRepoOwnership(userId, validated.repositoryId);

  const agent = await prisma.agent.create({
    data: {
      repositoryId: validated.repositoryId,
      name: validated.name,
      description: validated.description,
      type: validated.type,
    },
    include: {
      repository: {
        select: { id: true, name: true, slug: true, ownerId: true },
      },
    },
  });

  await prisma.contributionEvent.create({
    data: {
      userId,
      repositoryId: validated.repositoryId,
      eventType: "AGENT_CREATED",
      metadata: { agentId: agent.id, agentName: agent.name },
    },
  });

  return agent;
}

export async function getAgentById(agentId: string) {
  return prisma.agent.findUnique({
    where: { id: agentId },
    include: {
      repository: {
        include: {
          owner: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
        },
      },
      versions: {
        orderBy: { publishedAt: "desc" },
      },
    },
  });
}
