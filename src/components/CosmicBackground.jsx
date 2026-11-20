import { useEffect, useRef } from "react";

/**
 * Full-screen cinematic canvas background.
 * Deep-space scene with layered stars, nebula clouds,
 * drifting cosmic particles, and a slow red energy wave.
 * Entirely different from the Login particle background.
 */
export default function CosmicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationId;
    let w, h;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* ---------- STATIC STAR FIELD ---------- */
    const starCount = Math.min(400, Math.floor((w * h) / 3000));
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.003 + 0.001,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    /* ---------- TWINKLING STARS ---------- */
    const twinkleCount = Math.min(80, Math.floor(starCount * 0.2));
    const twinklers = Array.from({ length: twinkleCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.6,
      a: 0,
      baseAlpha: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 0.004 + 0.002,
      offset: Math.random() * Math.PI * 2,
    }));

    /* ---------- NEBULA CLOUDS ---------- */
    const nebulae = [
      { x: w * 0.15, y: h * 0.25, rx: w * 0.25, ry: h * 0.2, color: [40, 0, 60] },
      { x: w * 0.75, y: h * 0.7, rx: w * 0.3, ry: h * 0.22, color: [20, 0, 40] },
      { x: w * 0.5, y: h * 0.5, rx: w * 0.35, ry: h * 0.3, color: [50, 5, 10] },
    ];

    /* ---------- COSMIC PARTICLES ---------- */
    const particleCount = Math.min(60, Math.floor((w * h) / 20000));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2.5 + 0.8,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2 - 0.1, // slight upward drift
      alpha: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.7
        ? `${180 + Math.floor(Math.random() * 75)}, ${Math.floor(Math.random() * 30)}, ${Math.floor(Math.random() * 30)}`
        : `${180 + Math.floor(Math.random() * 75)}, ${180 + Math.floor(Math.random() * 75)}, ${200 + Math.floor(Math.random() * 55)}`,
    }));

    /* ---------- RED ENERGY WAVE (horizontal band) ---------- */
    let wavePhase = 0;

    /* ---------- DRAW HELPERS ---------- */
    const drawNebulae = (time) => {
      nebulae.forEach((n, i) => {
        const pulse = Math.sin(time * 0.0003 + i) * 0.02 + 0.08;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, Math.max(n.rx, n.ry));
        grad.addColorStop(0, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${pulse})`);
        grad.addColorStop(0.5, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${pulse * 0.35})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(n.x, n.y, n.rx, n.ry, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawStars = (time) => {
      stars.forEach((s) => {
        const flicker = Math.sin(time * s.twinkleSpeed + s.twinkleOffset) * 0.15;
        const alpha = Math.max(0.05, s.a + flicker);
        ctx.fillStyle = `rgba(220, 225, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawTwinklers = (time) => {
      twinklers.forEach((t) => {
        t.a = t.baseAlpha * (0.5 + 0.5 * Math.sin(time * t.speed + t.offset));
        if (t.a < 0.03) return;
        // cross flare
        ctx.strokeStyle = `rgba(200, 210, 255, ${t.a * 0.35})`;
        ctx.lineWidth = 0.5;
        const len = t.r * 4;
        ctx.beginPath();
        ctx.moveTo(t.x - len, t.y);
        ctx.lineTo(t.x + len, t.y);
        ctx.moveTo(t.x, t.y - len);
        ctx.lineTo(t.x, t.y + len);
        ctx.stroke();
        // core
        ctx.fillStyle = `rgba(230, 235, 255, ${t.a})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawParticles = (time) => {
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // wrap
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;
        if (p.y < -5) p.y = h + 5;
        if (p.y > h + 5) p.y = -5;

        const pulse = Math.sin(time * 0.002 + p.x * 0.005) * 0.1;
        const alpha = Math.max(0, p.alpha + pulse);

        // glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grad.addColorStop(0, `rgba(${p.color}, ${alpha * 0.6})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // core
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawEnergyWave = (time) => {
      wavePhase = time * 0.0004;
      const waveY = h * 0.5 + Math.sin(wavePhase) * h * 0.15;
      const grad = ctx.createLinearGradient(0, waveY - h * 0.08, 0, waveY + h * 0.08);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(0.3, "rgba(180, 20, 20, 0.04)");
      grad.addColorStop(0.5, "rgba(220, 40, 40, 0.06)");
      grad.addColorStop(0.7, "rgba(180, 20, 20, 0.04)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, waveY - h * 0.08, w, h * 0.16);

      // Subtle sine line
      ctx.strokeStyle = "rgba(220, 50, 50, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const y = waveY + Math.sin(x * 0.003 + wavePhase * 2) * 12;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    /* ---------- MAIN LOOP ---------- */
    const animate = (time) => {
      ctx.clearRect(0, 0, w, h);

      // Deep space base gradient
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#030108");
      bg.addColorStop(0.4, "#050210");
      bg.addColorStop(0.7, "#080212");
      bg.addColorStop(1, "#030108");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      drawNebulae(time);
      drawStars(time);
      drawTwinklers(time);
      drawEnergyWave(time);
      drawParticles(time);

      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
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
