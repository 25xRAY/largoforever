type LogLevel = "log" | "warn" | "error" | "info";

interface LogContext {
  [key: string]: unknown;
}

const SENSITIVE_KEYS = ["password", "secret", "token", "email", "authorization"];

function sanitize(obj: LogContext): LogContext {
  const out: LogContext = {};
  for (const [k, v] of Object.entries(obj)) {
    const keyLower = k.toLowerCase();
    if (SENSITIVE_KEYS.some((s) => keyLower.includes(s))) {
      out[k] = "[REDACTED]";
    } else if (v !== null && typeof v === "object" && !Array.isArray(v) && !(v instanceof Date)) {
      out[k] = sanitize(v as LogContext);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function payload(level: LogLevel, message: string, context?: LogContext): object {
  const base = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };
  if (context && Object.keys(context).length > 0) {
    return { ...base, ...sanitize(context) };
  }
  return base;
}

const isDev = process.env.NODE_ENV !== "production";

function log(level: LogLevel, message: string, context?: LogContext): void {
  const p = payload(level, message, context);
  if (isDev) {
    const str = `${(p as { timestamp: string }).timestamp} [${level}] ${message}`;
    if (context && Object.keys(context).length > 0) {
      console[level === "log" ? "log" : level](str, context);
    } else {
      console[level === "log" ? "log" : level](str);
    }
  } else {
    console.log(JSON.stringify(p));
  }
}

export const logger = {
  log: (message: string, context?: LogContext) => log("log", message, context),
  info: (message: string, context?: LogContext) => log("info", message, context),
  warn: (message: string, context?: LogContext) => log("warn", message, context),
  error: (message: string, context?: LogContext) => log("error", message, context),
};
