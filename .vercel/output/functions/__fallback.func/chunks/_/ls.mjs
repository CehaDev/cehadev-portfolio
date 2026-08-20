function normalizeLS(v) {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const o = v;
    const id = typeof o.id === "string" ? o.id.trim() : "";
    const en = typeof o.en === "string" ? o.en.trim() : "";
    return { id, en };
  }
  if (typeof v === "string") {
    const s = v.trim();
    return { id: s, en: s };
  }
  return { id: "", en: "" };
}
function normalizeLSArray(v) {
  if (!Array.isArray(v)) return [];
  return v.map((x) => normalizeLS(x)).filter((i) => i.id);
}
function normalizeLSObject(v, keys) {
  if (!Array.isArray(v)) return [];
  return v.map((x) => {
    const o = x && typeof x === "object" ? x : {};
    const out = {};
    for (const k of keys) out[k] = normalizeLS(o[k]);
    return out;
  });
}
function isLSPair(v) {
  return Boolean(v && typeof v === "object" && !Array.isArray(v) && typeof v.id === "string");
}
function deepLS(v) {
  if (isLSPair(v)) return normalizeLS(v);
  if (typeof v === "string") return normalizeLS(v);
  if (Array.isArray(v)) return v.map(deepLS);
  if (v && typeof v === "object") {
    const o = v;
    const out = {};
    for (const [k, val] of Object.entries(o)) out[k] = deepLS(val);
    return out;
  }
  return v;
}

export { normalizeLSArray as a, normalizeLS as b, deepLS as d, normalizeLSObject as n };
//# sourceMappingURL=ls.mjs.map
