"use client";

/**
 * Leo Club CMS — Global Error Boundary
 * ----------------------------------------------------------------
 * Catches unhandled errors from Server Components and Server Actions.
 * Shows a friendly error page with the error digest in production,
 * and the full error message + stack in development.
 *
 * This file MUST be a client component ("use client") and MUST accept
 * `error` and `reset` props per Next.js App Router convention.
 */
import * as React from "react";
import { AlertTriangle, RotateCcw, Home, Bug, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeoLogo } from "@/components/brand/leo-logo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === "development";
  const [copied, setCopied] = React.useState(false);

  // Log the error to the console for debugging
  React.useEffect(() => {
    console.error("[Error Boundary]", error);
  }, [error]);

  const copyError = () => {
    const errorText = `Error: ${error.message}\nDigest: ${error.digest || "N/A"}\nStack: ${error.stack || "N/A"}`;
    navigator.clipboard.writeText(errorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <LeoLogo size="md" />
        </div>

        {/* Error card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-premium">
          <div className="flex items-start gap-4 mb-5">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 shrink-0">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold">
                {isDev ? "Development Error" : "Something went wrong"}
              </h1>
              <p className="mt-1 text-[13px] text-muted-foreground">
                {isDev
                  ? "An error occurred while rendering this page. Details below."
                  : "An unexpected error occurred. Our team has been notified. Please try again."}
              </p>
            </div>
          </div>

          {/* Error details — only in development */}
          {isDev && (
            <div className="mb-5 rounded-xl bg-muted/50 border border-border p-4 space-y-2">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">
                Error Message
              </div>
              <div className="font-mono text-[12px] text-red-600 dark:text-red-400 break-all">
                {error.message}
              </div>
              {error.digest && (
                <>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold mt-3">
                    Digest
                  </div>
                  <div className="font-mono text-[11px] text-muted-foreground">{error.digest}</div>
                </>
              )}
              {error.stack && (
                <>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold mt-3">
                    Stack Trace
                  </div>
                  <pre className="font-mono text-[10.5px] text-muted-foreground overflow-x-auto max-h-40 overflow-y-auto scroll-premium whitespace-pre-wrap break-all">
                    {error.stack}
                  </pre>
                </>
              )}
            </div>
          )}

          {/* Digest in production (for support tickets) */}
          {!isDev && error.digest && (
            <div className="mb-5 rounded-xl bg-muted/50 border border-border p-3 flex items-center justify-between">
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">
                  Error ID
                </div>
                <div className="font-mono text-[11px] text-muted-foreground mt-0.5">{error.digest}</div>
              </div>
              <button
                onClick={copyError}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium hover:bg-muted transition-colors"
              >
                {copied ? (
                  <><CheckCircle2 className="h-3 w-3 text-green-600" /> Copied</>
                ) : (
                  <><Copy className="h-3 w-3" /> Copy</>
                )}
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={reset}
              className="flex-1 h-11 rounded-xl bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 h-11 rounded-xl gap-2"
            >
              <a href="/">
                <Home className="h-4 w-4" />
                Go home
              </a>
            </Button>
          </div>

          {/* Debug hint */}
          {isDev && (
            <div className="mt-4 pt-4 border-t border-border text-[11px] text-muted-foreground flex items-start gap-2">
              <Bug className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <div>
                <strong>Debug mode is on.</strong> The full error is shown above.
                In production, only the Error ID (digest) would be visible.
                Check the server console for additional Prisma/DB errors.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
