/* ============================================================
   ICONS — ícones SVG (estilo linha, profissionais)
   Uso: window.Icon("gift", { size: 24, color: "#fff", stroke: 1.8 })
   Cor padrão = currentColor (herda do elemento).
   ============================================================ */
(function () {
  "use strict";

  const PATHS = {
    // navegação / sistema
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12l2 2 4-4"/>',
    book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.83 0L6 21"/>',
    sparkles: '<path d="M9.94 14.06A2 2 0 0 0 8.5 12.62l-4.6-1.18a.5.5 0 0 1 0-.96l4.6-1.19A2 2 0 0 0 9.94 7.9l1.18-4.6a.5.5 0 0 1 .96 0l1.19 4.6a2 2 0 0 0 1.44 1.44l4.6 1.18a.5.5 0 0 1 0 .96l-4.6 1.19a2 2 0 0 0-1.44 1.44l-1.18 4.6a.5.5 0 0 1-.96 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',

    // afetivos / destaque (preenchidos)
    heart: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z',
    star: 'M11.48 3.5a.56.56 0 0 1 1.04 0l2.13 4.31a.56.56 0 0 0 .42.31l4.76.69a.56.56 0 0 1 .31.96l-3.44 3.36a.56.56 0 0 0-.16.49l.81 4.74a.56.56 0 0 1-.81.59l-4.26-2.24a.56.56 0 0 0-.52 0l-4.26 2.24a.56.56 0 0 1-.81-.59l.81-4.74a.56.56 0 0 0-.16-.49L3.9 10.27a.56.56 0 0 1 .31-.96l4.76-.69a.56.56 0 0 0 .42-.31z',

    // vales (temáticos)
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
    utensils: '<path d="M3 2v7c0 1.1.9 2 2 2a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    chef: '<path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><path d="M6 17h12"/>',
    coffee: '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 2v2"/><path d="M10 2v2"/><path d="M14 2v2"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>'
  };

  const FILLED = { heart: true, star: true };

  function Icon(name, opts) {
    opts = opts || {};
    const size = opts.size || 24;
    const sw = opts.stroke || 1.8;
    const color = opts.color || "currentColor";
    const filled = !!FILLED[name];
    const fill = filled ? color : "none";
    const stroke = filled ? "none" : color;
    const cls = opts.class ? ' class="' + opts.class + '"' : "";
    const body = PATHS[name] || "";
    return '<svg' + cls + ' width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="' + fill + '" stroke="' + stroke +
      '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      body + "</svg>";
  }

  Icon.has = function (name) { return !!PATHS[name]; };
  window.Icon = Icon;
})();
