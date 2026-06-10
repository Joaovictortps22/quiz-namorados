/* ============================================================
   RESULT — tela de resultado (SEMPRE aprovada) + comemoração
   ============================================================ */
(function () {
  "use strict";

  function render() {
    const s = window.Store.get();
    const total = (window.QUIZ || []).length;
    const score = s.score || 0;

    const consolo = score < 5
      ? ' <span class="muted">(mas o prêmio é seu de qualquer jeito 😄)</span>'
      : '';

    const sec = document.getElementById("screen-result");
    sec.innerHTML =
      '<div class="result-wrap">' +
        '<div class="result-seal" aria-hidden="true">' +
          '<span class="result-seal-star">' + window.Icon("star", { size: 16 }) + '</span>' +
          '<span class="result-seal-text">APROVADA</span>' +
        '</div>' +
        '<h1 class="result-title">Você passou, meu amor! 💗</h1>' +
        '<p class="result-sub">E não tinha como ser diferente — você foi feita pra mim.</p>' +
        '<div class="result-score">Você acertou <strong>' + score + ' de ' + total + '</strong>' +
          consolo + '</div>' +
        '<div class="result-prize">' +
          '<span class="result-prize-emoji">' + window.Icon("gift", { size: 30 }) + '</span>' +
          '<p>Como prêmio, você desbloqueou os <strong>Vales</strong> e o nosso <strong>Álbum de Figurinhas</strong>!</p>' +
        '</div>' +
        '<div class="result-actions">' +
          '<button class="btn btn-gold btn-block" data-action="go-prizes">' + window.Icon("gift", { size: 18 }) + 'Resgatar meus prêmios</button>' +
          '<button class="btn btn-primary btn-block" data-action="go-album">' + window.Icon("book", { size: 18 }) + 'Abrir o álbum</button>' +
          '<button class="btn btn-ghost btn-block" data-action="go-review">Ver a revisão do quiz</button>' +
          '<button class="link-muted" data-action="go-home">voltar ao início</button>' +
        '</div>' +
      '</div>';

    celebrate(sec);
  }

  /* Chuva de corações/confete simples */
  function celebrate(container) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = document.createElement("div");
    layer.className = "confetti";
    layer.setAttribute("aria-hidden", "true");
    const emojis = ["💗", "💖", "✨", "🎉", "💛", "💕"];
    for (let i = 0; i < 26; i++) {
      const span = document.createElement("span");
      span.textContent = emojis[i % emojis.length];
      span.style.left = Math.random() * 100 + "%";
      span.style.animationDelay = (Math.random() * 1.2) + "s";
      span.style.animationDuration = (2.2 + Math.random() * 1.8) + "s";
      span.style.fontSize = (16 + Math.random() * 18) + "px";
      layer.appendChild(span);
    }
    container.appendChild(layer);
    setTimeout(function () { layer.remove(); }, 4500);
  }

  window.Result = { render };
})();
