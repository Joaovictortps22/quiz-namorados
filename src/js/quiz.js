/* ============================================================
   QUIZ — motor do quiz (8 perguntas múltipla escolha)
   ============================================================ */
(function () {
  "use strict";

  const data = window.QUIZ;
  let index = 0;
  let answers = [];      // índice marcado por pergunta (null = não respondida)

  function imgURL(path) { return encodeURI(path); }

  function start() {
    index = 0;
    answers = new Array(data.length).fill(null);
    render();
  }

  function render() {
    const q = data[index];
    const total = data.length;

    // progresso
    document.getElementById("quiz-count").textContent = (index + 1) + "/" + total;
    document.getElementById("quiz-progress").style.width =
      (((index + 1) / total) * 100) + "%";

    // corpo
    const body = document.getElementById("quiz-body");
    body.innerHTML = "";

    const card = document.createElement("div");
    card.className = "q-card";

    const num = document.createElement("p");
    num.className = "q-number";
    num.textContent = "Pergunta " + (index + 1);
    card.appendChild(num);

    const title = document.createElement("h2");
    title.className = "q-title";
    title.textContent = q.text;
    card.appendChild(title);

    if (q.image) {
      const fig = document.createElement("figure");
      fig.className = "q-figure";
      const img = document.createElement("img");
      img.src = imgURL(q.image.quiz);
      img.alt = "Imagem da pergunta";
      img.loading = "eager";
      fig.appendChild(img);
      if (q.hint) {
        const cap = document.createElement("figcaption");
        cap.className = "q-hint";
        cap.textContent = q.hint;
        fig.appendChild(cap);
      }
      card.appendChild(fig);
    }

    const list = document.createElement("div");
    list.className = "q-options";
    q.options.forEach(function (opt, i) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option" + (answers[index] === i ? " is-selected" : "");
      btn.innerHTML =
        '<span class="option-mark">' + String.fromCharCode(65 + i) + "</span>" +
        '<span class="option-text"></span>';
      btn.querySelector(".option-text").textContent = opt;
      btn.addEventListener("click", function () {
        answers[index] = i;
        Array.prototype.forEach.call(list.children, function (c) {
          c.classList.remove("is-selected");
        });
        btn.classList.add("is-selected");
        updateNav();
      });
      list.appendChild(btn);
    });
    card.appendChild(list);

    body.appendChild(card);
    updateNav();
  }

  function updateNav() {
    const prev = document.getElementById("quiz-prev");
    const next = document.getElementById("quiz-next");
    const isLast = index === data.length - 1;

    prev.disabled = index === 0;
    prev.style.visibility = index === 0 ? "hidden" : "visible";
    next.textContent = isLast ? "Finalizar 💗" : "Próxima";
    next.disabled = answers[index] === null;
  }

  function finish() {
    let score = 0;
    answers.forEach(function (a, i) {
      if (a === data[i].correct) score++;
    });

    window.Store.set({
      quizCompleted: true,
      answers: answers.slice(),
      score: score,
      prizesUnlocked: true,
      albumUnlocked: true
    });

    window.Router.go("result");
  }

  function initControls() {
    document.getElementById("quiz-prev").addEventListener("click", function () {
      if (index > 0) { index--; render(); }
    });
    document.getElementById("quiz-next").addEventListener("click", function () {
      if (answers[index] === null) return;
      if (index < data.length - 1) { index++; render(); }
      else finish();
    });
  }

  window.Quiz = { start, init: initControls };
})();
