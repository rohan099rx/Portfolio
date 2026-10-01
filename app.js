const cursorGlow = document.querySelector('.cursor-glow');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];
const reveals = document.querySelectorAll('.reveal');

window.addEventListener('pointermove', (event) => {
  if (cursorGlow) {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
reveals.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 55, 260)}ms`;
  revealObserver.observe(element);
});

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach((section) => navObserver.observe(section));

document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const feedback = document.querySelector('#form-feedback');
  const name = new FormData(form).get('name');
  feedback.textContent = `Signal received, ${name || 'friend'} — I’ll reply at the speed of a good API.`;
  form.reset();
});

document.querySelector('#year').textContent = new Date().getFullYear();


// Custom fragment-shader particle field: a no-dependency, pointer-reactive neural fog.
const shaderCanvas = document.querySelector('#shader-canvas');
if (shaderCanvas) {
  const gl = shaderCanvas.getContext('webgl', { alpha: true, antialias: false });
  if (gl) {
    const vertexSource = `attribute vec2 position; void main(){ gl_Position = vec4(position,0.0,1.0); }`;
    const fragmentSource = `precision mediump float;
      uniform float u_time; uniform vec2 u_resolution; uniform vec2 u_mouse;
      float hash(float n){ return fract(sin(n)*43758.5453123); }
      void main(){
        vec2 uv=(gl_FragCoord.xy/u_resolution.xy)*2.0-1.0;
        uv.x*=u_resolution.x/u_resolution.y;
        vec2 mouse=(u_mouse/u_resolution.xy)*2.0-1.0;
        mouse.x*=u_resolution.x/u_resolution.y;
        vec3 color=vec3(0.0);
        float t=u_time*.18;
        for(float i=0.0;i<52.0;i++){
          float seed=i*7.13;
          vec2 p=vec2(hash(seed)*2.0-1.0,hash(seed+4.2)*2.0-1.0);
          p.x*=u_resolution.x/u_resolution.y;
          p+=vec2(sin(t+seed)*.16,cos(t*.8+seed)*.12);
          p+=mouse*.08;
          float d=length(uv-p);
          float glow=.0025/(d*d+.0025);
          float twinkle=.55+.45*sin(u_time*1.7+seed);
          color+=vec3(.55,.95,.18)*glow*twinkle*.018;
        }
        float vignette=1.0-smoothstep(.35,1.5,length(uv));
        color*=vignette;
        gl_FragColor=vec4(color,.9);
      }`;
    const compile = (type, source) => { const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader); return shader; };
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    const timeUniform = gl.getUniformLocation(program, 'u_time');
    const resolutionUniform = gl.getUniformLocation(program, 'u_resolution');
    const mouseUniform = gl.getUniformLocation(program, 'u_mouse');
    const pointer = { x: 0, y: 0 };
    const resize = () => { const ratio = Math.min(window.devicePixelRatio || 1, 2); shaderCanvas.width = shaderCanvas.clientWidth * ratio; shaderCanvas.height = shaderCanvas.clientHeight * ratio; gl.viewport(0, 0, shaderCanvas.width, shaderCanvas.height); };
    shaderCanvas.parentElement.addEventListener('pointermove', (event) => { const rect = shaderCanvas.getBoundingClientRect(); pointer.x = (event.clientX - rect.left) * (shaderCanvas.width / rect.width); pointer.y = (rect.height - event.clientY + rect.top) * (shaderCanvas.height / rect.height); }, { passive: true });
    window.addEventListener('resize', resize, { passive: true }); resize();
    const render = (now) => { gl.useProgram(program); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0); gl.uniform1f(timeUniform, now * .001); gl.uniform2f(resolutionUniform, shaderCanvas.width, shaderCanvas.height); gl.uniform2f(mouseUniform, pointer.x, pointer.y); gl.drawArrays(gl.TRIANGLES, 0, 6); requestAnimationFrame(render); };
    requestAnimationFrame(render);
  } else { shaderCanvas.hidden = true; }
}

// Four-design palette: visitors can see and switch the visual language without leaving the page.
const themeToggle = document.querySelector('#theme-toggle');
const themeMenu = document.querySelector('#theme-menu');
const themeChoices = [...document.querySelectorAll('.theme-choice')];
const themeNames = { cybercore: 'space math', neo: 'neo-brutalism', scrapbook: 'scrapbook', y2k: 'y2k' };
const storedTheme = localStorage.getItem('rohan-theme');
const savedTheme = storedTheme === 'neo' ? 'neo' : ['cybercore', 'scrapbook', 'y2k'].includes(storedTheme) ? storedTheme : 'cybercore';
const setTheme = (theme) => {
  document.body.classList.remove('neo-brutal', 'scrapbook-theme', 'y2k-theme');
  if (theme === 'neo') document.body.classList.add('neo-brutal');
  if (theme === 'scrapbook') document.body.classList.add('scrapbook-theme');
  if (theme === 'y2k') document.body.classList.add('y2k-theme');
  themeChoices.forEach((choice) => choice.classList.toggle('is-active', choice.dataset.theme === theme));
  if (themeToggle) themeToggle.textContent = `design / ${themeNames[theme]}`;
  localStorage.setItem('rohan-theme', theme);
  window.dispatchEvent(new CustomEvent('rohan-theme-change', { detail: theme }));
};
setTheme(savedTheme);
themeToggle?.addEventListener('click', () => {
  const open = themeMenu?.classList.toggle('is-open');
  themeToggle.setAttribute('aria-expanded', String(Boolean(open)));
});
themeChoices.forEach((choice) => choice.addEventListener('click', () => {
  setTheme(choice.dataset.theme);
  themeMenu?.classList.remove('is-open');
  themeToggle?.setAttribute('aria-expanded', 'false');
}));
document.addEventListener('click', (event) => {
  if (!event.target.closest('.theme-picker')) {
    themeMenu?.classList.remove('is-open');
    themeToggle?.setAttribute('aria-expanded', 'false');
  }
});

// Signal Catcher: a tiny 4x4 reflex game that mirrors a moving retrieval target.
const gameGrid = document.querySelector('#game-grid');
const gameStart = document.querySelector('#game-start');
const gameOverlay = document.querySelector('#game-overlay');
const gameScore = document.querySelector('#game-score');
const gameStreak = document.querySelector('#game-streak');
const gameTime = document.querySelector('#game-time');
const gameFeedback = document.querySelector('#game-feedback');
if (gameGrid && gameStart) {
  let target = -1; let score = 0; let streak = 0; let time = 20; let timer = null; let playing = false;
  const cells = Array.from({ length: 16 }, (_, index) => { const cell = document.createElement('button'); cell.type = 'button'; cell.className = 'game-cell'; cell.setAttribute('aria-label', `Vector cell ${index + 1}`); gameGrid.appendChild(cell); return cell; });
  const updateStats = () => { gameScore.textContent = String(score).padStart(2, '0'); gameStreak.textContent = String(streak).padStart(2, '0'); gameTime.textContent = String(time).padStart(2, '0'); };
  const placeTarget = () => { cells.forEach((cell) => cell.classList.remove('signal')); target = Math.floor(Math.random() * cells.length); cells[target].classList.add('signal'); };
  const endGame = () => { playing = false; clearInterval(timer); timer = null; cells.forEach((cell) => cell.classList.remove('signal')); gameOverlay.classList.remove('is-hidden'); gameOverlay.querySelector('span').textContent = `RUN COMPLETE / ${score} HITS`; gameFeedback.textContent = score > 8 ? 'Fast retrieval. The model approves.' : 'Good signal. Try to build a longer streak.'; gameStart.textContent = 'Run it again'; };
  gameStart.addEventListener('click', () => { score = 0; streak = 0; time = 20; playing = true; updateStats(); gameOverlay.classList.add('is-hidden'); gameFeedback.textContent = 'Target acquired. Click the live vector.'; gameStart.textContent = 'Restart run'; placeTarget(); clearInterval(timer); timer = setInterval(() => { time -= 1; updateStats(); if (time <= 0) endGame(); }, 1000); });
  cells.forEach((cell, index) => cell.addEventListener('click', () => { if (!playing) return; if (index === target) { score += 1; streak += 1; gameFeedback.textContent = streak > 2 ? `Streak ${streak}: clean retrieval.` : 'Correct vector. Re-ranking...'; placeTarget(); } else { streak = 0; gameFeedback.textContent = 'Missed chunk. Re-grounding context.'; } updateStats(); }));
  updateStats();
}


// Snake: a second local-only game that reads the active theme colors on every render.
const snakeCanvas = document.querySelector('#snake-canvas');
const snakeStart = document.querySelector('#snake-start');
const snakeScore = document.querySelector('#snake-score');
const snakeBest = document.querySelector('#snake-best');
const snakeState = document.querySelector('#snake-state');
const snakeFeedback = document.querySelector('#snake-feedback');
const snakeOverlay = document.querySelector('#snake-overlay');
if (snakeCanvas && snakeStart) {
  const ctx = snakeCanvas.getContext('2d');
  const size = 12;
  let snake = []; let food = { x: 8, y: 6 }; let direction = { x: 1, y: 0 }; let queued = direction; let loop = null; let running = false; let score = 0; let best = Number(localStorage.getItem('rohan-snake-best') || 0);
  snakeBest.textContent = String(best).padStart(2, '0');
  const colors = () => { const styles = getComputedStyle(document.body); return { bg: styles.getPropertyValue('--black-soft').trim() || '#0d1110', line: styles.getPropertyValue('--line').trim() || '#1b2422', signal: styles.getPropertyValue('--green').trim() || '#b7ff3c', text: styles.getPropertyValue('--text').trim() || '#edf3ed' }; };
  const paint = () => { const palette = colors(); const unit = snakeCanvas.width / size; ctx.fillStyle = palette.bg; ctx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height); ctx.strokeStyle = palette.line; ctx.lineWidth = 1; for (let i = 1; i < size; i += 1) { ctx.beginPath(); ctx.moveTo(i * unit, 0); ctx.lineTo(i * unit, snakeCanvas.height); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i * unit); ctx.lineTo(snakeCanvas.width, i * unit); ctx.stroke(); } ctx.fillStyle = palette.signal; ctx.shadowColor = palette.signal; ctx.shadowBlur = 14; ctx.fillRect(food.x * unit + 7, food.y * unit + 7, unit - 14, unit - 14); snake.forEach((part, index) => { ctx.fillStyle = index === 0 ? palette.text : palette.signal; ctx.shadowColor = palette.signal; ctx.shadowBlur = index === 0 ? 5 : 12; ctx.fillRect(part.x * unit + 4, part.y * unit + 4, unit - 8, unit - 8); }); ctx.shadowBlur = 0; };
  const randomFood = () => { let next; do { next = { x: Math.floor(Math.random() * size), y: Math.floor(Math.random() * size) }; } while (snake.some((part) => part.x === next.x && part.y === next.y)); return next; };
  const setDirection = (next) => { if (next.x === -direction.x && next.y === -direction.y) return; queued = next; };
  const stop = (message) => { running = false; clearInterval(loop); loop = null; if (score > best) { best = score; localStorage.setItem('rohan-snake-best', String(best)); snakeBest.textContent = String(best).padStart(2, '0'); } snakeState.textContent = score ? 'DONE' : 'IDLE'; snakeFeedback.textContent = message; snakeOverlay.classList.remove('is-hidden'); snakeOverlay.querySelector('span').textContent = score ? `ROUTE COMPLETE / ${score} CHUNKS` : 'AWAITING ROUTE'; snakeStart.textContent = 'Run snake again'; paint(); };
  const tick = () => { direction = queued; const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y }; const hitWall = head.x < 0 || head.x >= size || head.y < 0 || head.y >= size; const hitSelf = snake.some((part) => part.x === head.x && part.y === head.y); if (hitWall || hitSelf) { stop('Pipeline crashed. Try a cleaner route.'); return; } snake.unshift(head); if (head.x === food.x && head.y === food.y) { score += 1; snakeScore.textContent = String(score).padStart(2, '0'); snakeFeedback.textContent = `Chunk ${score} secured. Keep routing.`; food = randomFood(); } else snake.pop(); paint(); };
  const start = () => { snake = [{ x: 5, y: 6 }, { x: 4, y: 6 }, { x: 3, y: 6 }]; food = { x: 9, y: 3 }; direction = { x: 1, y: 0 }; queued = direction; score = 0; snakeScore.textContent = '00'; snakeState.textContent = 'LIVE'; snakeFeedback.textContent = 'Route active. Use arrows or the pad.'; snakeOverlay.classList.add('is-hidden'); snakeStart.textContent = 'Restart snake'; running = true; clearInterval(loop); loop = setInterval(tick, 145); paint(); };
  snakeStart.addEventListener('click', start);
  document.addEventListener('keydown', (event) => { const moves = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } }; if (moves[event.key] && running) { event.preventDefault(); setDirection(moves[event.key]); } });
  document.querySelectorAll('.snake-pad [data-dir]').forEach((button) => button.addEventListener('click', () => { const moves = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } }; if (running) setDirection(moves[button.dataset.dir]); }));
  snakeCanvas.addEventListener('click', () => { if (!running) return; });
  window.addEventListener('rohan-theme-change', paint);
  snakeState.textContent = 'IDLE'; paint();
}


// Project-card physics: pointer tilt gives every visual theme a tactile, dimensional response.
const physicsCards = [...document.querySelectorAll('.card-physics')];
physicsCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (window.matchMedia('(hover: none)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translate3d(0,-8px,0) rotateX(${(y * -7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg)`;
    card.style.setProperty('--physics-x', `${(x * 18).toFixed(1)}px`);
    card.style.setProperty('--physics-y', `${(y * 18).toFixed(1)}px`);
  }, { passive: true });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; card.style.removeProperty('--physics-x'); card.style.removeProperty('--physics-y'); });
});


