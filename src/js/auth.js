/* ============================================================
   AUTH — login fake
   ============================================================ */
(function () {
  "use strict";

  const VALID_USER = "joaoerafaelaamoreterno";
  const VALID_PASS = "01092022";

  const Auth = {
    /** Valida credenciais. */
    check(user, pass) {
      return (user || "").trim().toLowerCase() === VALID_USER &&
             (pass || "").trim() === VALID_PASS;
    },
    login() {
      window.Store.set({ auth: true });
    },
    logout() {
      window.Store.set({ auth: false });
    }
  };

  window.Auth = Auth;
})();
