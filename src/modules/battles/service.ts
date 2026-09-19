import { z } from "zod";
import { prisma } from "@/infrastructure/database/client";
import { executeAgent } from "../runtime/executor";
import { BattleStatus } from "@prisma/client";

export const CreateBattleSchema = z.object({
  challenge: z.string().min(5, "Challenge prompt must be at least 5 characters"),
  agentVersionIds: z.array(z.string()).min(2, "Battle requires at least 2 agent versions"),
});

export type CreateBattleInput = z.infer<typeof CreateBattleSchema>;

export async function createBattle(userId: string, input: CreateBattleInput) {
  const validated = CreateBattleSchema.parse(input);

  const battle = await prisma.$transaction(async (tx) => {
    const createdBattle = await tx.battle.create({
      data: {
        creatorId: userId,
        challenge: validated.challenge,
        status: BattleStatus.PENDING,
      },
    });

    for (const versionId of validated.agentVersionIds) {
      await tx.battleParticipant.create({
        data: {
          battleId: createdBattle.id,
          agentVersionId: versionId,
        },
      });
    }

    await tx.contributionEvent.create({
      data: {
        userId,
        eventType: "BATTLE_CREATED",
        metadata: { battleId: createdBattle.id },
      },
    });

    return createdBattle;
  });

  return battle;
}

export async function executeBattle(userId: string, battleId: string) {
  const battle = await prisma.battle.findUnique({
    where: { id: battleId },
    include: {
      participants: true,
    },
  });

  if (!battle) {
    throw new Error("Battle session not found.");
  }

  await prisma.battle.update({
    where: { id: battleId },
    data: { status: BattleStatus.RUNNING },
  });

  try {
    // Parallel execution of all participants
    const executions = battle.participants.map(async (participant) => {
      const run = await executeAgent({
        agentVersionId: participant.agentVersionId,
        userId,
        input: { prompt: battle.challenge },
      });

      return prisma.battleResult.create({
        data: {
          battleId: battle.id,
          participantId: participant.id,
          runId: run.id,
          output: run.output as any,
          latencyMs: run.latencyMs,
          inputTokens: run.inputTokens,
          outputTokens: run.outputTokens,
          estimatedCost: run.estimatedCost,
        },
      });
    });

    await Promise.all(executions);

    const completedBattle = await prisma.battle.update({
      where: { id: battleId },
      data: {
        status: BattleStatus.COMPLETED,
        completedAt: new Date(),
      },
      include: {
        participants: {
          include: {
            agentVersion: {
              include: {
                agent: {
                  include: {
                    repository: {
                      include: {
                        owner: { select: { username: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        results: true,
      },
    });

    return completedBattle;
  } catch (err: any) {
    await prisma.battle.update({
      where: { id: battleId },
      data: { status: BattleStatus.FAILED },
    });
    throw new Error(`Battle execution failed: ${err.message || String(err)}`);
  }
}

export async function getBattleDetails(battleId: string) {
  return prisma.battle.findUnique({
    where: { id: battleId },
    include: {
      creator: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      participants: {
        include: {
          agentVersion: {
            include: {
              agent: {
                include: {
                  repository: {
                    include: {
                      owner: { select: { username: true } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      results: true,
      votes: {
        include: {
          user: { select: { username: true } },
          preferredVersion: { select: { version: true } },
        },
      },
    },
  });
}

export async function submitVote(userId: string, battleId: string, preferredVersionId: string, comment?: string) {
  const battle = await prisma.battle.findUnique({
    where: { id: battleId },
    include: { participants: true },
  });

  if (!battle) {
    throw new Error("Battle session not found.");
  }

  const isParticipant = battle.participants.some((p) => p.agentVersionId === preferredVersionId);
  if (!isParticipant) {
    throw new Error("Invalid preferred version ID: target version did not participate in this battle.");
  }

  return prisma.vote.upsert({
    where: {
      battleId_userId: {
        battleId,
        userId,
      },
    },
    update: {
      preferredVersionId,
      comment,
    },
    create: {
      battleId,
      userId,
      preferredVersionId,
      comment,
    },
  });
}
