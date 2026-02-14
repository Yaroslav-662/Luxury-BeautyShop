import React from "react";

type ErrorBoundaryState = { error: unknown | null };

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error("🔥 UI crashed:", error, info);
  }

  render() {
    if (this.state.error) {
      const err = this.state.error;
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as any).message)
          : String(err);

      return (
        <div style={{ padding: 16, color: "#fff" }}>
          <h2>UI crashed</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{message}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
