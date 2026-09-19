const SENSITIVE_PATTERNS = [
  /AIzaSy[A-Za-z0-9_-]{30,}/g, // Gemini API Key pattern
  /sk-[A-Za-z0-9]{32,}/g,     // OpenAI API Key pattern
  /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, // JWT pattern
  /postgres(ql)?:\/\/[^\s]+/g, // Postgres DB URI
  /redis:\/\/[^\s]+/g,        // Redis URI
];

export function sanitizeErrorMessage(message: string): string {
  if (!message) return "An execution error occurred.";

  let sanitized = message;
  for (const pattern of SENSITIVE_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[REDACTED_SECRET]");
  }

  // Cap maximum error message length to prevent DB bloat
  if (sanitized.length > 1000) {
    sanitized = sanitized.substring(0, 1000) + "... [truncated]";
  }

  return sanitized;
}

export function sanitizePayload(data: any, maxDepth = 5): any {
  if (data === null || data === undefined) return data;
  if (typeof data !== "object") {
    if (typeof data === "string" && data.length > 50000) {
      return data.substring(0, 50000) + "... [payload truncated]";
    }
    return data;
  }

  if (maxDepth <= 0) return "[Max Depth Exceeded]";

  if (Array.isArray(data)) {
    return data.map((item) => sanitizePayload(item, maxDepth - 1));
  }

  const sanitizedObj: Record<string, any> = {};
  const SENSITIVE_KEYS = ["password", "secret", "apikey", "api_key", "token", "auth", "credential"];

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some((k) => lowerKey.includes(k))) {
      sanitizedObj[key] = "[REDACTED_SECRET]";
    } else {
      sanitizedObj[key] = sanitizePayload(value, maxDepth - 1);
    }
  }

  return sanitizedObj;
}
