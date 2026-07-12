import type { AdminModule } from "./admin-context";
import {
  LayoutDashboard, Home, Users, Calendar, Target, Image, Newspaper,
  FileText, MessageSquare, Heart, Award, Download, FolderOpen,
  Phone, Mail, Search, BarChart3, Bell, ScrollText, UserCog,
  Settings, Database, Crown,
} from "lucide-react";

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export type NavItem = {
  id: AdminModule;
  label: string;
  icon: React.ElementType;
  description: string;
  badge?: "pending" | "unread" | "new";
};

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        description: "Key metrics, recent activity, and quick actions",
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: BarChart3,
        description: "Visitor trends, traffic sources, popular pages",
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
        description: "Internal notification center",
        badge: "unread",
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        id: "homepage",
        label: "Homepage Manager",
        icon: Home,
        description: "Edit hero, about, stats, featured sections",
      },
      {
        id: "news",
        label: "News & Blog",
        icon: Newspaper,
        description: "Articles, drafts, scheduling, SEO",
      },
      {
        id: "gallery",
        label: "Gallery",
        icon: Image,
        description: "Albums, categories, drag-drop uploads",
      },
      {
        id: "testimonials",
        label: "Testimonials",
        icon: Heart,
        description: "Member & community testimonials",
      },
      {
        id: "sponsors",
        label: "Sponsors & Partners",
        icon: Award,
        description: "Logos, links, display order",
      },
      {
        id: "downloads",
        label: "Downloads",
        icon: Download,
        description: "PDFs, forms, reports, newsletters",
      },
      {
        id: "media",
        label: "Media Library",
        icon: FolderOpen,
        description: "Central file library with tags & folders",
      },
    ],
  },
  {
    label: "People",
    items: [
      {
        id: "board",
        label: "Executive Board",
        icon: Crown,
        description: "Manage current and past boards",
      },
      {
        id: "members",
        label: "Members",
        icon: Users,
        description: "Complete member database with export",
      },
      {
        id: "applications",
        label: "Applications",
        icon: FileText,
        description: "Review and process membership applications",
        badge: "pending",
      },
      {
        id: "users",
        label: "Admin Users",
        icon: UserCog,
        description: "Manage admin accounts & roles",
      },
    ],
  },
  {
    label: "Programs",
    items: [
      {
        id: "events",
        label: "Events",
        icon: Calendar,
        description: "Create, edit, duplicate, manage registrations",
      },
      {
        id: "projects",
        label: "Projects",
        icon: Target,
        description: "Service projects, fundraisers, campaigns",
      },
    ],
  },
  {
    label: "Communication",
    items: [
      {
        id: "messages",
        label: "Messages",
        icon: Mail,
        description: "Contact form submissions",
      },
      {
        id: "contact",
        label: "Contact Info",
        icon: Phone,
        description: "Edit phone, email, address, social links",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        id: "seo",
        label: "SEO Manager",
        icon: Search,
        description: "Meta tags, sitemap, robots.txt, Open Graph",
      },
      {
        id: "audit",
        label: "Audit Logs",
        icon: ScrollText,
        description: "Track every action across the dashboard",
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        description: "Club info, branding, theme, integrations",
      },
      {
        id: "backup",
        label: "Backup & Restore",
        icon: Database,
        description: "Automatic & manual backups, restore points",
      },
    ],
  },
];

/** Flat list of all modules for command palette search */
export const allModules: NavItem[] = navGroups.flatMap((g) => g.items);
