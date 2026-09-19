import { EventEmitter } from "events";

export interface ExecutionJobData {
  runId: string;
}

class MemoryExecutionQueue extends EventEmitter {
  async addJob(data: ExecutionJobData) {
    if (process.env.NODE_ENV === "production" && !process.env.ALLOW_IN_MEMORY_QUEUE) {
      throw new Error(
        "Production Environment Safeguard: MemoryExecutionQueue is forbidden in production. Configure Redis + BullMQ for production queue processing."
      );
    }

    setImmediate(() => {
      this.emit("job", data);
    });
  }
}

export const executionQueue = new MemoryExecutionQueue();
