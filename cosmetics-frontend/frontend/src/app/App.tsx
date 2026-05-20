// src/app/App.tsx
import RootRoutes from "./router/RootRoutes";
import AuthProvider from "./providers/AuthProvider";
import QueryProvider from "./providers/QueryProvider";
import { SocketProvider } from "./providers/SocketProvider";
import ThemeProvider from "./providers/ThemeProvider";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { ToastContainer } from "@/shared/ui/Toast";

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <SocketProvider>
                <RootRoutes />
                {/* ✅ Toast сповіщення — поверх всього */}
                <ToastContainer />
              </SocketProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

