export interface AgentTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  rawSpec: string;
}

export const STARTER_TEMPLATES: AgentTemplate[] = [
  {
    id: "template-code-reviewer",
    name: "Code Reviewer & Auditor",
    slug: "code-reviewer",
    description: "Automated code review agent that audits code for security vulnerabilities, performance bottlenecks, and style violations.",
    category: "coding",
    rawSpec: `apiVersion: agentspace/v1
kind: Agent
metadata:
  name: code-reviewer
  version: 1.0.0
  description: Automated code review agent auditing for security and performance.
  categories:
    - coding
  tags:
    - code-review
    - security
spec:
  type: input-output
  runtime:
    provider: gemini
    model: gemini-2.5-flash
    systemPrompt: You are a Lead Security Engineer reviewing source code. Identify vulnerabilities, code smells, and performance issues.
  input:
    schema:
      type: object
      properties:
        code:
          type: string
        language:
          type: string
  output:
    schema:
      type: object
      properties:
        vulnerabilities:
          type: array
        recommendations:
          type: array
  capabilities:
    - static_analysis
    - security_screening
  permissions:
    network: false
    filesystem: false`,
  },
  {
    id: "template-research-summarizer",
    name: "Technical Research Summarizer",
    slug: "research-summarizer",
    description: "Extracts key technical findings, methodology summaries, and limitations from research documents.",
    category: "research",
    rawSpec: `apiVersion: agentspace/v1
kind: Agent
metadata:
  name: research-summarizer
  version: 1.0.0
  description: Technical paper summarizer and insight extractor.
  categories:
    - research
  tags:
    - paper-summary
    - research
spec:
  type: input-output
  runtime:
    provider: gemini
    model: gemini-2.5-flash
    systemPrompt: You are a PhD technical researcher. Summarize the provided document into core contributions, methodology, and limitations.
  input:
    schema:
      type: object
      properties:
        text:
          type: string
  output:
    schema:
      type: object
      properties:
        contributions:
          type: array
        summary:
          type: string
  capabilities:
    - text_summarization
  permissions:
    network: false
    filesystem: false`,
  },
];

export function getTemplates(): AgentTemplate[] {
  return STARTER_TEMPLATES;
}
