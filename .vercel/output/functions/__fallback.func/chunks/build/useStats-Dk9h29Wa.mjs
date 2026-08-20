import { ref } from 'vue';

function formatCount(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(/\.0$/, "")}jt`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}
function useStats() {
  const data = ref(null);
  const viewsOf = (slug) => {
    var _a, _b;
    const found = (_a = data.value) == null ? void 0 : _a.projects.find((p) => p.slug === slug);
    return (_b = found == null ? void 0 : found.views) != null ? _b : 0;
  };
  const sourceOf = (label) => {
    var _a, _b, _c;
    return (_c = (_b = (_a = data.value) == null ? void 0 : _a.sources.find((s) => s.label === label)) == null ? void 0 : _b.value) != null ? _c : 0;
  };
  return { data, viewsOf, sourceOf, formatCount };
}

export { useStats as u };
//# sourceMappingURL=useStats-Dk9h29Wa.mjs.map
