/* ============================================================
   ÁLBUM — saquinho, abertura, colagem de fotos + vales premium
   ============================================================ */
(function () {
  "use strict";

  const fotos = window.FOTOS;
  const vales = window.VALES;

  let tab = "fotos";        // aba ativa: "fotos" | "vales"
  let justOpened = false;   // controla animação de revelação pós-pacote
  let justPlaced = null;    // id da figurinha recém-colada (anima)

  function imgURL(p) { return encodeURI(p); }
  function reduced() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function render() {
    const s = window.Store.get();
    if (!s.packOpened) renderPack();
    else renderAlbum();
  }

  /* ---------------- Cena do pacote ---------------- */
  function renderPack() {
    const sec = document.getElementById("screen-album");
    sec.innerHTML =
      '<header class="album-top">' +
        '<button class="btn-icon" data-action="go-home" aria-label="Voltar">←</button>' +
        '<h2 class="album-title">Seu Pacote</h2>' +
        '<span style="width:44px"></span>' +
      '</header>' +
      '<div class="pack-scene">' +
        '<p class="pack-kicker">Chegou pra você 💗</p>' +
        '<h3 class="pack-headline">Um pacote de figurinhas</h3>' +
        '<p class="pack-sub">Toque no pacote para abrir e revelar as nossas memórias.</p>' +
        '<button class="pack" id="pack" aria-label="Abrir pacote">' +
          '<span class="pack-foil"></span>' +
          '<span class="pack-top"></span>' +
          '<span class="pack-label">' +
            '<span class="pack-label-star">' + window.Icon("star", { size: 18, color: "#F0D77B" }) + '</span>' +
            '<span class="pack-label-title">FIGURINHAS</span>' +
            '<span class="pack-label-sub">João &amp; Rafaela</span>' +
            '<span class="pack-label-heart">' + window.Icon("heart", { size: 20, color: "#fff" }) + '</span>' +
          '</span>' +
          '<span class="pack-shine"></span>' +
        '</button>' +
        '<p class="pack-hint" id="pack-hint">toque para abrir</p>' +
      '</div>';

    const pack = document.getElementById("pack");
    pack.addEventListener("click", openPack, { once: true });
  }

  function openPack() {
    const pack = document.getElementById("pack");
    const hint = document.getElementById("pack-hint");
    if (hint) hint.textContent = "abrindo…";

    function finish() {
      window.Store.set({ packOpened: true });
      justOpened = true;
      tab = "fotos";
      renderAlbum();
    }

    if (reduced()) { finish(); return; }

    pack.classList.add("opening");
    burst(pack);
    setTimeout(finish, 1300);
  }

  /* ---------------- Álbum ---------------- */
  function renderAlbum() {
    const sec = document.getElementById("screen-album");
    sec.innerHTML = "";

    const top = document.createElement("header");
    top.className = "album-top";
    top.innerHTML =
      '<button class="btn-icon" data-action="go-home" aria-label="Voltar">←</button>' +
      '<h2 class="album-title">Nosso Álbum</h2>' +
      '<span style="width:44px"></span>';
    sec.appendChild(top);

    const tabs = document.createElement("div");
    tabs.className = "album-tabs";
    tabs.innerHTML =
      '<button class="album-tab' + (tab === "fotos" ? " is-active" : "") + '" data-tab="fotos">' +
        window.Icon("image", { size: 17 }) + 'Figurinhas</button>' +
      '<button class="album-tab' + (tab === "vales" ? " is-active" : "") + '" data-tab="vales">' +
        window.Icon("sparkles", { size: 17 }) + 'Vales</button>';
    tabs.querySelectorAll("[data-tab]").forEach(function (b) {
      b.addEventListener("click", function () {
        tab = b.getAttribute("data-tab");
        justOpened = false;
        renderAlbum();
      });
    });
    sec.appendChild(tabs);

    const page = document.createElement("div");
    page.className = "album-page";
    sec.appendChild(page);

    if (tab === "fotos") renderFotosPage(page);
    else renderValesPage(page);
  }

  /* ---------------- Página de figurinhas (fotos) ---------------- */
  function renderFotosPage(page) {
    const s = window.Store.get();
    const placed = s.stickersPlaced || [];

    const heading = document.createElement("p");
    heading.className = "album-page-title";
    heading.textContent = "Memórias do casal · " + placed.length + "/" + fotos.length;
    page.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "sticker-grid";
    fotos.forEach(function (f) {
      const isPlaced = placed.indexOf(f.id) >= 0;
      const slot = document.createElement("div");
      slot.className = "slot" + (isPlaced ? " is-filled" : "") +
        (justPlaced === f.id ? " just-placed" : "");

      if (isPlaced) {
        slot.innerHTML =
          '<figure class="foto-sticker">' +
            '<span class="foto-number">' + f.number + '</span>' +
            '<img alt="" />' +
            '<figcaption></figcaption>' +
          '</figure>';
        slot.querySelector("img").src = imgURL(f.src);
        slot.querySelector("figcaption").textContent = f.title;
      } else {
        slot.innerHTML =
          '<span class="slot-number">' + f.number + '</span>' +
          '<span class="slot-ghost">?</span>' +
          '<span class="slot-caption"></span>';
        slot.querySelector(".slot-caption").textContent = f.title;
      }
      grid.appendChild(slot);
    });
    page.appendChild(grid);
    justPlaced = null;

    // Bandeja de figurinhas soltas (ainda não coladas)
    const loose = fotos.filter(function (f) { return placed.indexOf(f.id) < 0; });
    if (loose.length) {
      const tray = document.createElement("div");
      tray.className = "tray" + (justOpened ? " tray-reveal" : "");
      const t = document.createElement("p");
      t.className = "tray-title";
      t.textContent = justOpened
        ? "Você tirou " + loose.length + " figurinhas! Toque pra colar 👇"
        : "Figurinhas pra colar · toque 👇";
      tray.appendChild(t);

      const row = document.createElement("div");
      row.className = "tray-row";
      loose.forEach(function (f, i) {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "loose-sticker";
        card.style.setProperty("--i", i);
        card.innerHTML =
          '<span class="loose-number">' + f.number + '</span>' +
          '<img alt="" />';
        card.querySelector("img").src = imgURL(f.src);
        card.addEventListener("click", function () { placeSticker(f.id); });
        row.appendChild(card);
      });
      tray.appendChild(row);
      page.appendChild(tray);
      justOpened = false;
    } else {
      const done = document.createElement("div");
      done.className = "album-complete";
      done.innerHTML = window.Icon("trophy", { size: 48 }) + "<p>Álbum completo, te amo</p>";
      page.appendChild(done);
    }
  }

  function placeSticker(id) {
    const s = window.Store.get();
    if ((s.stickersPlaced || []).indexOf(id) >= 0) return;
    window.Store.set({ stickersPlaced: (s.stickersPlaced || []).concat([id]) });
    justPlaced = id;
    const page = document.querySelector("#screen-album .album-page");
    renderFotosPage(clearAndReturn(page));
    const el = document.querySelector("#screen-album .album-page");
    if (!reduced()) burst(el.querySelector(".just-placed") || el);
  }

  function clearAndReturn(page) {
    page.innerHTML = "";
    return page;
  }

  /* ---------------- Página de vales (figurinhas premium) ---------------- */
  function renderValesPage(page) {
    const s = window.Store.get();
    const used = s.valesUsed || [];

    const heading = document.createElement("p");
    heading.className = "album-page-title";
    heading.textContent = "Figurinhas premium · " + used.length + "/" + vales.length;
    page.appendChild(heading);

    if (!used.length) {
      const empty = document.createElement("div");
      empty.className = "vales-empty";
      empty.innerHTML =
        '<span class="vales-empty-icon">' + window.Icon("sparkles", { size: 40 }) + '</span>' +
        '<p>Nenhum vale usado ainda.<br>Use um vale na tela de <strong>Prêmios</strong> e ele vira uma figurinha premium aqui. 💖</p>' +
        '<button class="btn btn-gold btn-block" data-action="go-prizes">' +
          window.Icon("gift", { size: 18 }) + 'Ir para os Prêmios</button>';
      page.appendChild(empty);
      return;
    }

    const grid = document.createElement("div");
    grid.className = "premium-grid";
    vales.forEach(function (v, i) {
      if (used.indexOf(v.id) < 0) return;
      const card = document.createElement("div");
      card.className = "premium-sticker vale--" + v.theme;
      card.innerHTML =
        '<span class="premium-holo"></span>' +
        '<span class="premium-shine"></span>' +
        '<span class="premium-star">' + window.Icon("star", { size: 18, color: "#F0D77B" }) + '</span>' +
        '<span class="premium-icon">' + window.Icon(v.icon, { size: 42, color: "#fff" }) + '</span>' +
        '<span class="premium-title"></span>' +
        '<span class="premium-badge">PREMIUM</span>';
      card.querySelector(".premium-title").textContent = v.title;
      grid.appendChild(card);
    });
    page.appendChild(grid);
  }

  /* ---------------- Burst de partículas ---------------- */
  function burst(anchor) {
    if (reduced() || !anchor) return;
    const layer = document.createElement("div");
    layer.className = "burst";
    const emojis = ["💗", "✨", "💖", "🎉", "💛", "⭐"];
    for (let i = 0; i < 18; i++) {
      const p = document.createElement("span");
      p.textContent = emojis[i % emojis.length];
      const ang = (Math.PI * 2 * i) / 18;
      const dist = 80 + Math.random() * 70;
      p.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      p.style.setProperty("--dy", Math.sin(ang) * dist + "px");
      p.style.animationDelay = (Math.random() * 0.1) + "s";
      layer.appendChild(p);
    }
    const r = anchor.getBoundingClientRect();
    layer.style.left = (r.left + r.width / 2) + "px";
    layer.style.top = (r.top + r.height / 2) + "px";
    document.body.appendChild(layer);
    setTimeout(function () { layer.remove(); }, 1200);
  }

  window.Album = { render };
})();
