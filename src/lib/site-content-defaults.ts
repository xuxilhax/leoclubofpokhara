/**
 * Leo Club CMS — Site Content Defaults (non-server)
 * ----------------------------------------------------------------
 * Default content values. Separated from site-content.ts because
 * "use server" files can only export async functions.
 */

export const DEFAULT_CONTENT = {
  // Hero
  hero_title: "Leo Club of Pokhara",
  hero_subtitle: "For over four decades, we have cultivated Leadership, Experience, and Opportunity through meaningful service across the Pokhara Valley.",
  hero_button1_text: "Join Us",
  hero_button1_link: "#membership",
  hero_button2_text: "Explore Projects",
  hero_button2_link: "#projects",
  hero_badge_text: "Chartered August 08, 1979",
  hero_image_url: "",

  // About
  about_title: "A legacy of service, a future of impact.",
  about_description: "The Leo Club of Pokhara is a youth service organization chartered on August 8, 1979 under the sponsorship of the Lions Club of Pokhara. For over four decades, we have cultivated leadership, experience, and opportunity through meaningful community service across the Pokhara Valley and beyond.",
  about_mission: "To empower young people of Pokhara to serve their community with compassion, integrity, and excellence — developing ethical leaders who create lasting social impact through sustainable service initiatives in health, education, environment, and humanitarian relief.",
  about_vision: "To be the most trusted and impactful youth service club in the Pokhara Valley — recognized for cultivating compassionate leaders and delivering meaningful, measurable change in the communities we serve, while upholding the timeless values of Lions International.",
  president_name: "Leo [President Name]",
  president_title: "President, Leo Club of Pokhara",
  president_message: "It is my profound honor to welcome you to the Leo Club of Pokhara — a movement that has shaped young leaders and served our community with quiet dedication since 1979. For over four decades, this club has been a home for those who believe that small acts of service, performed consistently and with sincerity, can transform a city.",
  president_quote: "Service is not what we do in our free time — it is who we choose to become.",

  // Stats (JSON array)
  stats: JSON.stringify([
    { label: "Years of Service", value: 46, suffix: "+", icon: "calendar" },
    { label: "Active Members", value: 85, suffix: "+", icon: "users" },
    { label: "Projects Completed", value: 320, suffix: "+", icon: "target" },
    { label: "Lives Impacted", value: 25000, suffix: "+", icon: "heart" },
    { label: "Volunteer Hours", value: 48000, suffix: "+", icon: "clock" },
    { label: "Partner Organizations", value: 40, suffix: "+", icon: "handshake" },
  ]),

  // Contact
  contact_phone: "+977 9800000000",
  contact_email: "info@leoclubofpokhara.org.np",
  contact_address: "Pokhara, Kaski, Gandaki Province, Nepal",
  contact_hours: "Sat–Thu · 10:00 AM – 5:00 PM NPT",
  social_facebook: "https://facebook.com/leoclubofpokhara",
  social_instagram: "https://instagram.com/leoclubofpokhara",
  social_twitter: "https://twitter.com/leoclubofpkh",
  social_linkedin: "https://linkedin.com/company/leoclubofpokhara",
  social_youtube: "https://youtube.com/@leoclubofpokhara",

  // Footer
  footer_description: "A youth service organization chartered on August 08, 1979, under the sponsorship of the Lions Club of Pokhara. Cultivating leadership, experience, and opportunity through service since 1979.",

  // Club Info
  club_name: "Leo Club of Pokhara",
  club_motto: "Leadership · Experience · Opportunity",
  club_charter_date: "August 08, 1979",
  club_sponsor: "Lions Club of Pokhara",
  club_district: "District 325 B2, Nepal",
} as const;

export type SiteContent = typeof DEFAULT_CONTENT;
