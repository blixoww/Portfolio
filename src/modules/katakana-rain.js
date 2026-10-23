/* Pluie de katakana en arrière-plan (canvas). */
import { prefersReducedMotion } from './motion.js';

const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
const FONT_SIZE = 16;
const FRAME_MS = 50; // ~20 i/s : suffisant pour l'effet, économe en CPU/batterie

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

export function initKatakanaRain(canvas) {
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;

  let colors = {};
  let drops = [];
  let width = 0;
  let height = 0;
  let rafId = 0;
  let last = 0;

  const readColors = () => {
    const style = getComputedStyle(document.documentElement);
    colors = {
      body: style.getPropertyValue('--rain').trim() || '#00f0ff',
      head: style.getPropertyValue('--rain-head').trim() || '#ffffff',
    };
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = `${FONT_SIZE}px monospace`;
    ctx.textBaseline = 'top';

    // Conserve les colonnes existantes, en ajoute ou en retire selon la largeur.
    const columns = Math.ceil(width / FONT_SIZE);
    drops = Array.from({ length: columns }, (_, i) => drops[i] ?? Math.random() * -height / FONT_SIZE);
  };

  const drawFrame = () => {
    // Estompe l'image précédente sans peindre de fond : le canvas reste transparent
    // et fonctionne quel que soit le thème.
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.09)';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';

    for (let i = 0; i < drops.length; i++) {
      const x = i * FONT_SIZE;
      const y = drops[i] * FONT_SIZE;
      if (y >= 0) {
        ctx.fillStyle = colors.body;
        ctx.fillText(randomGlyph(), x, y - FONT_SIZE);
        ctx.fillStyle = colors.head;
        ctx.fillText(randomGlyph(), x, y);
      }
      if (y > height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 1;
    }
  };

  const loop = (time) => {
    rafId = requestAnimationFrame(loop);
    if (time - last < FRAME_MS) return;
    last = time;
    drawFrame();
  };

  const drawStatic = () => {
    // Mouvement réduit : une seule image figée, sans animation.
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = colors.body;
    for (let i = 0; i < drops.length; i++) {
      const length = 4 + Math.floor(Math.random() * 14);
      const start = Math.floor(Math.random() * (height / FONT_SIZE));
      for (let j = 0; j < length; j++) {
        ctx.globalAlpha = 1 - j / length;
        ctx.fillText(randomGlyph(), i * FONT_SIZE, (start - j) * FONT_SIZE);
      }
    }
    ctx.globalAlpha = 1;
  };

  const start = () => {
    cancelAnimationFrame(rafId);
    if (prefersReducedMotion) drawStatic();
    else rafId = requestAnimationFrame(loop);
  };

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); if (prefersReducedMotion) drawStatic(); }, 150);
  });

  // Pas d'animation quand l'onglet n'est pas visible.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else start();
  });

  document.addEventListener('themechange', () => {
    readColors();
    ctx.clearRect(0, 0, width, height);
    if (prefersReducedMotion) drawStatic();
  });

  readColors();
  resize();
  start();
}
