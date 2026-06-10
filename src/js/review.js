/* ============================================================
   REVIEW — revisão das respostas
   Mostra cada pergunta: o que ela marcou, certo/errado e a correta.
   Perguntas com imagem exibem a imagem ORIGINAL (nítida).
   ============================================================ */
(function () {
  "use strict";

  function imgURL(path) { return encodeURI(path); }

  function render() {
    const s = window.Store.get();
    const data = window.QUIZ || [];
    const answers = s.answers || [];

    const sec = document.getElementById("screen-review");
    sec.innerHTML = "";

    const top = document.createElement("header");
    top.className = "review-top";
    top.innerHTML =
      '<button class="btn-icon" data-action="go-result" aria-label="Voltar">←</button>' +
      '<h2 class="review-title">Revisão</h2>' +
      '<span class="review-score">' + (s.score || 0) + '/' + data.length + '</span>';
    sec.appendChild(top);

    const list = document.createElement("div");
    list.className = "review-list";

    data.forEach(function (q, i) {
      const chosen = answers[i];
      const isCorrect = chosen === q.correct;

      const item = document.createElement("article");
      item.className = "review-item " + (isCorrect ? "is-correct" : "is-wrong");

      const head = document.createElement("div");
      head.className = "review-item-head";
      head.innerHTML =
        '<span class="review-badge">' + window.Icon(isCorrect ? "check" : "x", { size: 16, stroke: 2.4 }) + '</span>' +
        '<span class="review-q"></span>';
      head.querySelector(".review-q").textContent = (i + 1) + ". " + q.text;
      item.appendChild(head);

      if (q.image) {
        const fig = document.createElement("figure");
        fig.className = "review-figure";
        const img = document.createElement("img");
        img.src = imgURL(q.image.original);
        img.alt = "Foto original da pergunta " + (i + 1);
        img.loading = "lazy";
        fig.appendChild(img);
        item.appendChild(fig);
      }

      const opts = document.createElement("ul");
      opts.className = "review-options";
      q.options.forEach(function (opt, oi) {
        const li = document.createElement("li");
        let cls = "review-opt";
        let tag = "";
        if (oi === q.correct) { cls += " opt-correct"; tag = "correta"; }
        if (oi === chosen && chosen !== q.correct) { cls += " opt-chosen-wrong"; tag = "sua resposta"; }
        else if (oi === chosen) { tag = "sua resposta"; }
        li.className = cls;
        li.innerHTML = '<span class="review-opt-text"></span>' +
          (tag ? '<span class="review-opt-tag">' + tag + "</span>" : "");
        li.querySelector(".review-opt-text").textContent = opt;
        opts.appendChild(li);
      });
      item.appendChild(opts);

      list.appendChild(item);
    });

    sec.appendChild(list);

    const footer = document.createElement("footer");
    footer.className = "review-footer";
    footer.innerHTML =
      '<button class="btn btn-gold btn-block" data-action="go-prizes">' +
        window.Icon("gift", { size: 18 }) + 'Resgatar prêmios</button>' +
      '<button class="btn btn-ghost btn-block" data-action="go-home">Voltar ao início</button>';
    sec.appendChild(footer);
  }

  window.Review = { render };
})();
