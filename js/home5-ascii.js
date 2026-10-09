const RAMP = ' ·˙∘○◌✧✦❁✿';
const FONT = '"Founders Grotesk Condensed","Arial Narrow",Arial,sans-serif';
const CORAL = [255, 74, 61];
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ---------- 1. living ASCII field behind the whole page ---------- */
const field = document.createElement('canvas');
field.className = 'a5-field';
field.setAttribute('aria-hidden', 'true');
document.body.prepend(field);
const fctx = field.getContext('2d');
const FW = 13, FH = 19;
let cols = 0, rows = 0, dpr = 1;
const mouse = { x: -99, y: -99, tx: -99, ty: -99 };
let lastScroll = scrollY, shake = 0;

function sizeField() {
  dpr = Math.min(devicePixelRatio || 1, 1.5);
  field.width = innerWidth * dpr;
  field.height = innerHeight * dpr;
  cols = Math.ceil(innerWidth / FW);
  rows = Math.ceil(innerHeight / FH);
}
sizeField();
addEventListener('resize', sizeField);
addEventListener('pointermove', (e) => { mouse.tx = e.clientX / FW; mouse.ty = e.clientY / FH; });

function drawField(t) {
  mouse.x += (mouse.tx - mouse.x) * 0.12;
  mouse.y += (mouse.ty - mouse.y) * 0.12;
  const dy = scrollY - lastScroll;
  lastScroll = scrollY;
  shake = Math.min(1, shake * 0.92 + Math.abs(dy) / 90);
  fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  fctx.clearRect(0, 0, innerWidth, innerHeight);
  fctx.font = '500 ' + (FH - 3) + 'px ' + FONT;
  fctx.textAlign = 'center';
  fctx.textBaseline = 'middle';
  const s = t * 0.001;
  const off = scrollY * 0.03;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let v = 0.5 + 0.5 * Math.sin(x * 0.11 + s * 0.7 + Math.sin((y + off) * 0.17 + s * 0.5) * 2.2);
      v *= 0.5 + 0.5 * Math.sin((y + off) * 0.09 - s * 0.35 + x * 0.04);
      const dx = x - mouse.x, dyy = (y - mouse.y) * 1.5;
      const d = Math.sqrt(dx * dx + dyy * dyy);
      v += Math.max(0, 1 - d / 11) * 1.1;
      v += shake * 0.35 * Math.sin(x * 0.7 + y * 1.3 + s * 9);
      v = Math.max(0, Math.min(1, v));
      const c = RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))];
      if (c === ' ') continue;
      fctx.fillStyle = 'rgba(' + CORAL[0] + ',' + CORAL[1] + ',' + CORAL[2] + ',' + (0.16 + v * 0.45).toFixed(3) + ')';
      fctx.fillText(c, x * FW + FW / 2, y * FH + FH / 2);
    }
  }
}
let lastFrame = 0;
function loop(t) {
  if (!document.hidden && t - lastFrame > 40) { lastFrame = t; drawField(t); }
  requestAnimationFrame(loop);
}
if (reduce) drawField(2000); else requestAnimationFrame(loop);

/* ---------- 2. photos stay normal; hover turns them into ASCII ---------- */
const CW = 7, CH = 10;
function renderImg(img, canvas) {
  const w = Math.round(img.offsetWidth), h = Math.round(img.offsetHeight);
  if (!w || !h || !img.naturalWidth) return;
  const c = Math.max(8, Math.floor(w / CW)), r = Math.max(8, Math.floor(h / CH));
  const d = Math.min(devicePixelRatio || 1, 2);
  canvas.width = w * d; canvas.height = h * d;
  canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  canvas.style.left = img.offsetLeft + 'px'; canvas.style.top = img.offsetTop + 'px';
  canvas.style.borderRadius = getComputedStyle(img).borderRadius;
  const sm = document.createElement('canvas');
  sm.width = c; sm.height = r;
  const sctx = sm.getContext('2d', { willReadFrequently: true });
  const ir = img.naturalWidth / img.naturalHeight, cr = w / h;
  let sw = img.naturalWidth, sh = img.naturalHeight, sx = 0, sy = 0;
  if (ir > cr) { sw = sh * cr; sx = (img.naturalWidth - sw) / 2; } else { sh = sw / cr; sy = (img.naturalHeight - sh) / 2; }
  try { sctx.drawImage(img, sx, sy, sw, sh, 0, 0, c, r); } catch (e) { return; }
  const px = sctx.getImageData(0, 0, c, r).data;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(d, 0, 0, d, 0, 0);
  ctx.fillStyle = '#090001';
  ctx.fillRect(0, 0, w, h);
  ctx.font = '500 ' + (CH + 1) + 'px ' + FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const cw = w / c, ch = h / r;
  for (let y = 0; y < r; y++) {
    for (let x = 0; x < c; x++) {
      const i = (y * c + x) * 4;
      let l = (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255;
      l = Math.min(1, Math.pow(l, 0.75) * 1.15);
      const ch2 = RAMP[Math.min(RAMP.length - 1, Math.floor(l * RAMP.length))];
      if (ch2 === ' ') continue;
      const q = l * l;
      ctx.fillStyle = 'rgb(255,' + Math.round(CORAL[1] + 181 * q) + ',' + Math.round(CORAL[2] + 190 * q) + ')';
      ctx.fillText(ch2, x * cw + cw / 2, y * ch + ch / 2);
    }
  }
}
function setupImg(img) {
  if (img.dataset.ascii) return;
  const host = img.parentElement;
  if (!host || img.offsetWidth < 120 || img.offsetHeight < 120) return;
  img.dataset.ascii = '1';
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
  host.classList.add('ascii-host');
  const canvas = document.createElement('canvas');
  canvas.className = 'ascii-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);
  const draw = () => renderImg(img, canvas);
  if (img.complete) draw(); else img.addEventListener('load', draw, { once: true });
  new ResizeObserver(draw).observe(img);
}
function initImgs() {
  return;
  document.querySelectorAll('main img').forEach((img) => {
    if (img.closest('.section-orbit, header, .reviews, .newsletter, .hero')) return;
    setupImg(img);
  });
}
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => {
  addEventListener('load', () => setTimeout(initImgs, 250));
  if (document.readyState === 'complete') setTimeout(initImgs, 250);
});

/* ---------- 3. ASCII ticker tape between sections ---------- */
const TAPE = [
  '+++ GEBURT GESCHIEHT IM KÖRPER +++ WOMB & HEART +++ KNOW / EMBODY / REGULATE / SURRENDER +++ ',
  '/// YOGA NIDRA /// NICHT ALLES LÄSST SICH DENKEN /// MANCHES MÜSSEN WIR ERFAHREN /// ',
  '*** LIE DOWN. LISTEN. NOTICE. *** WISSEN * ERFAHRUNG * KÖRPER *** ',
];
function tape(after, i, cls) {
  const sec = document.querySelector(after);
  if (!sec) return;
  const el = document.createElement('div');
  el.className = 'a5-ticker ' + cls;
  el.setAttribute('aria-hidden', 'true');
  const s = TAPE[i].repeat(4);
  el.innerHTML = '<div class="a5-track"><span>' + s + '</span><span>' + s + '</span></div>';
  sec.after(el);
}
tape('#two-ways', 0, 'a5-ticker--solid');
tape('#mothering-the-mother', 1, 'a5-ticker--line');
tape('#book', 2, 'a5-ticker--solid a5-ticker--rev');


