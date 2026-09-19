import { GoogleGenAI } from "@google/genai";
import { ModelProvider, ProviderExecutionInput, ProviderExecutionOutput } from "./provider.interface";

export class GeminiProvider implements ModelProvider {
  readonly providerName = "gemini";
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  async execute(params: ProviderExecutionInput): Promise<ProviderExecutionOutput> {
    const startTime = Date.now();

    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key is not configured in environment variables (GEMINI_API_KEY).");
      }
      this.ai = new GoogleGenAI({ apiKey });
    }

    const modelName = params.model || "gemini-2.5-flash";
    const promptText = typeof params.input === "string" ? params.input : JSON.stringify(params.input);

    const config: Record<string, any> = {};
    if (params.systemPrompt) {
      config.systemInstruction = params.systemPrompt;
    }

    try {
      const response = await this.ai.models.generateContent({
        model: modelName,
        contents: promptText,
        config,
      });

      const latencyMs = Date.now() - startTime;
      const responseText = response.text || "";

      let jsonOutput: any = undefined;
      try {
        jsonOutput = JSON.parse(responseText);
      } catch {
        // Output is plain text
      }

      const usage = response.usageMetadata;
      const inputTokens = usage?.promptTokenCount ?? 0;
      const outputTokens = usage?.candidatesTokenCount ?? 0;

      return {
        text: responseText,
        json: jsonOutput,
        inputTokens,
        outputTokens,
        latencyMs,
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      throw new Error(`Gemini Provider Execution Error (${modelName}): ${err.message || String(err)}`);
    }
  }
}
