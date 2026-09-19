import { z } from "zod";
import yaml from "js-yaml";

export const AgentSpecSchema = z.object({
  apiVersion: z.string().default("agentspace/v1"),
  kind: z.literal("Agent").default("Agent"),
  metadata: z.object({
    name: z.string().min(1, "Agent name is required"),
    version: z.string().regex(/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/, "Must be a valid semver string (e.g. 1.0.0)"),
    description: z.string().min(1, "Agent description is required"),
    categories: z.array(z.string()).optional().default([]),
    tags: z.array(z.string()).optional().default([]),
  }),
  spec: z.object({
    type: z.enum(["chat", "input-output", "tool", "workflow"]).default("input-output"),
    runtime: z.object({
      provider: z.string().min(1, "Model provider is required"),
      model: z.string().min(1, "Model name is required"),
      systemPrompt: z.string().optional(),
    }),
    input: z.object({
      schema: z.record(z.any()).default({ type: "object" }),
    }).default({ schema: { type: "object" } }),
    output: z.object({
      schema: z.record(z.any()).default({ type: "object" }),
    }).default({ schema: { type: "object" } }),
    capabilities: z.array(z.string()).optional().default([]),
    tools: z.array(z.record(z.any())).optional().default([]),
    permissions: z.object({
      network: z.boolean().optional().default(false),
      filesystem: z.boolean().optional().default(false),
    }).optional().default({ network: false, filesystem: false }),
    evaluation: z.object({
      test_cases: z.array(z.record(z.any())).optional().default([]),
    }).optional().default({ test_cases: [] }),
  }),
});

export type AgentSpec = z.infer<typeof AgentSpecSchema>;

/**
 * Parses and validates raw YAML or JSON text into a typed AgentSpec.
 */
export function parseAgentSpec(rawContent: string): { success: true; data: AgentSpec } | { success: false; error: string } {
  try {
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      parsed = yaml.load(rawContent);
    }

    if (!parsed || typeof parsed !== "object") {
      return { success: false, error: "Specification content must be a valid YAML or JSON object." };
    }

    const result = AgentSpecSchema.safeParse(parsed);
    if (!result.success) {
      const formattedErrors = result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
      return { success: false, error: `Invalid Agent Specification: ${formattedErrors}` };
    }

    return { success: true, data: result.data };
  } catch (err: any) {
    return { success: false, error: `Failed to parse Agent Specification: ${err.message || String(err)}` };
  }
}
