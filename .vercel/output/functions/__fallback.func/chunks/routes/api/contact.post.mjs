import { d as defineEventHandler, r as readBody } from '../../nitro/nitro.mjs';
import { b as addContactMessage } from '../../_/messages.mjs';
import { r as rateLimitOrThrow } from '../../_/rate-limit.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';
import '../../_/mailer.mjs';
import 'nodemailer';
import '../../_/settings.mjs';

const contact_post = defineEventHandler(async (event) => {
  rateLimitOrThrow(event, "contact", 5, 10 * 60 * 1e3);
  const body = await readBody(event);
  return await addContactMessage({
    name: typeof body.name === "string" ? body.name : "",
    email: typeof body.email === "string" ? body.email : "",
    subject: typeof body.subject === "string" ? body.subject : "",
    message: typeof body.message === "string" ? body.message : ""
  });
});

export { contact_post as default };
//# sourceMappingURL=contact.post.mjs.map
