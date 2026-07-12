"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ShieldCheck, Bug, ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { LeoLogo, LogoEmblem } from "@/components/brand/leo-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { loginAction, getAuthDebugAction } from "../auth-actions";
import { ROLE_LABELS } from "@/lib/auth-helpers";

type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl: string | null;
};

export function LoginScreen({ onLogin }: { onLogin: (user: SessionUser) => void }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [forgotMode, setForgotMode] = React.useState(false);
  const [lastError, setLastError] = React.useState<{ message: string; type?: string; debug?: string } | null>(null);
  const [showDebug, setShowDebug] = React.useState(false);
  const [debugInfo, setDebugInfo] = React.useState<null | {
    dbReachable: boolean;
    dbError?: string;
    userCount: number;
    demoAccounts: { email: string; exists: boolean; isActive: boolean }[];
    env: { NODE_ENV: string; DATABASE_URL_SET: boolean };
  }>(null);
  const [debugLoading, setDebugLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLastError(null);

    if (!email || !password) {
      setLastError({ message: "Please fill in all fields", type: "VALIDATION" });
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const result = await loginAction(email, password, remember);

      if (result.success && result.user) {
        toast({ title: `Welcome back, ${result.user.name.split(" ")[0]}!` });
        onLogin(result.user);
      } else {
        // Store the structured error so we can show debug info
        setLastError({
          message: result.error || "Login failed. Please try again.",
          type: result.errorType,
          debug: result.debug,
        });

        // Show toast with appropriate message
        const toastTitle =
          result.errorType === "DB_ERROR"
            ? "Database error"
            : result.errorType === "VALIDATION"
            ? "Check your input"
            : result.errorType === "INTERNAL"
            ? "Server error"
            : "Login failed";

        toast({
          title: toastTitle,
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (err) {
      // This catch is a last-resort safety net. loginAction already
      // catches everything, so if we get here it's a transport error
      // (network, server restart, etc.).
      const msg = err instanceof Error ? err.message : "Please try again.";
      setLastError({
        message: "Network or server error. Please check your connection and try again.",
        type: "INTERNAL",
        debug: process.env.NODE_ENV === "development" ? msg : undefined,
      });
      toast({
        title: "Something went wrong",
        description: "Network or server error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /** Run a diagnostic check — only works in development mode */
  const runDebugCheck = async () => {
    setDebugLoading(true);
    try {
      const info = await getAuthDebugAction();
      setDebugInfo(info);
    } catch (err) {
      setDebugInfo({
        dbReachable: false,
        dbError: err instanceof Error ? err.message : String(err),
        userCount: 0,
        demoAccounts: [],
        env: { NODE_ENV: "unknown", DATABASE_URL_SET: false },
      });
    } finally {
      setDebugLoading(false);
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Reset link sent",
      description: `If an account exists for ${email}, a reset link is on its way.`,
    });
    setForgotMode(false);
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left — brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-[#0546A0] via-[#032D6B] to-[#060B16] text-white">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="aurora-blob" style={{ top: "-10%", left: "-5%", width: "40vw", height: "40vw", background: "#E00121", opacity: 0.3 }} />
          <div className="aurora-blob" style={{ bottom: "-15%", right: "-10%", width: "50vw", height: "50vw", background: "#F4C542", opacity: 0.2 }} />
          <div className="absolute inset-0 bg-grid opacity-15" />
        </div>

        {/* Brand */}
        <div className="relative">
          <div className="flex items-center gap-3 text-white">
            <LogoEmblem width={48} height={48} />
            <div className="flex flex-col leading-none">
              <span className="font-serif font-bold text-lg">Leo Club of Pokhara</span>
              <span className="text-[11px] tracking-[0.18em] uppercase text-white/60">Admin CMS</span>
            </div>
          </div>
        </div>

        {/* Centerpiece */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-[11px] font-medium text-white/90 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-[#F4C542]" />
              Chartered August 08, 1979
            </div>
            <h1 className="text-4xl xl:text-5xl font-serif font-bold leading-[1.1]">
              Manage your club with{" "}
              <span className="text-gradient-gold">clarity & confidence.</span>
            </h1>
            <p className="mt-6 text-[15px] text-white/70 leading-relaxed max-w-md">
              A single, polished dashboard to manage members, events, projects,
              content, and communications for the Leo Club of Pokhara — designed
              to serve future officers for decades.
            </p>
          </motion.div>
        </div>

        {/* Trust footer */}
        <div className="relative space-y-3">
          <div className="flex items-center gap-3 text-[12px] text-white/70">
            <ShieldCheck className="h-4 w-4 text-[#F4C542]" />
            <span>Role-based access · Audit logging · Secure sessions</span>
          </div>
          <div className="text-[11px] text-white/40">
            © {new Date().getFullYear()} Leo Club of Pokhara · {ROLE_LABELS.SUPER_ADMIN} access only
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <LeoLogo size="lg" />
          </div>

          {!forgotMode ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold">Sign in</h2>
                <p className="mt-1.5 text-[13.5px] text-muted-foreground">
                  Enter your credentials to access the dashboard.
                </p>
              </div>

              {/* Error banner — shows structured error info when login fails */}
              <AnimatePresence>
                {lastError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`rounded-xl p-3.5 border text-[12.5px] ${
                        lastError.type === "DB_ERROR"
                          ? "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/30 dark:border-orange-900 dark:text-orange-200"
                          : lastError.type === "VALIDATION"
                          ? "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-200"
                          : lastError.type === "INTERNAL"
                          ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-900 dark:text-red-200"
                          : "bg-muted border-border text-foreground"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium">{lastError.message}</div>
                          {lastError.debug && (
                            <div className="mt-1.5 pt-1.5 border-t border-current/20 font-mono text-[11px] opacity-80">
                              <span className="font-semibold">Debug:</span> {lastError.debug}
                            </div>
                          )}
                          {lastError.type === "DB_ERROR" && (
                            <div className="mt-1.5 text-[11px] opacity-80">
                              The database may be unreachable. Use the diagnostics panel below to investigate.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[13px]">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@leo.club"
                      required
                      autoFocus
                      className="h-11 rounded-xl pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[13px]">Password</Label>
                    <button
                      type="button"
                      onClick={() => setForgotMode(true)}
                      className="text-[12px] text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="h-11 rounded-xl pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={remember}
                    onCheckedChange={(v) => setRemember(v === true)}
                  />
                  <Label htmlFor="remember" className="text-[13px] font-normal cursor-pointer">
                    Keep me signed in for 7 days
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white font-semibold gap-2"
                >
                  {loading ? "Signing in…" : "Sign in"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>

              {/* Demo credentials */}
              <div className="mt-7 pt-6 border-t border-border">
                <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold mb-2.5">
                  Demo accounts
                </div>
                <div className="space-y-1.5">
                  {[
                    { email: "admin@leo.club", pass: "admin123", role: ROLE_LABELS.SUPER_ADMIN },
                    { email: "president@leo.club", pass: "leo123", role: ROLE_LABELS.PRESIDENT },
                    { email: "editor@leo.club", pass: "leo123", role: ROLE_LABELS.EDITOR },
                  ].map((u) => (
                    <button
                      key={u.email}
                      onClick={() => fillDemo(u.email, u.pass)}
                      className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                    >
                      <div className="flex flex-col">
                        <span className="text-[12px] font-mono">{u.email}</span>
                        <span className="text-[11px] text-muted-foreground">{u.role}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground group-hover:text-foreground">use →</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Debug panel — only visible in development mode */}
              {process.env.NODE_ENV === "development" && (
                <div className="mt-7 pt-6 border-t border-border">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDebug((v) => !v);
                      if (!debugInfo && !showDebug) runDebugCheck();
                    }}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">
                      <Bug className="h-3.5 w-3.5" />
                      Diagnostics (dev mode)
                    </span>
                    {showDebug ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                  </button>

                  <AnimatePresence>
                    {showDebug && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 space-y-2.5 rounded-xl bg-muted/50 border border-border p-4 text-[11.5px] font-mono">
                          {debugLoading ? (
                            <div className="text-muted-foreground">Running diagnostics…</div>
                          ) : debugInfo ? (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">Environment:</span>
                                <span>{debugInfo.env.NODE_ENV}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">DATABASE_URL:</span>
                                {debugInfo.env.DATABASE_URL_SET ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                                ) : (
                                  <XCircle className="h-3.5 w-3.5 text-red-600" />
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">DB reachable:</span>
                                {debugInfo.dbReachable ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                                ) : (
                                  <XCircle className="h-3.5 w-3.5 text-red-600" />
                                )}
                              </div>
                              {debugInfo.dbError && (
                                <div className="text-red-600 dark:text-red-400 break-all">
                                  <span className="font-semibold">Error:</span> {debugInfo.dbError}
                                </div>
                              )}
                              <div>
                                <span className="font-semibold">User count:</span> {debugInfo.userCount}
                              </div>
                              <div>
                                <span className="font-semibold">Demo accounts:</span>
                                <div className="mt-1 space-y-1 pl-3">
                                  {debugInfo.demoAccounts.map((acc) => (
                                    <div key={acc.email} className="flex items-center gap-2">
                                      <span className="w-40 truncate">{acc.email}</span>
                                      {acc.exists ? (
                                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                                      ) : (
                                        <XCircle className="h-3 w-3 text-red-600" />
                                      )}
                                      {acc.exists && (
                                        <span className={acc.isActive ? "text-green-600" : "text-orange-600"}>
                                          {acc.isActive ? "active" : "inactive"}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={runDebugCheck}
                                className="mt-2 text-[10.5px] text-primary hover:underline"
                              >
                                ↻ Re-run diagnostics
                              </button>
                            </>
                          ) : (
                            <div className="text-muted-foreground">No data. Click re-run.</div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold">Reset password</h2>
                <p className="mt-1.5 text-[13.5px] text-muted-foreground">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>
              <form onSubmit={handleForgot} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-[13px]">Email address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@leo.club"
                    required
                    className="h-11 rounded-xl"
                  />
                </div>
                <Button type="submit" className="w-full h-11 rounded-xl bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white font-semibold">
                  Send reset link
                </Button>
                <button
                  type="button"
                  onClick={() => setForgotMode(false)}
                  className="w-full text-[12.5px] text-muted-foreground hover:text-foreground"
                >
                  ← Back to sign in
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
