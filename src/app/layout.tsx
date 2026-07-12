import type { Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://leoclubofpokhara.org.np"),
  title: {
    default: "Leo Club of Pokhara — Leadership · Experience · Opportunity",
    template: "%s · Leo Club of Pokhara",
  },
  description:
    "The official website of the Leo Club of Pokhara, Nepal — chartered on August 8, 1979 under the sponsorship of the Lions Club of Pokhara. Cultivating leadership, experience, and opportunity through service since 1979.",
  keywords: [
    "Leo Club of Pokhara",
    "Lions Club of Pokhara",
    "Leo Club Nepal",
    "Lions International",
    "Pokhara service club",
    "volunteer Nepal",
    "youth leadership Nepal",
    "Leadership Experience Opportunity",
  ],
  authors: [{ name: "Leo Club of Pokhara" }],
  creator: "Leo Club of Pokhara",
  publisher: "Leo Club of Pokhara",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Leo Club of Pokhara — Leadership · Experience · Opportunity",
    description:
      "Chartered August 8, 1979. Sponsored by the Lions Club of Pokhara. Cultivating leadership, experience, and opportunity through service since 1979.",
    url: "https://leoclubofpokhara.org.np",
    siteName: "Leo Club of Pokhara",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leo Club of Pokhara",
    description:
      "Chartered August 8, 1979. Sponsored by the Lions Club of Pokhara. Leadership · Experience · Opportunity.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#060B16" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoSerif.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
