import { RunStatus } from "@prisma/client";

const VALID_TRANSITIONS: Record<RunStatus, RunStatus[]> = {
  QUEUED: [RunStatus.RUNNING, RunStatus.CANCELLED, RunStatus.FAILED],
  RUNNING: [RunStatus.COMPLETED, RunStatus.FAILED, RunStatus.TIMED_OUT, RunStatus.CANCELLED],
  COMPLETED: [],
  FAILED: [],
  TIMED_OUT: [],
  CANCELLED: [],
};

export function canTransitionRunStatus(currentStatus: RunStatus, nextStatus: RunStatus): boolean {
  if (currentStatus === nextStatus) return true;
  const allowed = VALID_TRANSITIONS[currentStatus];
  return allowed ? allowed.includes(nextStatus) : false;
}

export function assertValidRunStateTransition(currentStatus: RunStatus, nextStatus: RunStatus) {
  if (!canTransitionRunStatus(currentStatus, nextStatus)) {
    throw new Error(
      `Invalid Run status transition from '${currentStatus}' to '${nextStatus}'. Terminal states cannot be mutated.`
    );
  }
}
