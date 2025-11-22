const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;
window.addEventListener('resize', () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; });

const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const chars = Array.from({length:150}, () => ({
  x: Math.random()*w,
  y: Math.random()*h,
  speed: 0.2+Math.random()*1,
  char: katakana[Math.floor(Math.random()*katakana.length)],
  size: 14+Math.random()*18
}));

function draw() {
  ctx.clearRect(0,0,w,h);
  chars.forEach(c => {
    ctx.font = `${c.size}px monospace`;
    ctx.fillStyle = `rgba(0,255,255,${0.1 + Math.random()*0.5})`;
    ctx.fillText(c.char, c.x, c.y);
    c.y -= c.speed;
    if (c.y < -20) { c.y = h+20; c.x = Math.random()*w; c.char = katakana[Math.floor(Math.random()*katakana.length)]; }
  });
  requestAnimationFrame(draw);
}

draw();
