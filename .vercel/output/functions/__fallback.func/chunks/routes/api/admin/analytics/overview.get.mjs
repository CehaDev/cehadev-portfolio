import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import { g as getAnalyticsOverview } from '../../../../_/visits.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';

const overview_get = defineEventHandler(async (event) => {
  return await getAnalyticsOverview();
});

export { overview_get as default };
//# sourceMappingURL=overview.get.mjs.map
