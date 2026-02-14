// src/analytics/google.ts

// Мінімальна безпечна обгортка для Google Analytics, без TS-помилок

const GA_ID = (import.meta as any).env.VITE_GA_ID as string | undefined;

export const initGoogleAnalytics = (): void => {
  if (typeof window === "undefined") return;
  if (!GA_ID) return;

  // Уникаємо повторного підключення
  if (document.getElementById("ga-script")) return;

  const script = document.createElement("script");
  script.async = true;
  script.id = "ga-script";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).gtag =
    (window as any).gtag ||
    function (...args: any[]) {
      (window as any).dataLayer.push(args);
    };

  (window as any).gtag("js", new Date());
  (window as any).gtag("config", GA_ID);
};

export const trackPageView = (path: string): void => {
  if (typeof window === "undefined") return;
  if (!GA_ID) return;
  const w = window as any;
  if (!w.gtag) return;

  w.gtag("event", "page_view", {
    page_path: path,
  });
};

export const trackEvent = (
  action: string,
  params?: Record<string, unknown>
): void => {
  if (typeof window === "undefined") return;
  if (!GA_ID) return;
  const w = window as any;
  if (!w.gtag) return;

  w.gtag("event", action, params ?? {});
};
