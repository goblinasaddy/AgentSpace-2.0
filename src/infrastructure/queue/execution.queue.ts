import { EventEmitter } from "events";

export interface ExecutionJobData {
  runId: string;
}

// In-process memory event queue for local worker execution
class MemoryExecutionQueue extends EventEmitter {
  async addJob(data: ExecutionJobData) {
    setImmediate(() => {
      this.emit("job", data);
    });
  }
}

export const executionQueue = new MemoryExecutionQueue();
