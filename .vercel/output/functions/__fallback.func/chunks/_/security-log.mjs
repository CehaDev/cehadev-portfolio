import { mkdir, appendFile } from 'node:fs/promises';
import path from 'node:path';
import { i as isUsingTurso, e as ensureSchema, f as db } from '../nitro/nitro.mjs';

const logFile = path.resolve(process.cwd(), ".data/security.log");
async function logSecurityEvent(event, details = {}) {
  const entry = JSON.stringify({ ts: (/* @__PURE__ */ new Date()).toISOString(), event, ...details });
  if (isUsingTurso()) {
    try {
      await ensureSchema();
      await db().execute({
        sql: "INSERT INTO security_log (ts, event, details) VALUES (?, ?, ?)",
        args: [(/* @__PURE__ */ new Date()).toISOString(), event, JSON.stringify(details)]
      });
    } catch {
    }
    return;
  }
  await mkdir(path.dirname(logFile), { recursive: true }).catch(() => {
  });
  await appendFile(logFile, entry + "\n").catch(() => {
  });
}

export { logSecurityEvent as l };
//# sourceMappingURL=security-log.mjs.map
