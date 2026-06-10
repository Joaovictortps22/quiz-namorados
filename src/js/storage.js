/* ============================================================
   STORAGE — estado central persistido em localStorage
   ============================================================ */
(function () {
  "use strict";

  const KEY = "qn_state";

  const DEFAULT_STATE = {
    auth: false,
    quizCompleted: false,
    answers: [],          // índice marcado por pergunta
    score: 0,
    prizesUnlocked: false,
    albumUnlocked: false,
    packOpened: false,    // saquinho já aberto
    stickersPlaced: [],   // ids de fotos coladas
    valesUsed: []         // ids de vales usados
  };

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { ...DEFAULT_STATE };
      return { ...DEFAULT_STATE, ...JSON.parse(raw) };
    } catch (e) {
      return { ...DEFAULT_STATE };
    }
  }

  function write(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Não foi possível salvar o estado:", e);
    }
  }

  const Store = {
    /** Retorna cópia do estado atual. */
    get() {
      return read();
    },
    /** Lê uma chave específica. */
    getKey(k) {
      return read()[k];
    },
    /** Mescla um patch no estado e persiste. Retorna novo estado. */
    set(patch) {
      const next = { ...read(), ...patch };
      write(next);
      return next;
    },
    /** Reseta tudo para o padrão. */
    reset() {
      write({ ...DEFAULT_STATE });
      return { ...DEFAULT_STATE };
    },
    DEFAULT_STATE
  };

  window.Store = Store;
})();
