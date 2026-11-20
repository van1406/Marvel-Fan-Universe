import { useEffect, useRef } from "react";

/**
 * Full-screen animated red scanning grid background.
 * Features: perspective grid, sweeping scan line, intersection glow,
 * bloom overlay, and subtle jitter. Dark & cinematic.
 * Completely distinct from CosmicBackground and ParticleBackground.
 */
export default function GridScanBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animId;
    let w, h;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    /* ---------- GRID CONFIG ---------- */
    const GRID_SPACING = 60; // base px between grid lines
    const VERTICES_PER_LINE = 24; // points along each line for jitter

    /* ---------- PRECOMPUTE GRID LINES ---------- */
    // Horizontal lines (receding into depth)
    const buildHorizontalLines = () => {
      const lines = [];
      const count = Math.ceil(h / GRID_SPACING) + 2;
      for (let i = -1; i <= count; i++) {
        const baseY = i * GRID_SPACING;
        const points = [];
        for (let j = 0; j <= VERTICES_PER_LINE; j++) {
          const t = j / VERTICES_PER_LINE;
          points.push({ x: t * w, baseY, jitter: Math.random() * 0.6 - 0.3 });
        }
        lines.push(points);
      }
      return lines;
    };

    // Vertical lines
    const buildVerticalLines = () => {
      const lines = [];
      const count = Math.ceil(w / GRID_SPACING) + 2;
      for (let i = -1; i <= count; i++) {
        const baseX = i * GRID_SPACING;
        const points = [];
        for (let j = 0; j <= VERTICES_PER_LINE; j++) {
          const t = j / VERTICES_PER_LINE;
          points.push({ y: t * h, baseX, jitter: Math.random() * 0.6 - 0.3 });
        }
        lines.push(points);
      }
      return lines;
    };

    let hLines = buildHorizontalLines();
    let vLines = buildVerticalLines();

    const rebuildGrid = () => {
      hLines = buildHorizontalLines();
      vLines = buildVerticalLines();
    };

    /* ---------- SCAN STATE ---------- */
    let scanY = -h * 0.3; // starts above screen
    const SCAN_SPEED = 0.45; // px per frame (downward)
    const SCAN_HEIGHT = h * 0.25; // visible scan zone height
    const SCAN_GLOW_RADIUS = 120;

    /* ---------- JITTER ---------- */
    let jitterTime = 0;

    /* ---------- DRAW FUNCTIONS ---------- */

    const drawGrid = (time) => {
      jitterTime = time;

      // Base grid lines — very subtle
      ctx.lineWidth = 0.5;

      // Horizontal lines
      hLines.forEach((line) => {
        ctx.beginPath();
        line.forEach((pt, idx) => {
          const jy = Math.sin(time * 0.0008 + pt.x * 0.005 + pt.jitter * 10) * pt.jitter * 1.5;
          const y = pt.baseY + jy;
          if (idx === 0) ctx.moveTo(pt.x, y);
          else ctx.lineTo(pt.x, y);
        });
        ctx.strokeStyle = "rgba(180, 20, 30, 0.06)";
        ctx.stroke();
      });

      // Vertical lines
      vLines.forEach((line) => {
        ctx.beginPath();
        line.forEach((pt, idx) => {
          const jx = Math.sin(time * 0.0008 + pt.y * 0.005 + pt.jitter * 10) * pt.jitter * 1.5;
          const x = pt.baseX + jx;
          if (idx === 0) ctx.moveTo(x, pt.y);
          else ctx.lineTo(x, pt.y);
        });
        ctx.strokeStyle = "rgba(180, 20, 30, 0.06)";
        ctx.stroke();
      });
    };

    const drawScanLine = (time) => {
      // Scan line position — wraps from top to bottom
      scanY += SCAN_SPEED;
      if (scanY > h + SCAN_HEIGHT * 0.5) {
        scanY = -SCAN_HEIGHT * 0.5;
        // Slight grid jitter burst on new sweep
        rebuildGrid();
      }

      // Scan line center
      const cy = scanY;

      // Bright horizontal scan line
      const lineGrad = ctx.createLinearGradient(0, cy - 1, 0, cy + 1);
      lineGrad.addColorStop(0, "rgba(220, 40, 50, 0)");
      lineGrad.addColorStop(0.5, "rgba(220, 40, 50, 0.35)");
      lineGrad.addColorStop(1, "rgba(220, 40, 50, 0)");
      ctx.fillStyle = lineGrad;
      ctx.fillRect(0, cy - 1, w, 2);

      // Glow band around scan line
      const glowGrad = ctx.createLinearGradient(
        0, cy - SCAN_GLOW_RADIUS,
        0, cy + SCAN_GLOW_RADIUS
      );
      glowGrad.addColorStop(0, "rgba(180, 20, 30, 0)");
      glowGrad.addColorStop(0.35, "rgba(200, 30, 40, 0.03)");
      glowGrad.addColorStop(0.5, "rgba(220, 40, 50, 0.07)");
      glowGrad.addColorStop(0.65, "rgba(200, 30, 40, 0.03)");
      glowGrad.addColorStop(1, "rgba(180, 20, 30, 0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, cy - SCAN_GLOW_RADIUS, w, SCAN_GLOW_RADIUS * 2);

      // Bloom halo — radial glow at scan center
      const bloomGrad = ctx.createRadialGradient(w * 0.5, cy, 0, w * 0.5, cy, w * 0.3);
      bloomGrad.addColorStop(0, "rgba(220, 40, 50, 0.04)");
      bloomGrad.addColorStop(0.4, "rgba(180, 20, 30, 0.02)");
      bloomGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = bloomGrad;
      ctx.fillRect(0, cy - w * 0.3, w, w * 0.6);
    };

    const drawGridGlow = (time) => {
      // Intersection glow — subtle bright spots where scan line crosses grid
      const intersectionSpacing = GRID_SPACING;
      const scanBandHalf = 40;

      vLines.forEach((line) => {
        line.forEach((pt) => {
          const jx = Math.sin(time * 0.0008 + pt.y * 0.005 + pt.jitter * 10) * pt.jitter * 1.5;
          const x = pt.baseX + jx;
          const dist = Math.abs(pt.y - scanY);
          if (dist < scanBandHalf) {
            const intensity = 1 - dist / scanBandHalf;
            const alpha = intensity * 0.25;
            const radius = 3 + intensity * 5;

            const grad = ctx.createRadialGradient(x, pt.y, 0, x, pt.y, radius);
            grad.addColorStop(0, `rgba(255, 60, 70, ${alpha})`);
            grad.addColorStop(0.5, `rgba(220, 40, 50, ${alpha * 0.4})`);
            grad.addColorStop(1, "rgba(180, 20, 30, 0)");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, pt.y, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });
    };

    const drawDepthFog = () => {
      // Top and bottom edge vignette for cinematic depth
      const topFog = ctx.createLinearGradient(0, 0, 0, h * 0.15);
      topFog.addColorStop(0, "rgba(2, 1, 8, 0.9)");
      topFog.addColorStop(1, "rgba(2, 1, 8, 0)");
      ctx.fillStyle = topFog;
      ctx.fillRect(0, 0, w, h * 0.15);

      const bottomFog = ctx.createLinearGradient(0, h * 0.85, 0, h);
      bottomFog.addColorStop(0, "rgba(2, 1, 8, 0)");
      bottomFog.addColorStop(1, "rgba(2, 1, 8, 0.9)");
      ctx.fillStyle = bottomFog;
      ctx.fillRect(0, h * 0.85, w, h * 0.15);

      // Side vignette
      const leftFog = ctx.createLinearGradient(0, 0, w * 0.1, 0);
      leftFog.addColorStop(0, "rgba(2, 1, 8, 0.7)");
      leftFog.addColorStop(1, "rgba(2, 1, 8, 0)");
      ctx.fillStyle = leftFog;
      ctx.fillRect(0, 0, w * 0.1, h);

      const rightFog = ctx.createLinearGradient(w * 0.9, 0, w, 0);
      rightFog.addColorStop(0, "rgba(2, 1, 8, 0)");
      rightFog.addColorStop(1, "rgba(2, 1, 8, 0.7)");
      ctx.fillStyle = rightFog;
      ctx.fillRect(w * 0.9, 0, w * 0.1, h);
    };

    /* ---------- MAIN LOOP ---------- */
    const animate = (time) => {
      // Dark base
      ctx.fillStyle = "#020108";
      ctx.fillRect(0, 0, w, h);

      drawGrid(time);
      drawGridGlow(time);
      drawScanLine(time);
      drawDepthFog();

      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    const onResize = () => {
      resize();
      rebuildGrid();
      scanY = -h * 0.3;
    };

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
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
