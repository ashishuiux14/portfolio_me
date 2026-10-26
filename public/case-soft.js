/* Case studies → soft UI. Runs inside each case-study page.
   1. follows the site theme (saved choice, or set directly by the parent page)
   2. moves text onto the site's type (Jost; JetBrains Mono stays for labels)
   3. turns flat bordered panels into raised surfaces, so they read like the rest of the site */
(function () {
  var html = document.documentElement;
  function theme() {
    var t = null;
    try { t = localStorage.getItem('theme'); } catch (e) {}
    if (t !== 'light' && t !== 'dark') t = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    html.setAttribute('data-theme', t);
  }
  theme();
  window.addEventListener('storage', function (e) { if (e.key === 'theme') theme(); });

  var DISPLAY = '"Jost", "Futura", "Century Gothic", "Avenir Next", sans-serif';
  function px(v) { return parseFloat(v) || 0; }
  function transparent(c) { return !c || c === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(c); }

  function lum(c) {
    var m = (c || '').match(/rgba?\(([^)]+)\)/); if (!m) return null;
    var v = m[1].split(',').map(parseFloat); if (v.length > 3 && v[3] < 0.35) return null;
    return (0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]) / 255;
  }
  function soften() {
    var pageL = lum(getComputedStyle(document.body).backgroundColor);
    var all = document.body.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.closest('svg, iframe, video, canvas, [data-keep]')) continue;
      var cs = getComputedStyle(el);
      // type
      var ff = cs.fontFamily || '';
      if (!/mono/i.test(ff) && /(Instrument Serif|Syne|DM Sans|Manrope|Comfortaa|Inter|serif)/i.test(ff)) {
        el.style.fontFamily = DISPLAY;
        if (/Instrument Serif/i.test(ff) && px(cs.fontWeight) < 500) el.style.fontWeight = '300';
      }
      // surfaces: rounded, bordered or filled panels of a useful size become raised
      var r = px(cs.borderTopLeftRadius), w = el.offsetWidth, h = el.offsetHeight;
      if (w < 60 || h < 28) continue;
      var bordered = px(cs.borderTopWidth) > 0 && !transparent(cs.borderTopColor);
      var bl = lum(cs.backgroundColor);
      var filled = (!transparent(cs.backgroundColor) && (bl === null || pageL === null || Math.abs(bl - pageL) < 0.12));
      if (bl !== null && pageL !== null && Math.abs(bl - pageL) >= 0.12) continue;   // a mock-up or image panel: leave it
      if (cs.boxShadow !== 'none' && /inset/.test(cs.boxShadow)) { el.classList.add('soft-well'); continue; }
      if (r >= 10 && (bordered || filled) && w >= 120 && h >= 60) el.classList.add('soft-raised');
      else if (r >= 12 && bordered && h < 60) el.classList.add('soft-chip');
    }
  }
  // anything that is essentially a picture frame lies flat: no lift, no drop shadow
  function flatten() {
    var imgs = document.body.querySelectorAll('img, picture, video');
    for (var i = 0; i < imgs.length; i++) {
      var im = imgs[i], a = im.offsetWidth * im.offsetHeight;
      if (a < 6400) continue;
      var el = im.parentElement, depth = 0;
      while (el && el !== document.body && depth < 4) {
        var ea = el.offsetWidth * el.offsetHeight;
        if (!ea || a / ea < 0.45) break;
        el.classList.remove('soft-raised', 'soft-chip');
        el.classList.add('soft-flat');
        el = el.parentElement; depth++;
      }
    }
  }
  function run() { soften(); flatten(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('load', flatten);   // images that size themselves late
})();
