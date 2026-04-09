import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  baseVx: number; baseVy: number;
  size: number;
  opacity: number;
  hue: number; // 0 = purple, 1 = cyan
}

const COUNT = 75;
const CONNECT_DIST = 140;
const MOUSE_RADIUS = 140;

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const particles = useRef<Particle[]>([]);
  const raf = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    particles.current = Array.from({ length: COUNT }, () => {
      const vx = (Math.random() - 0.5) * 0.5;
      const vy = (Math.random() - 0.5) * 0.5;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx, vy, baseVx: vx, baseVy: vy,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.35 + 0.1,
        hue: Math.random(),
      };
    });

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ps = particles.current;
      const mx = mouse.current.x;
      const my = mouse.current.y;

      for (const p of ps) {
        const dx = mx - p.x;
        const dy = my - p.y;
        const d = Math.hypot(dx, dy);

        // Gentle attraction toward mouse
        if (d < MOUSE_RADIUS && d > 1) {
          const f = ((MOUSE_RADIUS - d) / MOUSE_RADIUS) * 0.018;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        } else {
          // Drift back to base velocity
          p.vx += (p.baseVx - p.vx) * 0.02;
          p.vy += (p.baseVy - p.vy) * 0.02;
        }

        // Speed cap + damping
        p.vx *= 0.98;
        p.vy *= 0.98;
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > 2) { p.vx = (p.vx / spd) * 2; p.vy = (p.vy / spd) * 2; }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Dot — interpolate between purple and cyan
        const r = Math.round(108 + (56 - 108) * p.hue);   // 108→56
        const g = Math.round(71  + (189 - 71)  * p.hue);   // 71→189
        const b = Math.round(255 + (248 - 255) * p.hue);   // 255→248
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
        ctx.fill();
      }

      // Connections
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const d = Math.hypot(ps[i].x - ps[j].x, ps[i].y - ps[j].y);
          if (d < CONNECT_DIST) {
            const alpha = (1 - d / CONNECT_DIST) * 0.18;
            const mid = (ps[i].hue + ps[j].hue) / 2;
            const r = Math.round(108 + (56 - 108) * mid);
            const g = Math.round(71  + (189 - 71)  * mid);
            const b = Math.round(255 + (248 - 255) * mid);
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      raf.current = requestAnimationFrame(tick);
    };
    tick();

    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.55 }}
    />
  );
}
