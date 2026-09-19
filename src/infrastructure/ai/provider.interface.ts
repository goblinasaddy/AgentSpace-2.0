export interface ProviderExecutionInput {
  model: string;
  systemPrompt?: string;
  input: any;
  schema?: Record<string, any>;
}

export interface ProviderExecutionOutput {
  text: string;
  json?: any;
  inputTokens?: number;
  outputTokens?: number;
  latencyMs: number;
}

export interface ModelProvider {
  readonly providerName: string;
  execute(params: ProviderExecutionInput): Promise<ProviderExecutionOutput>;
}
