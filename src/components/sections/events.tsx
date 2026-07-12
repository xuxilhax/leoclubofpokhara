"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ArrowRight, History } from "lucide-react";
import { SectionHeading, GoldDivider } from "@/components/section-heading";
import { upcomingEvents, pastEvents } from "@/lib/site-config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  Celebration: "bg-[#F4C542]/15 text-[#8B6510] border-[#F4C542]/30",
  Environment: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30",
  Health: "bg-[#E00121]/15 text-[#B00F23] border-[#E00121]/30",
  Leadership: "bg-[#0546A0]/15 text-[#0546A0] dark:text-[#4A90E2] border-[#0546A0]/30",
  Cultural: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
  Education: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
  Awareness: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30",
};

/** Live countdown to a target date */
function Countdown({ target }: { target: string }) {
  const targetDate = React.useMemo(() => new Date(target).getTime(), [target]);
  const [remaining, setRemaining] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0, past: false });

  React.useEffect(() => {
    const calc = () => {
      const diff = targetDate - Date.now();
      if (diff <= 0) {
        setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, past: true });
        return;
      }
      const days = Math.floor(diff / 86_400_000);
      const hours = Math.floor((diff % 86_400_000) / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000) / 60_000);
      const seconds = Math.floor((diff % 60_000) / 1_000);
      setRemaining({ days, hours, minutes, seconds, past: false });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (remaining.past) {
    return (
      <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        Event in progress
      </div>
    );
  }

  const units = [
    { label: "Days", value: remaining.days },
    { label: "Hrs", value: remaining.hours },
    { label: "Min", value: remaining.minutes },
    { label: "Sec", value: remaining.seconds },
  ];

  return (
    <div className="flex items-center gap-1.5">
      {units.map((u, i) => (
        <React.Fragment key={u.label}>
          <div className="text-center">
            <div className="font-serif font-bold text-lg sm:text-xl tabular-nums leading-none">
              {String(u.value).padStart(2, "0")}
            </div>
            <div className="text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground mt-1">
              {u.label}
            </div>
          </div>
          {i < units.length - 1 && (
            <span className="text-muted-foreground/40 font-serif font-bold">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function formatDate(iso: string, withTime = true) {
  const d = new Date(iso);
  const dateStr = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  if (!withTime) return dateStr;
  const timeStr = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${dateStr} · ${timeStr}`;
}

export function Events({ overrideUpcoming, overridePast }: { overrideUpcoming?: typeof upcomingEvents; overridePast?: typeof pastEvents } = {}) {
  const reduce = useReducedMotion();
  const [tab, setTab] = React.useState("upcoming");
  const upcoming = overrideUpcoming || upcomingEvents;
  const past = overridePast || pastEvents;

  return (
    <section id="events" className="relative section-py overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-[35vw] h-[35vw] bg-[var(--leo-blue)]/[0.05] rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl section-pad">
        <SectionHeading
          eyebrow="Events"
          title={
            <>
              Mark the dates. <span className="text-gradient-blue">Make a difference.</span>
            </>
          }
          description="From our annual Charter Night to quarterly service drives — here's what's coming up and what we've recently been part of."
        />

        <GoldDivider className="mt-10" />

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="mt-12">
          <div className="flex justify-center">
            <TabsList className="rounded-full p-1 bg-muted/60 border border-border">
              <TabsTrigger
                value="upcoming"
                className="rounded-full px-5 data-[state=active]:bg-background data-[state=active]:shadow-soft"
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="rounded-full px-5 data-[state=active]:bg-background data-[state=active]:shadow-soft"
              >
                Past Events
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upcoming" className="mt-10">
            <div className="space-y-5">
              {upcoming.map((event, i) => (
                <motion.article
                  key={event.title}
                  initial={reduce ? {} : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group rounded-3xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-premium transition-all duration-300"
                >
                  <div className="grid lg:grid-cols-12 gap-0">
                    {/* Date block */}
                    <div className="lg:col-span-3 relative p-6 sm:p-7 bg-gradient-to-br from-[var(--leo-blue)] to-[#032D6B] text-white flex flex-col justify-between min-h-[160px]">
                      <div className="absolute inset-0 bg-grid opacity-15" />
                      <div className="relative">
                        <div className="text-[10.5px] uppercase tracking-[0.18em] text-[#F4C542] font-semibold">
                          {new Date(event.date).toLocaleDateString("en-US", { month: "long" })}
                        </div>
                        <div className="font-serif font-bold text-5xl mt-1 leading-none">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-xs text-white/60 mt-1">
                          {new Date(event.date).toLocaleDateString("en-US", { weekday: "long" })}
                        </div>
                      </div>
                      <div className="relative mt-4">
                        <Badge className="bg-white/15 text-white border-white/20 backdrop-blur">
                          {event.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-6 p-6 sm:p-7">
                      <h3 className="font-serif font-bold text-xl leading-tight">
                        {event.title}
                      </h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                        {event.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px]">
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          {formatDate(event.date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          {event.location}
                        </span>
                      </div>
                    </div>

                    {/* Countdown + CTA */}
                    <div className="lg:col-span-3 p-6 sm:p-7 border-t lg:border-t-0 lg:border-l border-border flex flex-col justify-between gap-4 bg-muted/30">
                      <div>
                        <div className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground font-semibold mb-2.5">
                          Starts in
                        </div>
                        <Countdown target={event.date} />
                      </div>
                      <Button
                        asChild
                        className="rounded-full bg-[var(--leo-red)] hover:bg-[var(--leo-red)]/90 text-white"
                      >
                        <a href={event.registrationUrl} className="gap-1.5">
                          Register
                          <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past" className="mt-10">
            <div className="grid sm:grid-cols-2 gap-5">
              {past.map((event, i) => (
                <motion.article
                  key={event.title}
                  initial={reduce ? {} : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group rounded-2xl p-5 bg-card border border-border hover:border-primary/30 hover:shadow-soft transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-muted text-muted-foreground">
                        <History className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <span
                          className={cn(
                            "inline-block mt-0.5 text-[10.5px] font-semibold px-2 py-0.5 rounded-full border",
                            categoryColors[event.category] || "bg-muted text-muted-foreground border-border"
                          )}
                        >
                          {event.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-3 font-serif font-bold text-[15.5px] leading-tight">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                    {event.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.location}
                  </div>
                </motion.article>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
