function isLS(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const o = value;
  if (typeof o.id !== "string") return false;
  return Object.keys(o).every((k) => k === "id" || k === "en");
}
function lsId(v) {
  if (typeof v === "string") return v;
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const o = v;
    return typeof o.id === "string" ? o.id : "";
  }
  return "";
}
function localize(value, lang) {
  if (Array.isArray(value)) {
    return value.map((v) => localize(v, lang));
  }
  if (isLS(value)) {
    const o = value;
    return lang === "en" && typeof o.en === "string" && o.en || o.id;
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = localize(v, lang);
    }
    return out;
  }
  return value;
}

export { lsId as a, localize as l };
//# sourceMappingURL=localize-vezARIz8.mjs.map
