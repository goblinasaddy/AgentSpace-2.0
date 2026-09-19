import { GeminiProvider } from "@/infrastructure/ai/gemini.provider";
import { parseAgentSpec } from "../agents/spec.schema";
import { prisma } from "@/infrastructure/database/client";
import { assertRepoOwnership } from "../repositories/service";

const provider = new GeminiProvider();

export interface AutoBuildInput {
  prompt: string;
}

export interface AutoBuildResult {
  name: string;
  slug: string;
  description: string;
  rawSpec: string;
  readme: string;
}

export async function generateAutoRepo(input: AutoBuildInput): Promise<AutoBuildResult> {
  const systemPrompt = `You are the AgentSpace Auto Repo Builder. Given a user's natural language request, generate an AgentSpace repository package.
Return ONLY valid JSON matching this exact structure:
{
  "name": "Human readable agent name",
  "slug": "kebab-case-slug",
  "description": "Short 1-2 sentence description",
  "rawSpec": "Valid YAML string conforming to AgentSpace Agent Specification (apiVersion: agentspace/v1, kind: Agent, metadata: {name, version: '1.0.0', description}, spec: {type, runtime: {provider: 'gemini', model: 'gemini-2.5-flash', systemPrompt}, input: {schema}, output: {schema}})",
  "readme": "Markdown README content"
}`;

  try {
    const response = await provider.execute({
      model: "gemini-2.5-flash",
      systemPrompt,
      input: input.prompt,
    });

    if (response.json && response.json.name && response.json.rawSpec) {
      return response.json;
    }
  } catch {
    // Fallback deterministic builder if Gemini API key is not present or fails
  }

  // High quality deterministic fallback generator
  const slug = input.prompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30) || "custom-agent";

  const name = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const rawSpec = `apiVersion: agentspace/v1
kind: Agent
metadata:
  name: "${name}"
  version: "1.0.0"
  description: "${input.prompt.replace(/"/g, '\\"')}"
spec:
  type: input-output
  runtime:
    provider: gemini
    model: gemini-2.5-flash
    systemPrompt: "You are an AI agent designed to perform task: ${input.prompt.replace(/"/g, '\\"')}"
  input:
    schema:
      type: object
      properties:
        request:
          type: string
  output:
    schema:
      type: object
      properties:
        result:
          type: string
  capabilities:
    - task_execution
  permissions:
    network: false
    filesystem: false`;

  const readme = `# ${name}

> ${input.prompt}

## Specification
- **Version**: 1.0.0
- **Provider**: Gemini 2.5 Flash
- **Type**: Input/Output Agent

## Usage
Execute via AgentSpace API:
\`\`\`bash
curl -X POST https://api.agentspace.ai/v1/agents/<agent-id>/runs \\
  -H "x-user-id: <user-id>" \\
  -d '{"input": {"request": "Hello AgentSpace"}}'
\`\`\`
`;

  return {
    name,
    slug,
    description: `Auto-generated agent for: ${input.prompt}`,
    rawSpec,
    readme,
  };
}

export interface ImportRepositoryInput {
  name: string;
  slug: string;
  description?: string;
  rawSpec: string;
  readme?: string;
}

export async function importRepository(userId: string, input: ImportRepositoryInput) {
  const parsedSpec = parseAgentSpec(input.rawSpec);
  if (!parsedSpec.success) {
    throw new Error(parsedSpec.error);
  }

  const spec = parsedSpec.data;

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create Repository
    const repo = await tx.repository.create({
      data: {
        ownerId: userId,
        name: input.name,
        slug: input.slug.toLowerCase(),
        description: input.description,
        defaultVersion: spec.metadata.version,
      },
    });

    // 2. Create Agent
    const agent = await tx.agent.create({
      data: {
        repositoryId: repo.id,
        name: spec.metadata.name,
        description: spec.metadata.description,
      },
    });

    // 3. Publish Version 1.0.0
    const version = await tx.agentVersion.create({
      data: {
        agentId: agent.id,
        version: spec.metadata.version,
        configuration: spec as any,
        inputSchema: spec.spec.input.schema,
        outputSchema: spec.spec.output.schema,
        releaseNotes: "Initial publication via Auto Repo Builder",
        publishedById: userId,
      },
    });

    // 4. Save README file
    if (input.readme) {
      await tx.agentFile.create({
        data: {
          agentVersionId: version.id,
          path: "README.md",
          content: input.readme,
          mimeType: "text/markdown",
        },
      });
    }

    // 5. Record ContributionEvent
    await tx.contributionEvent.create({
      data: {
        userId,
        repositoryId: repo.id,
        eventType: "REPO_CREATED",
        metadata: { repositorySlug: repo.slug, isAutoBuilt: true },
      },
    });

    return { repository: repo, agent, version };
  });

  return result;
}