// Web Audio: a user-initiated ambient space bed plus tiny UI click tones.
const soundToggle = document.querySelector('#sound-toggle');
let audioContext = null; let ambientNodes = null; let soundEnabled = localStorage.getItem('rohan-sound') === 'on';
const ensureAudio = () => { if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)(); if (audioContext.state === 'suspended') audioContext.resume(); return audioContext; };
const playTone = (frequency = 420, duration = 0.055, type = 'sine', volume = 0.025) => { if (!soundEnabled) return; const ctx = ensureAudio(); const oscillator = ctx.createOscillator(); const gain = ctx.createGain(); oscillator.type = type; oscillator.frequency.value = frequency; gain.gain.setValueAtTime(volume, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration); oscillator.connect(gain).connect(ctx.destination); oscillator.start(); oscillator.stop(ctx.currentTime + duration); };
const stopAmbient = () => { if (!ambientNodes) return; ambientNodes.gain.gain.cancelScheduledValues(audioContext.currentTime); ambientNodes.gain.gain.setTargetAtTime(0.0001, audioContext.currentTime, .08); window.setTimeout(() => { ambientNodes?.oscillator.stop(); ambientNodes?.lfo.stop(); ambientNodes = null; }, 220); };
const startAmbient = () => { const ctx = ensureAudio(); const oscillator = ctx.createOscillator(); const lfo = ctx.createOscillator(); const lfoGain = ctx.createGain(); const gain = ctx.createGain(); oscillator.type = 'sine'; oscillator.frequency.value = 55; lfo.type = 'sine'; lfo.frequency.value = .075; lfoGain.gain.value = 8; gain.gain.value = .0001; lfo.connect(lfoGain).connect(oscillator.frequency); oscillator.connect(gain).connect(ctx.destination); oscillator.start(); lfo.start(); gain.gain.exponentialRampToValueAtTime(.018, ctx.currentTime + 1.2); ambientNodes = { oscillator, lfo, gain }; };
const updateSoundToggle = () => { if (!soundToggle) return; soundToggle.textContent = `sound / ${soundEnabled ? 'on' : 'off'}`; soundToggle.setAttribute('aria-pressed', String(soundEnabled)); soundToggle.classList.toggle('is-on', soundEnabled); };
soundToggle?.addEventListener('click', () => { soundEnabled = !soundEnabled; localStorage.setItem('rohan-sound', soundEnabled ? 'on' : 'off'); if (soundEnabled) { startAmbient(); playTone(660, .12, 'triangle', .035); } else stopAmbient(); updateSoundToggle(); });
document.addEventListener('pointerdown', (event) => { if (soundEnabled && event.target.closest('button, a')) playTone(420, .045, 'sine', .018); }, { passive: true });
updateSoundToggle();

