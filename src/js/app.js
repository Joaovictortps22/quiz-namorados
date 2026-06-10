/* ============================================================
   APP — bootstrap / orquestra login, home, navegação
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Toast helper ---------- */
  let toastTimer = null;
  function toast(msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => { t.hidden = true; }, 300);
    }, 2200);
  }
  window.toast = toast;

  /* ---------- Modal ---------- */
  const Modal = {
    open(node) {
      const overlay = document.getElementById("modal");
      const sheet = document.getElementById("modal-sheet");
      sheet.innerHTML = "";
      if (typeof node === "string") sheet.innerHTML = node;
      else sheet.appendChild(node);
      overlay.hidden = false;
      requestAnimationFrame(() => overlay.classList.add("show"));
    },
    close() {
      const overlay = document.getElementById("modal");
      overlay.classList.remove("show");
      setTimeout(() => {
        overlay.hidden = true;
        document.getElementById("modal-sheet").innerHTML = "";
      }, 240);
    }
  };
  window.Modal = Modal;

  function initModal() {
    const overlay = document.getElementById("modal");
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target.closest("[data-close-modal]")) {
        Modal.close();
      }
    });
  }

  /* ---------- LOGIN ---------- */
  function initLogin() {
    const form = document.getElementById("login-form");
    const userEl = document.getElementById("login-user");
    const passEl = document.getElementById("login-pass");
    const errEl = document.getElementById("login-error");

    function showError(msg) {
      errEl.textContent = msg;
      errEl.hidden = false;
      form.classList.remove("shake");
      void form.offsetWidth; // reflow para reiniciar animação
      form.classList.add("shake");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const user = userEl.value;
      const pass = passEl.value;

      if (!user || !pass) {
        showError("Preencha usuário e senha 💗");
        return;
      }
      if (!window.Auth.check(user, pass)) {
        showError("Ops, não foi dessa vez. Tenta de novo, meu amor 💔");
        return;
      }
      errEl.hidden = true;
      window.Auth.login();
      window.Router.go("home");
      toast("Bem-vinda, meu amor 💗");
    });
  }

  /* ---------- HOME ---------- */
  function renderHome() {
    const s = window.Store.get();

    const prizesCard = document.getElementById("card-prizes");
    const albumCard = document.getElementById("card-album");

    setUnlocked(prizesCard, s.prizesUnlocked,
      "Vales prontos pra resgatar 🎁", "Conclua o quiz para liberar");
    setUnlocked(albumCard, s.albumUnlocked,
      "Seu álbum está te esperando 📖", "Conclua o quiz para liberar");

    const resetBtn = document.getElementById("reset-btn");
    if (resetBtn) resetBtn.hidden = false; // disponível para você testar
  }

  function setUnlocked(card, unlocked, unlockedSub, lockedSub) {
    if (!card) return;
    card.classList.toggle("is-unlocked", !!unlocked);
    const sub = card.querySelector("[data-sub-locked]");
    if (sub) sub.textContent = unlocked ? unlockedSub : lockedSub;
    const badge = card.querySelector(".lock-badge");
    if (badge) badge.innerHTML = window.Icon(unlocked ? "check" : "lock", { size: 22 });
  }

  /* ---------- Ícones estáticos (data-icon) ---------- */
  function initIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach(function (el) {
      const name = el.getAttribute("data-icon");
      if (window.Icon && window.Icon.has(name)) {
        el.innerHTML = window.Icon(name, { size: 24 });
      }
    });
  }

  /* ---------- Ações de navegação (delegação) ---------- */
  function initActions() {
    document.addEventListener("click", function (e) {
      const target = e.target.closest("[data-action]");
      if (!target) return;
      const action = target.getAttribute("data-action");
      const s = window.Store.get();

      switch (action) {
        case "go-quiz":
          window.Router.go("quiz");
          break;
        case "go-home":
          window.Router.go("home");
          break;
        case "go-result":
          window.Router.go("result");
          break;
        case "go-review":
          window.Router.go("review");
          break;
        case "go-prizes":
          if (s.prizesUnlocked) window.Router.go("prizes");
          else toast("Conclua o quiz para liberar os prêmios 🔒");
          break;
        case "go-album":
          if (s.albumUnlocked) window.Router.go("album");
          else toast("Conclua o quiz para liberar o álbum 🔒");
          break;
      }
    });

    const resetBtn = document.getElementById("reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (confirm("Reiniciar tudo? (apaga progresso, vales e álbum)")) {
          window.Store.reset();
          window.Router.go("login");
          toast("Tudo reiniciado ✨");
        }
      });
    }
  }

  /* ---------- Boot ---------- */
  function boot() {
    initLogin();
    initActions();
    initModal();
    initIcons();
    if (window.Quiz) window.Quiz.init();

    window.Router.onChange(function (screen) {
      if (screen === "home") renderHome();
      else if (screen === "quiz") window.Quiz && window.Quiz.start();
      else if (screen === "result") window.Result && window.Result.render();
      else if (screen === "review") window.Review && window.Review.render();
      else if (screen === "prizes") window.Prizes && window.Prizes.render();
      else if (screen === "album") window.Album && window.Album.render();
    });

    window.Router.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
