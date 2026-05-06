/* ═══════════════════════════════════════════
   ASHISH DIXIT PORTFOLIO — SHARED JS
   Drop this in /public/portfolio.js
   Include in every page: <script src="/portfolio.js"></script>
═══════════════════════════════════════════ */

(function () {

    /* ─────────────────────────────────────────
       1. LOCAL TIME (nav + HUD)
    ───────────────────────────────────────── */
    function updateTime() {
      const now = new Date();
      const opt24 = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Chicago', hour12: false };
      const opt12 = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Chicago', hour12: true };
      const t24 = now.toLocaleTimeString('en-US', opt24);
      const t12 = now.toLocaleTimeString('en-US', opt12);
      const hudEl = document.getElementById('local-time');
      const navEl = document.getElementById('nav-time');
      if (hudEl) hudEl.innerHTML = `CDT <span class="val">${t24}</span>`;
      if (navEl) navEl.textContent = t12;
    }
    updateTime();
    setInterval(updateTime, 1000);
  
    /* ─────────────────────────────────────────
       2. RESPONSIVE NAV COLLAPSE
    ───────────────────────────────────────── */
    function getNavW() { return window.innerWidth <= 900 ? 0 : 280; }
  
    function checkNav() {
      const nav = document.getElementById('main-nav');
      if (!nav) return;
      if (window.innerWidth <= 900) nav.classList.add('collapsed');
      else nav.classList.remove('collapsed');
      resizeBg();
    }
    window.addEventListener('resize', checkNav);
  
    /* ─────────────────────────────────────────
       3. AUTOCAD CROSSHAIR CURSOR
    ───────────────────────────────────────── */
    const curC = document.getElementById('cursor-canvas');
    if (curC) {
      const curX = curC.getContext('2d');
      let mx = 0, my = 0, rx = 0, ry = 0;
      let clickR = 0, clickA = 0;
      let isHover = false;
  
      // Size canvas
      function sizeCursor() {
        curC.width = window.innerWidth;
        curC.height = window.innerHeight;
      }
      sizeCursor();
      window.addEventListener('resize', sizeCursor);
  
      document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        const xyEl = document.getElementById('xy');
        if (xyEl) xyEl.textContent = `${((mx - window.innerWidth / 2) / 36).toFixed(2)} · ${((window.innerHeight / 2 - my) / 36).toFixed(2)}`;
      });
  
      document.addEventListener('mousedown', () => { clickR = 8; clickA = 1; });
  
      // Use event delegation for SPA compatibility
      document.addEventListener('mouseover', e => {
        if (e.target.closest('a, button, .proj-card, .chip, .tool-chip, .testi-card, select, input, textarea')) {
          isHover = true;
        }
      });
      document.addEventListener('mouseout', e => {
        if (e.target.closest('a, button, .proj-card, .chip, .tool-chip, .testi-card, select, input, textarea')) {
          isHover = false;
        }
      });
  
      function drawCursor() {
        if (window.innerWidth <= 900) return;
        // Clear by resizing (fastest method)
        curC.width = curC.width;
  
        // Lag cursor for smooth feel
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
  
        const cx = rx, cy = ry;
        const GAP = 16;       // gap around hot point
        const INNER = isHover ? 24 : 14; // bright inner arm length
        const SQ = 3;         // hot point square half-size
  
        // ── Full-screen faint lines ──
        curX.strokeStyle = 'rgba(232,40,40,0.08)';
        curX.lineWidth = 0.5;
        // horizontal
        curX.beginPath(); curX.moveTo(0, cy); curX.lineTo(cx - GAP, cy); curX.stroke();
        curX.beginPath(); curX.moveTo(cx + GAP, cy); curX.lineTo(window.innerWidth, cy); curX.stroke();
        // vertical
        curX.beginPath(); curX.moveTo(cx, 0); curX.lineTo(cx, cy - GAP); curX.stroke();
        curX.beginPath(); curX.moveTo(cx, cy + GAP); curX.lineTo(cx, window.innerHeight); curX.stroke();
  
        // ── Bright inner arms ──
        curX.strokeStyle = '#e82828';
        curX.lineWidth = 1.2;
        curX.beginPath(); curX.moveTo(cx - GAP, cy); curX.lineTo(cx - GAP - INNER, cy); curX.stroke();
        curX.beginPath(); curX.moveTo(cx + GAP, cy); curX.lineTo(cx + GAP + INNER, cy); curX.stroke();
        curX.beginPath(); curX.moveTo(cx, cy - GAP); curX.lineTo(cx, cy - GAP - INNER); curX.stroke();
        curX.beginPath(); curX.moveTo(cx, cy + GAP); curX.lineTo(cx, cy + GAP + INNER); curX.stroke();
  
        // ── Hot point square ──
        curX.fillStyle = '#e82828';
        curX.fillRect(cx - SQ, cy - SQ, SQ * 2, SQ * 2);
  
        // ── Hover: circle around hot point ──
        if (isHover) {
          curX.strokeStyle = 'rgba(232,40,40,0.35)';
          curX.lineWidth = 1;
          curX.beginPath(); curX.arc(cx, cy, GAP, 0, Math.PI * 2); curX.stroke();
        }
  
        // ── Click burst: expanding circle ──
        if (clickA > 0) {
          clickR += 2.5;
          clickA -= 0.055;
          if (clickA < 0) clickA = 0;
          curX.strokeStyle = `rgba(232,40,40,${clickA})`;
          curX.lineWidth = 1.5;
          curX.beginPath(); curX.arc(cx, cy, clickR, 0, Math.PI * 2); curX.stroke();
          // second outer ring
          if (clickR > 14) {
            curX.strokeStyle = `rgba(232,40,40,${clickA * 0.35})`;
            curX.lineWidth = 0.7;
            curX.beginPath(); curX.arc(cx, cy, clickR * 1.5, 0, Math.PI * 2); curX.stroke();
          }
        }
      }
  
      window._drawCursor = drawCursor;
    }
  
    /* ─────────────────────────────────────────
       4. CAD GRID BACKGROUND + DIMENSION ANNOTATIONS
    ───────────────────────────────────────── */
    const bgC = document.getElementById('bg');
    if (bgC) {
      const bgX = bgC.getContext('2d');
      let W, H, scanY = 0, offX = 0, offY = 0, bMX = 0, bMY = 0;
      const annos = [];
      let aT = 0;
      const GU = 36;
  
      function resizeBg() {
        const nw = getNavW();
        W = bgC.width = window.innerWidth - nw;
        H = bgC.height = window.innerHeight;
        bgC.style.left = nw + 'px';
      }
      window._resizeBg = resizeBg;
      window._resizeBg = resizeBg;
  
      resizeBg();
      window.addEventListener('resize', resizeBg);
  
      document.addEventListener('mousemove', e => {
        bMX = e.clientX - getNavW();
        bMY = e.clientY;
        offX = (e.clientX - window.innerWidth / 2) * 0.012;
        offY = (e.clientY - window.innerHeight / 2) * 0.012;
      });
  
      function spawnAnno() {
        const x1 = 50 + Math.random() * (W - 100);
        const y1 = 50 + Math.random() * (H - 100);
        const len = GU * 1.5 + Math.random() * GU * 5;
        const angles = [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4];
        const a = angles[Math.floor(Math.random() * angles.length)];
        annos.push({
          x1, y1,
          x2: x1 + Math.cos(a) * len,
          y2: y1 + Math.sin(a) * len,
          life: 1,
          decay: 0.003 + Math.random() * 0.003,
          label: `${(Math.random() * 16 + 0.5).toFixed(2)}m`
        });
      }
  
      function drawBg(t) {
        bgX.clearRect(0, 0, W, H);
  
        // ── Sub-grid (GU/3 = 12px) — very faint ──
        bgX.strokeStyle = 'rgba(255,255,255,0.02)';
        bgX.lineWidth = 0.4;
        bgX.beginPath();
        const SG = GU / 3;
        for (let x = offX % SG; x < W; x += SG) { bgX.moveTo(x, 0); bgX.lineTo(x, H); }
        for (let y = offY % SG; y < H; y += SG) { bgX.moveTo(0, y); bgX.lineTo(W, y); }
        bgX.stroke();
  
        // ── Main grid (36px) ──
        bgX.strokeStyle = 'rgba(255,255,255,0.06)';
        bgX.lineWidth = 0.5;
        bgX.beginPath();
        for (let x = offX % GU; x < W; x += GU) { bgX.moveTo(x, 0); bgX.lineTo(x, H); }
        for (let y = offY % GU; y < H; y += GU) { bgX.moveTo(0, y); bgX.lineTo(W, y); }
        bgX.stroke();
  
        // ── Major grid (180px) ──
        const MJ = GU * 5;
        bgX.strokeStyle = 'rgba(255,255,255,0.1)';
        bgX.lineWidth = 0.8;
        bgX.beginPath();
        for (let x = offX % MJ; x < W; x += MJ) { bgX.moveTo(x, 0); bgX.lineTo(x, H); }
        for (let y = offY % MJ; y < H; y += MJ) { bgX.moveTo(0, y); bgX.lineTo(W, y); }
        bgX.stroke();
  
        // ── Axis lines (centre cross) ──
        const cx = W / 2 + offX, cy = H / 2 + offY;
        bgX.strokeStyle = 'rgba(255,255,255,0.12)';
        bgX.lineWidth = 0.6;
        bgX.setLineDash([5, 6]);
        bgX.beginPath();
        bgX.moveTo(cx, 0); bgX.lineTo(cx, H);
        bgX.moveTo(0, cy); bgX.lineTo(W, cy);
        bgX.stroke();
        bgX.setLineDash([]);
  
        // ── Scan line ──
        scanY = (scanY + 0.45) % H;
        const sg = bgX.createLinearGradient(0, scanY - 60, 0, scanY + 15);
        sg.addColorStop(0, 'rgba(255,255,255,0)');
        sg.addColorStop(0.6, 'rgba(255,255,255,0.014)');
        sg.addColorStop(1, 'rgba(255,255,255,0.06)');
        bgX.fillStyle = sg;
        bgX.fillRect(0, scanY - 60, W, 75);
  
        // ── Major intersection nodes + crosshair ticks ──
        for (let gx = offX % MJ; gx < W; gx += MJ) {
          for (let gy = offY % MJ; gy < H; gy += MJ) {
            const pulse = 0.5 + 0.5 * Math.sin(t * 0.0007 + gx * 0.009 + gy * 0.007);
            bgX.fillStyle = `rgba(255,255,255,${0.1 + pulse * 0.15})`;
            bgX.beginPath(); bgX.arc(gx, gy, 2, 0, Math.PI * 2); bgX.fill();
            bgX.strokeStyle = `rgba(255,255,255,${0.05 + pulse * 0.06})`;
            bgX.lineWidth = 0.6;
            bgX.beginPath();
            bgX.moveTo(gx - 6, gy); bgX.lineTo(gx + 6, gy);
            bgX.moveTo(gx, gy - 6); bgX.lineTo(gx, gy + 6);
            bgX.stroke();
          }
        }
  
        // ── RED DIMENSION ANNOTATIONS ──
        aT++;
        if (aT % 100 === 0) spawnAnno();
  
        for (let i = annos.length - 1; i >= 0; i--) {
          const a = annos[i];
          a.life -= a.decay;
          if (a.life <= 0) { annos.splice(i, 1); continue; }
  
          const al = Math.min(a.life, 0.6) * 0.5;
  
          // Main dimension line
          bgX.strokeStyle = `rgba(232,40,40,${al})`;
          bgX.lineWidth = 0.8;
          bgX.setLineDash([4, 3]);
          bgX.beginPath(); bgX.moveTo(a.x1, a.y1); bgX.lineTo(a.x2, a.y2); bgX.stroke();
          bgX.setLineDash([]);
  
          // End ticks (perpendicular)
          const ang = Math.atan2(a.y2 - a.y1, a.x2 - a.x1);
          const perp = ang + Math.PI / 2;
          [[a.x1, a.y1], [a.x2, a.y2]].forEach(([px, py]) => {
            bgX.beginPath();
            bgX.moveTo(px + Math.cos(perp) * 6, py + Math.sin(perp) * 6);
            bgX.lineTo(px - Math.cos(perp) * 6, py - Math.sin(perp) * 6);
            bgX.stroke();
          });
  
          // Dimension label
          const lx = (a.x1 + a.x2) / 2 + 5;
          const ly = (a.y1 + a.y2) / 2 - 5;
          bgX.font = '9px Space Mono, monospace';
          bgX.fillStyle = `rgba(232,40,40,${al * 1.8})`;
          bgX.textAlign = 'left';
          bgX.fillText(a.label, lx, ly);
        }
  
        // ── Mouse crosshair ──
        if (bMX) {
          bgX.strokeStyle = 'rgba(255,255,255,0.055)';
          bgX.lineWidth = 0.4;
          bgX.setLineDash([3, 7]);
          bgX.beginPath();
          bgX.moveTo(bMX, 0); bgX.lineTo(bMX, H);
          bgX.moveTo(0, bMY); bgX.lineTo(W, bMY);
          bgX.stroke();
          bgX.setLineDash([]);
        }
  
        // ── Vignette ──
        const vg = bgX.createRadialGradient(W / 2, H / 2, H * 0.05, W / 2, H / 2, H * 0.85);
        vg.addColorStop(0, 'rgba(16,16,18,0)');
        vg.addColorStop(1, 'rgba(10,10,11,0.94)');
        bgX.fillStyle = vg;
        bgX.fillRect(0, 0, W, H);
      }
  
      window._drawBg = drawBg;
    }
  
    /* ─────────────────────────────────────────
       5. MAIN ANIMATION LOOP
    ───────────────────────────────────────── */
    function loop(t) {
      if (window._drawBg) window._drawBg(t);
      if (window._drawCursor) window._drawCursor();
      if (window._drawPageExtra) window._drawPageExtra(t);
      requestAnimationFrame(loop);
    }
  
    // Wait for DOM then start
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => { checkNav(); requestAnimationFrame(loop); });
    } else {
      checkNav();
      requestAnimationFrame(loop);
    }
  
    /* ─────────────────────────────────────────
       6. COPY EMAIL UTILITY
    ───────────────────────────────────────── */
    window.copyEmail = function () {
      navigator.clipboard.writeText('ashishdixit.ux@gmail.com').then(() => {
        document.querySelectorAll('.copy-confirm').forEach(el => {
          el.classList.add('show');
          setTimeout(() => el.classList.remove('show'), 2000);
        });
      });
    };
  
  })();