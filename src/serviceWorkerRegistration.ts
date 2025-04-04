function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          "./service-worker.js"
        );

        console.log("Service worker registered", registration);
      } catch (error) {
        console.error("Service worker registration failed:", error);
      }
    });
  }
}

function unregisterServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}

export const serviceWorkerRegistration = {
  register: registerServiceWorker,
  unregister: unregisterServiceWorker,
};
