"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Calendar,
  Users,
  Target,
  Heart,
  Clock,
  Handshake,
} from "lucide-react";
import { statistics } from "@/lib/site-config";

const iconMap: Record<string, React.ElementType> = {
  calendar: Calendar,
  users: Users,
  target: Target,
  heart: Heart,
  clock: Clock,
  handshake: Handshake,
};

function AnimatedNumber({
  value,
  suffix = "",
  duration = 2000,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);

  const formatted =
    value >= 1000 ? display.toLocaleString("en-US") : display.toString();

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      {/* Premium dark backdrop */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0546A0] via-[#032D6B] to-[#060B16]" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      {/* Aurora */}
      <div
        className="aurora-blob"
        style={{
          top: "-15%",
          left: "10%",
          width: "30vw",
          height: "30vw",
          background: "#E00121",
          opacity: 0.25,
        }}
      />
      <div
        className="aurora-blob"
        style={{
          bottom: "-20%",
          right: "5%",
          width: "30vw",
          height: "30vw",
          background: "#F4C542",
          opacity: 0.18,
        }}
      />

      <div className="mx-auto max-w-7xl section-pad">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.18em] uppercase text-[#F4C542] border border-[#F4C542]/30 bg-[#F4C542]/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F4C542]" />
            Our Impact
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Measured in{" "}
            <span className="text-gradient-gold">decades and lives.</span>
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto text-base sm:text-lg">
            Numbers only tell part of the story — but they tell a story worth
            telling.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          {statistics.map((stat, i) => {
            const Icon = iconMap[stat.icon] || Target;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="rounded-2xl p-5 sm:p-6 glass-strong text-center group hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-[#F4C542]/15 text-[#F4C542] mb-3.5 group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-1.5 text-[12px] sm:text-[13px] text-white/60 leading-snug">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
