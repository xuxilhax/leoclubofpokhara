import type { AdminModule } from "./admin-context";
import {
  LayoutDashboard, Home, Crown, Target, Calendar, Image as ImageIcon,
  Newspaper, Phone, Settings, FolderOpen, Heart, Award,
} from "lucide-react";

export type NavGroup = { label: string; items: NavItem[] };
export type NavItem = { id: AdminModule; label: string; icon: React.ElementType; description: string };

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Quick overview" },
    ],
  },
  {
    label: "Website Content",
    items: [
      { id: "homepage", label: "Homepage", icon: Home, description: "Hero, stats, history, values, footer" },
      { id: "board", label: "Executive Board", icon: Crown, description: "Board members with photos" },
      { id: "projects", label: "Projects", icon: Target, description: "Service projects with images" },
      { id: "events", label: "Events", icon: Calendar, description: "Events with cover images" },
      { id: "news", label: "News", icon: Newspaper, description: "News articles with images" },
      { id: "gallery", label: "Gallery", icon: ImageIcon, description: "Photo albums and images" },
      { id: "testimonials", label: "Voices", icon: Heart, description: "Member and community testimonials" },
      { id: "sponsors", label: "Partners", icon: Award, description: "Sponsor logos and website links" },
      { id: "contact", label: "Contact", icon: Phone, description: "Phone, email, address, social links" },
    ],
  },
  {
    label: "Settings",
    items: [
      { id: "settings", label: "Site Settings", icon: Settings, description: "Club name, logo, motto, SEO" },
      { id: "media", label: "Media Library", icon: FolderOpen, description: "Browse and manage uploaded files" },
    ],
  },
];

export const allModules: NavItem[] = navGroups.flatMap((g) => g.items);
