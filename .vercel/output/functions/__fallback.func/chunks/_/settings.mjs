import { l as kvSetJson, j as kvGetJson } from '../nitro/nitro.mjs';

async function readSettings() {
  return kvGetJson("app_settings", {});
}
async function readSmtpSettings() {
  var _a;
  const s = await readSettings();
  return (_a = s.smtp) != null ? _a : {};
}
async function saveSmtpSettings(smtp) {
  var _a;
  const s = await readSettings();
  s.smtp = { ...(_a = s.smtp) != null ? _a : {}, ...smtp };
  await kvSetJson("app_settings", s);
}

export { readSmtpSettings as r, saveSmtpSettings as s };
//# sourceMappingURL=settings.mjs.map
