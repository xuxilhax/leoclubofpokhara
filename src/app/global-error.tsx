"use client";

/**
 * Leo Club CMS — Global Error (root layout level)
 * ----------------------------------------------------------------
 * This catches errors that happen in the root layout itself
 * (e.g., font loading failures, ThemeProvider crashes).
 * Per Next.js convention, this MUST render <html> and <body>.
 */
import * as React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalRootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[Global Root Error]", error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8f9fa",
            padding: "1rem",
          }}
        >
          <div
            style={{
              maxWidth: "420px",
              width: "100%",
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              padding: "32px",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#fef2f2",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <AlertTriangle size={24} />
            </div>
            <h1 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 8px" }}>
              Application Error
            </h1>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 20px", lineHeight: 1.5 }}>
              {isDev
                ? error.message || "An error occurred in the root layout."
                : "The application encountered a critical error. Please refresh the page."}
            </p>
            {isDev && error.digest && (
              <p style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "monospace", margin: "0 0 20px" }}>
                Digest: {error.digest}
              </p>
            )}
            {isDev && error.stack && (
              <pre
                style={{
                  fontSize: "10px",
                  color: "#6b7280",
                  background: "#f9fafb",
                  padding: "12px",
                  borderRadius: "8px",
                  overflow: "auto",
                  maxHeight: "200px",
                  margin: "0 0 20px",
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                {error.stack}
              </pre>
            )}
            <button
              onClick={reset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "12px",
                background: "#0546A0",
                color: "#ffffff",
                border: "none",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={16} />
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
