/* ============================================================
   PRIZES — tela de prêmios (7 vales) + detalhe + download imagem
   ============================================================ */
(function () {
  "use strict";

  const vales = window.VALES;

  /* ---------- Render da tela ---------- */
  function render() {
    const s = window.Store.get();
    const sec = document.getElementById("screen-prizes");
    sec.innerHTML = "";

    const top = document.createElement("header");
    top.className = "prizes-top";
    top.innerHTML =
      '<button class="btn-icon" data-action="go-home" aria-label="Voltar">←</button>' +
      '<h2 class="prizes-title">Seus Vales</h2>' +
      '<span class="prizes-count">' + vales.length + '</span>';
    sec.appendChild(top);

    const intro = document.createElement("p");
    intro.className = "prizes-intro muted";
    intro.textContent = "Toque em um vale para ver, baixar como imagem e usar quando quiser. 💗";
    sec.appendChild(intro);

    const grid = document.createElement("div");
    grid.className = "vale-grid";
    vales.forEach(function (v) {
      const used = (s.valesUsed || []).indexOf(v.id) >= 0;
      const card = document.createElement("button");
      card.type = "button";
      card.className = "vale-card vale--" + v.theme + (used ? " is-used" : "");
      card.setAttribute("data-vale", v.id);
      card.innerHTML =
        '<span class="vale-card-icon">' + window.Icon(v.icon, { size: 30, color: "#fff" }) + '</span>' +
        '<span class="vale-card-title"></span>' +
        '<span class="vale-card-tag"></span>' +
        (used ? '<span class="vale-card-used">usado</span>' : "");
      card.querySelector(".vale-card-title").textContent = v.title;
      card.querySelector(".vale-card-tag").textContent = v.tag;
      card.addEventListener("click", function () { openDetail(v); });
      grid.appendChild(card);
    });
    sec.appendChild(grid);

    const footer = document.createElement("footer");
    footer.className = "prizes-footer";
    footer.innerHTML =
      '<button class="btn btn-primary btn-block" data-action="go-album">' +
        window.Icon("book", { size: 18 }) + 'Ver o álbum</button>';
    sec.appendChild(footer);
  }

  /* ---------- Ticket completo (usado no modal e no download) ---------- */
  function buildTicket(v) {
    const el = document.createElement("div");
    el.className = "vale-ticket vale--" + v.theme;
    el.innerHTML =
      '<div class="vale-ticket-sheen"></div>' +
      '<div class="vale-ticket-top">' +
        '<span class="vale-ticket-icon">' + window.Icon(v.icon, { size: 32, color: "#fff" }) + '</span>' +
        '<div class="vale-ticket-heads">' +
          '<span class="vale-ticket-tag"></span>' +
          '<h3 class="vale-ticket-title"></h3>' +
        '</div>' +
      '</div>' +
      '<p class="vale-ticket-desc"></p>' +
      '<div class="vale-ticket-perf"><span></span><span></span></div>' +
      '<div class="vale-ticket-bottom">' +
        '<span class="vale-ticket-footer"></span>' +
        '<span class="vale-ticket-brand">João &amp; Rafaela ' +
          window.Icon("heart", { size: 14, color: "#fff" }) + '</span>' +
      '</div>';
    el.querySelector(".vale-ticket-tag").textContent = v.tag;
    el.querySelector(".vale-ticket-title").textContent = v.title;
    el.querySelector(".vale-ticket-desc").textContent = v.description;
    el.querySelector(".vale-ticket-footer").textContent = v.footer;
    return el;
  }

  /* ---------- Modal de detalhe ---------- */
  function openDetail(v) {
    const s = window.Store.get();
    const used = (s.valesUsed || []).indexOf(v.id) >= 0;

    const wrap = document.createElement("div");
    wrap.className = "vale-detail";

    const capture = document.createElement("div");
    capture.className = "vale-capture";
    capture.appendChild(buildTicket(v));
    wrap.appendChild(capture);

    const actions = document.createElement("div");
    actions.className = "vale-detail-actions";
    actions.innerHTML =
      '<button class="btn btn-gold btn-block" data-dl>' +
        window.Icon("download", { size: 18 }) + 'Baixar como imagem</button>' +
      (used
        ? '<button class="btn btn-ghost btn-block" disabled>' +
            window.Icon("check", { size: 18 }) + 'Já usado</button>'
        : '<button class="btn btn-primary btn-block" data-use>' +
            window.Icon("heart", { size: 18 }) + 'Usar este vale</button>') +
      '<button class="link-muted" data-close-modal>fechar</button>';
    wrap.appendChild(actions);

    window.Modal.open(wrap);

    actions.querySelector("[data-dl]").addEventListener("click", function () {
      downloadTicket(v, capture.firstChild);
    });
    const useBtn = actions.querySelector("[data-use]");
    if (useBtn) {
      useBtn.addEventListener("click", function () { useVale(v); });
    }
  }

  /* ---------- Usar vale (vira figurinha premium no álbum) ---------- */
  function useVale(v) {
    const s = window.Store.get();
    if ((s.valesUsed || []).indexOf(v.id) >= 0) return;
    window.Store.set({ valesUsed: (s.valesUsed || []).concat([v.id]) });
    window.Modal.close();
    render();
    window.toast("Vale usado 💖 — virou figurinha premium no álbum!");
  }

  /* ---------- Download como imagem (html2canvas) ---------- */
  function downloadTicket(v, ticketEl) {
    if (!window.html2canvas) {
      window.toast("Aguarde, ferramenta de imagem carregando…");
      return;
    }
    window.toast("Gerando imagem…");
    window.html2canvas(ticketEl, {
      scale: Math.min(3, (window.devicePixelRatio || 1) + 1),
      backgroundColor: null,
      useCORS: true,
      logging: false
    }).then(function (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      showImageResult(dataUrl, "vale-" + v.id + ".png");
    }).catch(function () {
      window.toast("Não consegui gerar a imagem 😕");
    });
  }

  function showImageResult(dataUrl, filename) {
    const wrap = document.createElement("div");
    wrap.className = "imgsave";

    const h = document.createElement("h3");
    h.className = "imgsave-title";
    h.textContent = "Seu vale está pronto! 🎉";

    const hint = document.createElement("p");
    hint.className = "imgsave-hint";
    hint.innerHTML = "<strong>No iPhone:</strong> segure a imagem abaixo e toque em " +
      '"Adicionar às Fotos".<br><strong>No computador:</strong> use o botão de baixar.';

    const img = document.createElement("img");
    img.className = "imgsave-img";
    img.src = dataUrl;
    img.alt = "Vale gerado";

    const dl = document.createElement("a");
    dl.className = "btn btn-primary btn-block";
    dl.href = dataUrl;
    dl.setAttribute("download", filename);
    dl.innerHTML = window.Icon("download", { size: 18 }) + "Baixar imagem";

    const closeBtn = document.createElement("button");
    closeBtn.className = "btn btn-ghost btn-block";
    closeBtn.setAttribute("data-close-modal", "");
    closeBtn.textContent = "Fechar";

    wrap.appendChild(h);
    wrap.appendChild(hint);
    wrap.appendChild(img);
    wrap.appendChild(dl);
    wrap.appendChild(closeBtn);

    window.Modal.open(wrap);
  }

  window.Prizes = { render };
})();
