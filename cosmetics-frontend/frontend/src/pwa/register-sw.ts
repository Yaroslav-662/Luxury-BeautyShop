export const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("🟡 ServiceWorker registered:", reg.scope);

          reg.onupdatefound = () => {
            const worker = reg.installing;
            worker?.addEventListener("statechange", () => {
              if (worker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  console.log("🔄 Нова версія доступна");
                } else {
                  console.log("✨ Контент доступний офлайн");
                }
              }
            });
          };
        })
        .catch((err) => console.error("ServiceWorker error:", err));
    });
  }
};
