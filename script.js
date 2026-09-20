(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rand = (min, max) => min + Math.random() * (max - min);

  /* ---------- звёзды ---------- */
  function spawnStars(count) {
    const layer = document.querySelector(".stars");
    for (let i = 0; i < count; i++) {
      const star = document.createElement("span");
      star.className = "star";
      star.style.left = rand(2, 98) + "vw";
      star.style.top = rand(2, 96) + "vh";
      const size = rand(1.5, 3.5);
      star.style.setProperty("--s", size + "px");
      star.style.setProperty("--o", rand(0.25, 0.8).toFixed(2));
      star.style.setProperty("--dur", rand(2.8, 5.5).toFixed(2) + "s");
      star.style.setProperty("--delay", rand(0, 4).toFixed(2) + "s");
      layer.append(star);
    }
  }

  /* ---------- плывущие сердечки ---------- */
  function spawnHearts(count) {
    const layer = document.querySelector(".ambient");
    const colors = ["var(--rose)", "var(--gold)", "var(--rose-soft)", "var(--gold-soft)"];
    for (let i = 0; i < count; i++) {
      const heart = document.createElement("span");
      heart.className = "float-heart";
      heart.textContent = "♥";
      heart.style.setProperty("--x", rand(0, 100) + "vw");
      heart.style.setProperty("--s", rand(0.8, 2.1).toFixed(2) + "rem");
      heart.style.setProperty("--c", colors[Math.floor(rand(0, colors.length))]);
      heart.style.setProperty("--o", rand(0.10, 0.30).toFixed(2));
      heart.style.setProperty("--dur", rand(9, 18).toFixed(1) + "s");
      heart.style.setProperty("--delay", rand(0, 12).toFixed(1) + "s");
      heart.style.setProperty("--drift", rand(-14, 14).toFixed(0) + "vw");
      layer.append(heart);
    }
  }

  /* ---------- салют из сердечек ---------- */
  const PALETTE = ["#FF8FA3", "#FF5C7A", "#F6B83D", "#FFD98E", "#FFF1DC"];

  function burst(x, y) {
    const count = reduced ? 14 : 46;
    const pieces = [];

    for (let i = 0; i < count; i++) {
      const kind = Math.random();
      const el = document.createElement("span");
      if (kind < 0.5) {
        el.className = "confetti-piece confetti-heart";
        el.textContent = "♥";
        el.style.setProperty("--s", rand(0.7, 1.7).toFixed(2) + "rem");
      } else if (kind < 0.75) {
        el.className = "confetti-piece confetti-dot";
        el.style.setProperty("--s", rand(5, 11).toFixed(1) + "px");
      } else {
        el.className = "confetti-piece confetti-strip";
      }
      el.style.setProperty("--c", PALETTE[Math.floor(rand(0, PALETTE.length))]);
      document.body.append(el);

      const angle = rand(-Math.PI * 0.92, -Math.PI * 0.08);
      const speed = rand(3.5, 9);
      pieces.push({
        el,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rot: rand(0, 360),
        vr: rand(-8, 8),
        life: 0,
        maxLife: rand(1.6, 2.6),
        size: el.className.includes("strip") ? 9 : parseFloat(getComputedStyle(el).fontSize || 12),
      });
    }

    let raf;
    const step = (now) => {
      const dt = Math.min((now - (step.prev || now)) / 16.7, 3);
      step.prev = now;
      let alive = false;

      for (const p of pieces) {
        p.life += dt / 60;
        if (p.life >= p.maxLife) {
          p.el.remove();
          continue;
        }
        alive = true;
        p.vy += 0.16 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        p.vx *= reduced ? 1 : 0.985;
        const fade = p.life > p.maxLife - 0.5 ? (p.maxLife - p.life) / 0.5 : 1;
        p.el.style.transform =
          `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rot}deg)`;
        p.el.style.opacity = fade;
      }

      if (alive) raf = requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- события ---------- */
  document.addEventListener("click", (e) => burst(e.clientX, e.clientY));

  const heart = document.querySelector(".heart");
  heart.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const r = heart.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2);
    }
  });

  /* ---------- запуск ---------- */
  if (!reduced) {
    spawnStars(26);
    spawnHearts(12);
  }
})();