// Orbit Lab: a lightweight Newtonian two-body playground rendered on canvas.
const orbitCanvas = document.querySelector('#orbit-canvas');
const orbitStart = document.querySelector('#orbit-start');
const orbitForce = document.querySelector('#orbit-force');
const orbitForceValue = document.querySelector('#orbit-force-value');
const orbitEnergy = document.querySelector('#orbit-energy');
const orbitDistance = document.querySelector('#orbit-distance');
const orbitState = document.querySelector('#orbit-state');
const orbitFeedback = document.querySelector('#orbit-feedback');
const orbitOverlay = document.querySelector('#orbit-overlay');
if (orbitCanvas && orbitStart) {
  const ctx = orbitCanvas.getContext('2d'); let animation = 0; let running = false; let trail = []; let probe = null; let elapsed = 0;
  const palette = () => { const css = getComputedStyle(document.body); return { bg: css.getPropertyValue('--black-soft').trim() || '#0d1110', line: css.getPropertyValue('--line').trim() || '#1b2422', green: css.getPropertyValue('--green').trim() || '#b7ff3c', text: css.getPropertyValue('--text').trim() || '#edf3ed' }; };
  const draw = () => { const colors = palette(); const w = orbitCanvas.width; const h = orbitCanvas.height; const cx = w * .52; const cy = h * .53; ctx.fillStyle = colors.bg; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = colors.line; ctx.lineWidth = 1; for (let x = 20; x < w; x += 34) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); } for (let y = 20; y < h; y += 34) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); } ctx.strokeStyle = colors.green; ctx.globalAlpha = .18; [48, 90, 138].forEach((r) => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); }); ctx.globalAlpha = 1; ctx.fillStyle = colors.green; ctx.shadowColor = colors.green; ctx.shadowBlur = 24; ctx.beginPath(); ctx.arc(cx, cy, 15, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = colors.text; ctx.font = '10px IBM Plex Mono, monospace'; ctx.fillText('MASS / 1.0', cx + 23, cy - 20); if (trail.length > 1) { ctx.strokeStyle = colors.green; ctx.globalAlpha = .45; ctx.beginPath(); trail.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y)); ctx.stroke(); ctx.globalAlpha = 1; } if (probe) { ctx.fillStyle = colors.text; ctx.shadowColor = colors.green; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(probe.x, probe.y, 7, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; } };
  const reset = () => { const cx = orbitCanvas.width * .52; const cy = orbitCanvas.height * .53; probe = { x: 120, y: cy + 35, vx: 2.75, vy: -1.95 }; trail = []; elapsed = 0; };
  const step = () => { if (!running || !probe) return; const cx = orbitCanvas.width * .52; const cy = orbitCanvas.height * .53; const gravity = Number(orbitForce.value); const dx = cx - probe.x; const dy = cy - probe.y; const distance = Math.max(28, Math.hypot(dx, dy)); const acceleration = gravity * 190 / (distance * distance); probe.vx += (dx / distance) * acceleration; probe.vy += (dy / distance) * acceleration; probe.x += probe.vx; probe.y += probe.vy; trail.push({ x: probe.x, y: probe.y }); if (trail.length > 190) trail.shift(); elapsed += 1; const speed = Math.hypot(probe.vx, probe.vy); orbitEnergy.textContent = String(Math.min(99, Math.round(speed * 10))).padStart(2, '0'); orbitDistance.textContent = String(Math.min(99, Math.round(distance / 5))).padStart(2, '0'); if (probe.x < -30 || probe.x > orbitCanvas.width + 30 || probe.y < -30 || probe.y > orbitCanvas.height + 30 || elapsed > 900) { running = false; orbitState.textContent = 'DONE'; orbitFeedback.textContent = 'Trajectory escaped. Change gravity and launch again.'; orbitOverlay.classList.remove('is-hidden'); orbitOverlay.querySelector('span').textContent = 'TRAJECTORY COMPLETE'; orbitStart.textContent = 'Launch again'; } draw(); if (running) animation = requestAnimationFrame(step); };
  orbitForce?.addEventListener('input', () => { orbitForceValue.textContent = `${Number(orbitForce.value).toFixed(1)}×`; });
  orbitStart.addEventListener('click', () => { cancelAnimationFrame(animation); reset(); running = true; orbitState.textContent = 'LIVE'; orbitFeedback.textContent = 'Gravity locked. Follow the vector.'; orbitOverlay.classList.add('is-hidden'); orbitStart.textContent = 'Restart orbit'; draw(); animation = requestAnimationFrame(step); });
  window.addEventListener('rohan-theme-change', draw); orbitForceValue.textContent = `${Number(orbitForce.value).toFixed(1)}×`; draw();
}

