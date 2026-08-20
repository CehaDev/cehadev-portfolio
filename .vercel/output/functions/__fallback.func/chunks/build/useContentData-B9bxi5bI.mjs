import { l as localize } from './localize-vezARIz8.mjs';
import { computed, ref } from 'vue';
import { U as klona, w as getRequestHeader, V as destr, W as isEqual, X as setCookie, q as getCookie, Y as deleteCookie } from '../nitro/nitro.mjs';
import { b as useNuxtApp } from './server.mjs';
import { u as useRequestEvent } from './ssr-DMxvrB_f.mjs';
import { u as useAsyncData } from './asyncData-I2BNYYXU.mjs';

const NullObject = /* @__PURE__ */ (() => {
  const C = function() {
  };
  C.prototype = /* @__PURE__ */ Object.create(null);
  return C;
})();
function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = new NullObject();
  const opt = options || {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => {
    const decoded = decodeURIComponent(val);
    const parsed = destr(decoded);
    if (typeof parsed === "number" && (!Number.isFinite(parsed) || String(parsed) !== decoded)) {
      return decoded;
    }
    return parsed;
  },
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  var _a, _b, _c;
  const opts = { ...CookieDefaults, ..._opts };
  (_a = opts.filter) != null ? _a : opts.filter = (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : (_c = cookies[name]) != null ? _c : (_b = opts.default) == null ? void 0 : _b.call(opts));
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies || (nuxtApp._cookies = {});
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
function useLang() {
  const lang = useCookie("cehadev-lang", {
    default: () => "id",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    path: "/"
  });
  const isEn = computed(() => lang.value === "en");
  function setLang(value) {
    lang.value = value;
  }
  function toggleLang() {
    lang.value = lang.value === "id" ? "en" : "id";
  }
  return { lang, isEn, setLang, toggleLang };
}
function localizedResult(res, lang) {
  return {
    data: computed(() => localize(res.data.value, lang.value)),
    pending: res.pending,
    error: res.error,
    status: res.status,
    refresh: res.refresh,
    execute: res.execute,
    clear: res.clear
  };
}
async function useSiteSettings() {
  const { lang } = useLang();
  return localizedResult(await useAsyncData("site-settings", () => $fetch("/api/content/site")), lang);
}
async function useCvContent() {
  const { lang } = useLang();
  return localizedResult(await useAsyncData("cv-content", () => $fetch("/api/content/cv")), lang);
}
async function useSkillsContent() {
  const { lang } = useLang();
  return localizedResult(await useAsyncData("skills-content", () => $fetch("/api/content/skills")), lang);
}
async function useProjectsContent() {
  const { lang } = useLang();
  return localizedResult(
    await useAsyncData("projects-content", () => $fetch("/api/content/projects")),
    lang
  );
}

export { useSiteSettings as a, useSkillsContent as b, useLang as c, useProjectsContent as d, useCvContent as u };
//# sourceMappingURL=useContentData-B9bxi5bI.mjs.map
