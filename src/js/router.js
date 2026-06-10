/* ============================================================
   ROUTER — troca de telas (show/hide) + guards
   Telas: login, home, quiz, result, review, prizes, album
   ============================================================ */
(function () {
  "use strict";

  const SCREENS = ["login", "home", "quiz", "result", "review", "prizes", "album"];
  const listeners = [];

  function el(name) {
    return document.getElementById("screen-" + name);
  }

  /** Regras de acesso. Retorna o nome da tela permitida (pode redirecionar). */
  function guard(target) {
    const s = window.Store.get();
    if (!s.auth) return "login";
    if (target === "login") return "home"; // já logado
    if ((target === "prizes") && !s.prizesUnlocked) return "home";
    if ((target === "album") && !s.albumUnlocked) return "home";
    if ((target === "result" || target === "review") && !s.quizCompleted) return "home";
    return target;
  }

  const Router = {
    current: null,

    go(target, opts) {
      opts = opts || {};
      const allowed = opts.skipGuard ? target : guard(target);

      SCREENS.forEach((name) => {
        const node = el(name);
        if (node) node.hidden = (name !== allowed);
      });

      this.current = allowed;
      // atualiza hash sem disparar navegação extra
      if (("#" + allowed) !== location.hash) {
        history.replaceState(null, "", "#" + allowed);
      }
      window.scrollTo(0, 0);
      listeners.forEach((fn) => fn(allowed));
    },

    /** Registra callback chamado a cada navegação (ex: render da tela). */
    onChange(fn) {
      listeners.push(fn);
    },

    /** Inicializa a partir do hash atual ou do estado. */
    init() {
      const fromHash = (location.hash || "").replace("#", "");
      const s = window.Store.get();
      const start = s.auth ? (SCREENS.includes(fromHash) ? fromHash : "home") : "login";
      this.go(start);
    }
  };

  window.Router = Router;
})();
