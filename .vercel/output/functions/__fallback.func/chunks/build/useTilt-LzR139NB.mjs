import { ref } from 'vue';

function useTilt(max = 8) {
  const tiltRef = ref(null);
  const glareRef = ref(null);
  const reduced = () => false;
  function onMove(e) {
    const el = tiltRef.value;
    if (!el || reduced()) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * max;
    const ry = (px - 0.5) * max;
    el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
    if (glareRef.value) {
      glareRef.value.style.background = `radial-gradient(circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(255,255,255,0.22), transparent 45%)`;
    }
  }
  function onLeave() {
    const el = tiltRef.value;
    if (!el) return;
    el.style.transform = "";
    if (glareRef.value) glareRef.value.style.background = "";
  }
  return { tiltRef, glareRef, onMove, onLeave };
}

export { useTilt as u };
//# sourceMappingURL=useTilt-LzR139NB.mjs.map
