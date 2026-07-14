"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./layout/sidebar";
import { Topbar } from "./layout/topbar";
import { CommandPalette } from "./layout/command-palette";
import { useAdmin, type AdminUser } from "./admin-context";
import { LoginScreen } from "./modules/login-screen";
import { DashboardHome } from "./modules/dashboard-home";
import { MembersManager } from "./modules/members-manager";
import { EventsManager } from "./modules/events-manager";
import { ProjectsManager } from "./modules/projects-manager";
import { BoardManager } from "./modules/board-manager";
import {
  NewsManager, ApplicationsManager, TestimonialsManager,
  SponsorsManager, DownloadsManager, MessagesManager, ContactManager,
} from "./modules/content-managers";
import {
  GalleryManager, MediaLibrary, SeoManager, AnalyticsModule,
  NotificationsModule, AuditLogsModule, UsersManager, SettingsModule,
  BackupModule, HomepageManager,
} from "./modules/system-managers";

type Notification = { id: string; title: string; message: string; type: string; isRead: boolean; createdAt: Date; link?: string | null };

type ModuleData = {
  stats?: any;
  members?: any[];
  events?: any[];
  projects?: any[];
  board?: any[];
  news?: any[];
  gallery?: any[];
  applications?: any[];
  testimonials?: any[];
  sponsors?: any[];
  downloads?: any[];
  messages?: any[];
  notifications?: Notification[];
  auditLogs?: any[];
  users?: any[];
  settings?: Record<string, string>;
};

export function AdminShell({
  data,
}: {
  data: ModuleData;
  initialUser?: AdminUser | null;
}) {
  const { module, user } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const pendingCounts = {
    applications: data.applications?.filter((a) => a.status === "PENDING").length || 0,
    notifications: data.notifications?.filter((n) => !n.isRead).length || 0,
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} pendingCounts={pendingCounts} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          pendingCounts={pendingCounts}
          notifications={data.notifications}
          onNotificationRead={async (id) => {
            const { markNotificationRead } = await import("@/lib/actions");
            await markNotificationRead(id);
          }}
        />

        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={module}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ModuleRouter module={module} data={data} />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}

function ModuleRouter({ module, data }: { module: string; data: ModuleData }) {
  switch (module) {
    case "dashboard":
      return data.stats ? <DashboardHome stats={data.stats} /> : <Loading />;
    case "members":
      return data.members ? <MembersManager initialMembers={data.members} /> : <Loading />;
    case "events":
      return data.events ? <EventsManager initialEvents={data.events} /> : <Loading />;
    case "projects":
      return data.projects ? <ProjectsManager initialProjects={data.projects} /> : <Loading />;
    case "board":
      return data.board ? <BoardManager initialMembers={data.board} /> : <Loading />;
    case "news":
      return data.news ? <NewsManager initialArticles={data.news} /> : <Loading />;
    case "gallery":
      return data.gallery ? <GalleryManager initialImages={data.gallery} /> : <Loading />;
    case "applications":
      return data.applications ? <ApplicationsManager initialApps={data.applications} /> : <Loading />;
    case "testimonials":
      return data.testimonials ? <TestimonialsManager initialItems={data.testimonials} /> : <Loading />;
    case "sponsors":
      return data.sponsors ? <SponsorsManager initialSponsors={data.sponsors} /> : <Loading />;
    case "downloads":
      return data.downloads ? <DownloadsManager initialDownloads={data.downloads} /> : <Loading />;
    case "messages":
      return data.messages ? <MessagesManager initialMessages={data.messages} /> : <Loading />;
    case "contact":
      return data.settings ? <ContactManager settings={data.settings} /> : <Loading />;
    case "notifications":
      return data.notifications ? <NotificationsModule initialNotifications={data.notifications} /> : <Loading />;
    case "audit":
      return data.auditLogs ? <AuditLogsModule initialLogs={data.auditLogs} /> : <Loading />;
    case "users":
      return data.users ? <UsersManager initialUsers={data.users} /> : <Loading />;
    case "settings":
      return data.settings ? <SettingsModule settings={data.settings} /> : <Loading />;
    case "media":
      return <MediaLibrary />;
    case "seo":
      return data.settings ? <SeoManager settings={data.settings} /> : <Loading />;
    case "analytics":
      return <AnalyticsModule />;
    case "backup":
      return <BackupModule />;
    case "homepage":
      return <HomepageManager settings={data.settings} />;
    default:
      return <Loading />;
  }
}

function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-64 bg-muted rounded animate-pulse" />
      <div className="h-4 w-96 bg-muted rounded animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export type { AdminUser };
