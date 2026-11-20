import { useEffect, useRef } from "react";

/**
 * Full-screen hyperspeed background.
 * Stars stretch into red/white glowing light trails as they rush toward the camera.
 * Inspired by the ReactBits Hyperspeed concept but built independently.
 * Canvas-based, performant, responsive.
 */
export default function HyperspeedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animId;
    let w, h, cx, cy;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      cx = w / 2;
      cy = h / 2;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    /* ---------- CONFIG ---------- */
    const STAR_COUNT = 420;
    const SPEED_BASE = 1.8;
    const SPEED_VARIANCE = 1.4;
    const MAX_TRAIL_LEN = 180;

    /* ---------- STARS ---------- */
    // Each star has a 3D position. z controls depth (smaller = closer).
    const stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(createStar(true));
    }

    function createStar(randomZ) {
      // Random angle from center
      const angle = Math.random() * Math.PI * 2;
      // Random distance from center axis (spread)
      const spread = Math.random() * 1.2;
      const sx = Math.cos(angle) * spread;
      const sy = Math.sin(angle) * spread;
      // z: depth. 1 = far away, 0 = at camera
      const z = randomZ ? Math.random() * 800 + 20 : 800 + Math.random() * 200;
      const speed = SPEED_BASE + Math.random() * SPEED_VARIANCE;
      // Color: mostly white, some red, some pink
      const colorRoll = Math.random();
      let r, g, b;
      if (colorRoll < 0.15) {
        // Deep red
        r = 220 + Math.floor(Math.random() * 35);
        g = 20 + Math.floor(Math.random() * 25);
        b = 20 + Math.floor(Math.random() * 25);
      } else if (colorRoll < 0.35) {
        // Pink/light red
        r = 240 + Math.floor(Math.random() * 15);
        g = 60 + Math.floor(Math.random() * 60);
        b = 60 + Math.floor(Math.random() * 60);
      } else {
        // White with slight warmth
        r = 200 + Math.floor(Math.random() * 55);
        g = 195 + Math.floor(Math.random() * 55);
        b = 200 + Math.floor(Math.random() * 55);
      }
      return { sx, sy, z, speed, r, g, b };
    }

    /* ---------- DRAW ---------- */
    const animate = (time) => {
      // Dark space gradient
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
      bg.addColorStop(0, "#0a0214");
      bg.addColorStop(0.4, "#060110");
      bg.addColorStop(1, "#020108");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Subtle center glow
      const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.15);
      centerGlow.addColorStop(0, "rgba(180, 20, 40, 0.06)");
      centerGlow.addColorStop(0.5, "rgba(120, 10, 20, 0.025)");
      centerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, w, h);

      // Draw each star trail
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Project 3D to 2D: spread increases as z decreases
        const perspective = 400 / (s.z + 400);
        const px = cx + s.sx * perspective * w * 0.5;
        const py = cy + s.sy * perspective * h * 0.5;

        // Move star toward camera
        s.z -= s.speed;

        // Project new position
        const newPerspective = 400 / (s.z + 400);
        const npx = cx + s.sx * newPerspective * w * 0.5;
        const npy = cy + s.sy * newPerspective * h * 0.5;

        // Reset if past camera or off screen
        if (s.z < 0 || npx < -50 || npx > w + 50 || npy < -50 || npy > h + 50) {
          stars[i] = createStar(false);
          continue;
        }

        // Trail length scales with speed and proximity
        const trailFactor = Math.min(1, (800 - s.z) / 600);
        const dx = npx - px;
        const dy = npy - py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const trailLen = Math.min(dist * 2.5, MAX_TRAIL_LEN * trailFactor);

        // Trail end point (backwards along direction)
        const nx = dist > 0 ? dx / dist : 0;
        const ny = dist > 0 ? dy / dist : 0;
        const tx = npx - nx * trailLen;
        const ty = npy - ny * trailLen;

        // Opacity based on depth
        const alpha = Math.min(1, trailFactor * 0.9);

        // Draw trail line
        const grad = ctx.createLinearGradient(tx, ty, npx, npy);
        grad.addColorStop(0, `rgba(${s.r}, ${s.g}, ${s.b}, 0)`);
        grad.addColorStop(0.3, `rgba(${s.r}, ${s.g}, ${s.b}, ${alpha * 0.3})`);
        grad.addColorStop(0.8, `rgba(${s.r}, ${s.g}, ${s.b}, ${alpha * 0.7})`);
        grad.addColorStop(1, `rgba(${s.r}, ${s.g}, ${s.b}, ${alpha})`);

        const lineWidth = Math.max(0.3, trailFactor * 2.2);

        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(npx, npy);
        ctx.strokeStyle = grad;
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        // Glow at the head
        if (trailFactor > 0.3) {
          const glowSize = 2 + trailFactor * 4;
          const headGlow = ctx.createRadialGradient(npx, npy, 0, npx, npy, glowSize);
          headGlow.addColorStop(0, `rgba(${s.r}, ${s.g}, ${s.b}, ${alpha * 0.5})`);
          headGlow.addColorStop(1, `rgba(${s.r}, ${s.g}, ${s.b}, 0)`);
          ctx.fillStyle = headGlow;
          ctx.beginPath();
          ctx.arc(npx, npy, glowSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Radial speed streaks — faint converging lines toward center
      ctx.globalAlpha = 0.015;
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + time * 0.00003;
        const len = Math.max(w, h) * 0.6;
        const x1 = cx + Math.cos(angle) * 40;
        const y1 = cy + Math.sin(angle) * 40;
        const x2 = cx + Math.cos(angle) * len;
        const y2 = cy + Math.sin(angle) * len;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "#e23636";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
