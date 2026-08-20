import { _ as __nuxt_component_0 } from './nuxt-link-Cvz8sa0r.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import { ArrowLeft, Printer, Download, MapPin, Mail, Phone, Globe, Linkedin, Github, Sparkles, Briefcase, GraduationCap } from 'lucide-vue-next';
import { u as useCvContent, a as useSiteSettings } from './useContentData-B9bxi5bI.mjs';
import { u as useSeoMeta } from './v3-C1_XsqpX.mjs';
import { _ as _export_sfc, u as useRoute } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';
import './localize-vezARIz8.mjs';
import './ssr-DMxvrB_f.mjs';
import './asyncData-I2BNYYXU.mjs';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cv",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: cv2 } = ([__temp, __restore] = withAsyncContext(() => useCvContent()), __temp = await __temp, __restore(), __temp);
    const { data: site } = ([__temp, __restore] = withAsyncContext(() => useSiteSettings()), __temp = await __temp, __restore(), __temp);
    useSeoMeta({
      title: () => {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = site.value) == null ? void 0 : _a.seo) == null ? void 0 : _b.cv) == null ? void 0 : _c.title) != null ? _d : "CV | CehaDev";
      },
      description: () => {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = site.value) == null ? void 0 : _a.seo) == null ? void 0 : _b.cv) == null ? void 0 : _c.description) != null ? _d : "Curriculum Vitae CehaDev \u2014 Web Developer & Tech Enthusiast.";
      }
    });
    const headings = computed(() => {
      var _a, _b, _c;
      return (_c = (_b = (_a = site.value) == null ? void 0 : _a.headings) == null ? void 0 : _b.cv) != null ? _c : {};
    });
    useRoute();
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-site py-10 md:py-14 print:p-0" }, _attrs))} data-v-60833675><div class="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden" data-v-60833675>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-text"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2;
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), {
              size: 16,
              "stroke-width": 2
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate((_a2 = unref(headings).backHome) != null ? _a2 : "Kembali ke Beranda")}`);
          } else {
            return [
              createVNode(unref(ArrowLeft), {
                size: 16,
                "stroke-width": 2
              }),
              createTextVNode(" " + toDisplayString((_b2 = unref(headings).backHome) != null ? _b2 : "Kembali ke Beranda"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center gap-3" data-v-60833675><button type="button" class="btn-outline !px-4 !py-2.5" data-v-60833675>`);
      _push(ssrRenderComponent(unref(Printer), {
        size: 16,
        "stroke-width": 2
      }, null, _parent));
      _push(` ${ssrInterpolate((_a = unref(headings).printPdf) != null ? _a : "Cetak / Simpan PDF")}</button><a href="/cv?download=1" class="btn-primary !px-4 !py-2.5" data-v-60833675>`);
      _push(ssrRenderComponent(unref(Download), {
        size: 16,
        "stroke-width": 2
      }, null, _parent));
      _push(` ${ssrInterpolate((_b = unref(headings).downloadPdf) != null ? _b : "Download PDF")}</a></div></div>`);
      if (unref(cv2)) {
        _push(`<div class="cv-sheet mx-auto grid max-w-[210mm] overflow-hidden rounded-card border border-border bg-card shadow-card md:grid-cols-[300px_1fr] print:max-w-none print:grid-cols-[260px_1fr] print:rounded-none print:border-0 print:bg-white print:shadow-none" data-v-60833675><aside class="bg-gradient-brand text-white" data-v-60833675><div class="flex flex-col items-center px-8 py-10 text-center" data-v-60833675>`);
        if (unref(cv2).photo) {
          _push(`<img${ssrRenderAttr("src", unref(cv2).photo)}${ssrRenderAttr("alt", ((_c = unref(headings).photoAlt) != null ? _c : "Foto {{name}}").replace("{{name}}", (_d = unref(cv2).fullName) != null ? _d : ""))} class="h-32 w-32 rounded-full border-4 border-white/80 object-cover shadow-lg print:h-28 print:w-28 print:border-2" data-v-60833675>`);
        } else {
          _push(`<div class="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white/80 bg-white/10 text-5xl font-extrabold" data-v-60833675>${ssrInterpolate((unref(cv2).fullName || "?").charAt(0))}</div>`);
        }
        _push(`<h1 class="mt-5 text-2xl font-extrabold leading-tight tracking-tight print:text-xl" data-v-60833675>${ssrInterpolate(unref(cv2).fullName)}</h1><p class="mt-1 text-sm font-medium text-white/85 print:text-xs" data-v-60833675>${ssrInterpolate(unref(cv2).title)}</p></div><div class="space-y-8 border-t border-white/15 px-8 pb-10 pt-8" data-v-60833675>`);
        if (unref(cv2).email || unref(cv2).phone || unref(cv2).location || unref(cv2).website || unref(cv2).linkedin || unref(cv2).github) {
          _push(`<section data-v-60833675><h2 class="cv-sidebar-title" data-v-60833675>${ssrInterpolate((_e = unref(headings).sideContact) != null ? _e : "Kontak")}</h2><ul class="mt-3 space-y-2.5" data-v-60833675>`);
          if (unref(cv2).location) {
            _push(`<li class="cv-contact-row" data-v-60833675>`);
            _push(ssrRenderComponent(unref(MapPin), {
              size: 15,
              class: "shrink-0"
            }, null, _parent));
            _push(` <span class="break-words" data-v-60833675>${ssrInterpolate(unref(cv2).location)}</span></li>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(cv2).email) {
            _push(`<li class="cv-contact-row" data-v-60833675>`);
            _push(ssrRenderComponent(unref(Mail), {
              size: 15,
              class: "shrink-0"
            }, null, _parent));
            _push(` <span class="break-all" data-v-60833675>${ssrInterpolate(unref(cv2).email)}</span></li>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(cv2).phone) {
            _push(`<li class="cv-contact-row" data-v-60833675>`);
            _push(ssrRenderComponent(unref(Phone), {
              size: 15,
              class: "shrink-0"
            }, null, _parent));
            _push(` <span class="break-words" data-v-60833675>${ssrInterpolate(unref(cv2).phone)}</span></li>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(cv2).website) {
            _push(`<li class="cv-contact-row" data-v-60833675>`);
            _push(ssrRenderComponent(unref(Globe), {
              size: 15,
              class: "shrink-0"
            }, null, _parent));
            _push(` <span class="break-all" data-v-60833675>${ssrInterpolate(unref(cv2).website)}</span></li>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(cv2).linkedin) {
            _push(`<li class="cv-contact-row" data-v-60833675>`);
            _push(ssrRenderComponent(unref(Linkedin), {
              size: 15,
              class: "shrink-0"
            }, null, _parent));
            _push(` <span class="break-all" data-v-60833675>${ssrInterpolate(unref(cv2).linkedin.replace(/^https?:\/\/(www\.)?/, ""))}</span></li>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(cv2).github) {
            _push(`<li class="cv-contact-row" data-v-60833675>`);
            _push(ssrRenderComponent(unref(Github), {
              size: 15,
              class: "shrink-0"
            }, null, _parent));
            _push(` <span class="break-all" data-v-60833675>${ssrInterpolate(unref(cv2).github.replace(/^https?:\/\/(www\.)?/, ""))}</span></li>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</ul></section>`);
        } else {
          _push(`<!---->`);
        }
        if ((_f = unref(cv2).skills) == null ? void 0 : _f.length) {
          _push(`<section data-v-60833675><h2 class="cv-sidebar-title" data-v-60833675>${ssrInterpolate((_g = unref(headings).sideSkills) != null ? _g : "Keahlian")}</h2><ul class="mt-3 space-y-2" data-v-60833675><!--[-->`);
          ssrRenderList(unref(cv2).skills, (s) => {
            _push(`<li class="flex items-start gap-2 text-sm leading-snug text-white/95 print:text-xs" data-v-60833675><span class="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-white print:mt-[6px]" aria-hidden="true" data-v-60833675></span> ${ssrInterpolate(s)}</li>`);
          });
          _push(`<!--]--></ul></section>`);
        } else {
          _push(`<!---->`);
        }
        if ((_h = unref(cv2).languages) == null ? void 0 : _h.length) {
          _push(`<section data-v-60833675><h2 class="cv-sidebar-title" data-v-60833675>${ssrInterpolate((_i = unref(headings).sideLanguages) != null ? _i : "Bahasa")}</h2><ul class="mt-3 space-y-2.5" data-v-60833675><!--[-->`);
          ssrRenderList(unref(cv2).languages, (l, i) => {
            _push(`<li class="flex items-center justify-between gap-3 text-sm print:text-xs" data-v-60833675><span class="font-medium text-white" data-v-60833675>${ssrInterpolate(l.name)}</span><span class="text-white/75" data-v-60833675>${ssrInterpolate(l.level)}</span></li>`);
          });
          _push(`<!--]--></ul></section>`);
        } else {
          _push(`<!---->`);
        }
        if ((_j = unref(cv2).certifications) == null ? void 0 : _j.length) {
          _push(`<section data-v-60833675><h2 class="cv-sidebar-title" data-v-60833675>${ssrInterpolate((_k = unref(headings).sideCerts) != null ? _k : "Sertifikasi")}</h2><ul class="mt-3 space-y-3.5" data-v-60833675><!--[-->`);
          ssrRenderList(unref(cv2).certifications, (c, i) => {
            _push(`<li data-v-60833675><p class="text-sm font-semibold leading-snug text-white print:text-xs" data-v-60833675>${ssrInterpolate(c.name)}</p><p class="mt-0.5 text-xs text-white/75 print:text-[10px]" data-v-60833675>${ssrInterpolate(c.issuer)} \u2022 ${ssrInterpolate(c.year)}</p></li>`);
          });
          _push(`<!--]--></ul></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></aside><main class="space-y-9 bg-white p-10 print:p-8 md:p-12" data-v-60833675>`);
        if (unref(cv2).summary) {
          _push(`<section data-v-60833675><h2 class="cv-section-title" data-v-60833675><span class="cv-section-icon" data-v-60833675>`);
          _push(ssrRenderComponent(unref(Sparkles), {
            size: 14,
            "stroke-width": 2
          }, null, _parent));
          _push(`</span> ${ssrInterpolate((_l = unref(headings).mainProfile) != null ? _l : "Profil")}</h2><p class="mt-3 text-sm leading-relaxed text-gray-700 print:text-[11px] print:leading-relaxed" data-v-60833675>${ssrInterpolate(unref(cv2).summary)}</p></section>`);
        } else {
          _push(`<!---->`);
        }
        if ((_m = unref(cv2).experiences) == null ? void 0 : _m.length) {
          _push(`<section data-v-60833675><h2 class="cv-section-title" data-v-60833675><span class="cv-section-icon" data-v-60833675>`);
          _push(ssrRenderComponent(unref(Briefcase), {
            size: 14,
            "stroke-width": 2
          }, null, _parent));
          _push(`</span> ${ssrInterpolate((_n = unref(headings).mainExperience) != null ? _n : "Pengalaman Kerja")}</h2><div class="mt-5 space-y-7" data-v-60833675><!--[-->`);
          ssrRenderList(unref(cv2).experiences, (e, i) => {
            _push(`<div class="relative border-l-2 border-violet-200 pl-5" data-v-60833675><span class="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-violet-600" aria-hidden="true" data-v-60833675></span><div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1" data-v-60833675><h3 class="text-base font-bold text-gray-900 print:text-[12px]" data-v-60833675>${ssrInterpolate(e.role)}</h3><span class="text-xs font-medium text-gray-500 print:text-[10px]" data-v-60833675>${ssrInterpolate(e.period)}</span></div><p class="mt-0.5 text-sm font-semibold text-violet-700 print:text-[11px]" data-v-60833675>${ssrInterpolate(e.company)}</p>`);
            if (e.description) {
              _push(`<p class="mt-1.5 text-sm leading-relaxed text-gray-600 print:text-[11px] print:leading-relaxed" data-v-60833675>${ssrInterpolate(e.description)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if ((_o = unref(cv2).education) == null ? void 0 : _o.length) {
          _push(`<section data-v-60833675><h2 class="cv-section-title" data-v-60833675><span class="cv-section-icon" data-v-60833675>`);
          _push(ssrRenderComponent(unref(GraduationCap), {
            size: 14,
            "stroke-width": 2
          }, null, _parent));
          _push(`</span> ${ssrInterpolate((_p = unref(headings).mainEducation) != null ? _p : "Pendidikan")}</h2><div class="mt-5 space-y-6" data-v-60833675><!--[-->`);
          ssrRenderList(unref(cv2).education, (e, i) => {
            _push(`<div class="relative border-l-2 border-violet-200 pl-5" data-v-60833675><span class="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-violet-600" aria-hidden="true" data-v-60833675></span><div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1" data-v-60833675><h3 class="text-base font-bold text-gray-900 print:text-[12px]" data-v-60833675>${ssrInterpolate(e.degree)}</h3>`);
            if (e.period) {
              _push(`<span class="text-xs font-medium text-gray-500 print:text-[10px]" data-v-60833675>${ssrInterpolate(e.period)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><p class="mt-0.5 text-sm font-semibold text-violet-700 print:text-[11px]" data-v-60833675>${ssrInterpolate(e.school)}</p>`);
            if (e.description) {
              _push(`<p class="mt-1.5 text-sm leading-relaxed text-gray-600 print:text-[11px] print:leading-relaxed" data-v-60833675>${ssrInterpolate(e.description)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</main></div>`);
      } else {
        _push(`<p class="py-20 text-center text-sm text-text-muted" data-v-60833675>${ssrInterpolate((_q = unref(headings).preparing) != null ? _q : "CV sedang disiapkan.")}</p>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cv.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cv = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-60833675"]]);

export { cv as default };
//# sourceMappingURL=cv-gKqelxHl.mjs.map
