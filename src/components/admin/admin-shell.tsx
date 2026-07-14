"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./layout/sidebar";
import { Topbar } from "./layout/topbar";
import { CommandPalette } from "./layout/command-palette";
import { useAdmin, type AdminUser } from "./admin-context";
import { DashboardHome } from "./modules/dashboard-home";
import { EventsManager } from "./modules/events-manager";
import { ProjectsManager } from "./modules/projects-manager";
import { BoardManager } from "./modules/board-manager";
import {
  NewsManager, ContactManager,
} from "./modules/content-managers";
import {
  GalleryManager, HomepageManager, SettingsModule, MediaLibrary,
} from "./modules/system-managers";

type ModuleData = {
  stats?: any;
  events?: any[];
  projects?: any[];
  board?: any[];
  news?: any[];
  gallery?: any[];
  settings?: Record<string, string>;
};

export function AdminShell({ data }: { data: ModuleData; initialUser?: AdminUser | null }) {
  const { module } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} pendingCounts={{}} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} pendingCounts={{}} notifications={[]} />
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <AnimatePresence mode="wait">
              <motion.div key={module} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                {(() => {
                  switch (module) {
                    case "dashboard": return data.stats ? <DashboardHome stats={data.stats} /> : <Loading />;
                    case "homepage": return <HomepageManager settings={data.settings} />;
                    case "board": return data.board ? <BoardManager initialMembers={data.board} /> : <Loading />;
                    case "projects": return data.projects ? <ProjectsManager initialProjects={data.projects} /> : <Loading />;
                    case "events": return data.events ? <EventsManager initialEvents={data.events} /> : <Loading />;
                    case "news": return data.news ? <NewsManager initialArticles={data.news} /> : <Loading />;
                    case "gallery": return data.gallery ? <GalleryManager initialImages={data.gallery} /> : <Loading />;
                    case "contact": return data.settings ? <ContactManager settings={data.settings} /> : <Loading />;
                    case "settings": return data.settings ? <SettingsModule settings={data.settings} /> : <Loading />;
                    case "media": return <MediaLibrary />;
                    default: return <Loading />;
                  }
                })()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}

function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-64 bg-muted rounded animate-pulse" />
      <div className="h-4 w-96 bg-muted rounded animate-pulse" />
    </div>
  );
}

export type { AdminUser };
