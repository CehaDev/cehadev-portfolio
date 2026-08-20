const techIcons = {
  javascript: { name: "JavaScript", color: "#F7DF1E", glyph: "JS" },
  typescript: { name: "TypeScript", color: "#3178C6", glyph: "TS" },
  vue: { name: "Vue.js", color: "#4FC08D", glyph: "Vue" },
  nuxt: { name: "Nuxt.js", color: "#00DC82", glyph: "Nuxt" },
  tailwind: { name: "Tailwind CSS", color: "#38BDF8", glyph: "Tail" },
  node: { name: "Node.js", color: "#5FA04E", glyph: "Node" },
  html5: { name: "HTML5", color: "#E34F26", glyph: "HTML5" },
  css3: { name: "CSS3", color: "#1572B6", glyph: "CSS3" },
  php: { name: "PHP", color: "#777BB4", glyph: "PHP" },
  mysql: { name: "MySQL", color: "#4479A1", glyph: "MySQL" },
  git: { name: "Git & GitHub", color: "#FFFFFF", glyph: "Git" },
  linux: { name: "Linux", color: "#FCC624", glyph: "Linux" }
};
function findTechByName(name) {
  var _a;
  const key = name.toLowerCase().replace("&", "").trim();
  return (_a = techIcons[key]) != null ? _a : Object.values(techIcons).find((t) => t.name.toLowerCase() === name.toLowerCase());
}

export { findTechByName as f, techIcons as t };
//# sourceMappingURL=useSkills-YG6FZoMb.mjs.map
