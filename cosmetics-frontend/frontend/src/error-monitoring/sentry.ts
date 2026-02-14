import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

export const initSentry = () => {
  const DSN = import.meta.env.VITE_SENTRY_DSN;
  if (!DSN) return;

  Sentry.init({
    dsn: DSN,
    integrations: [
      new BrowserTracing({
        tracePropagationTargets: ["localhost", /^https:\/\/yourdomain\.com/],
      }),
    ],
    tracesSampleRate: 1.0,
    environment: import.meta.env.MODE,
  });
};
