import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Stats } from "@/components/sections/stats";
import { ExecutiveBoard } from "@/components/sections/executive-board";
import { Projects } from "@/components/sections/projects";
import { Events } from "@/components/sections/events";
import { Gallery } from "@/components/sections/gallery";
import { Membership } from "@/components/sections/membership";
import { Testimonials } from "@/components/sections/testimonials";
import { Sponsors } from "@/components/sections/sponsors";
import { Newsletter } from "@/components/sections/newsletter";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { siteConfig } from "@/lib/site-config";

/**
 * Leo Club of Pokhara — Official Website
 * Homepage composed of all major sections.
 *
 * Sections (in order):
 * 1. Hero — club banner, name, motto, primary CTAs
 * 2. About — Mission, Vision, Values, President's Message, History timeline
 * 3. Stats — animated impact statistics
 * 4. Executive Board — premium profile cards
 * 5. Projects — featured + secondary project cards
 * 6. Events — upcoming (with countdown) + past events, tabbed
 * 7. Gallery — masonry layout with category filter + lightbox
 * 8. Membership — benefits, eligibility, FAQs, application CTA
 * 9. Testimonials — quotes from members, alumni, partners
 * 10. Sponsors — marquee of partner organizations
 * 11. Newsletter — email subscription
 * 12. Contact — contact info, map placeholder, contact form
 * 13. Footer — quick links, social, newsletter mini, copyright
 */
export default function Home() {
  // Structured data (JSON-LD) for SEO — Organization + WebSite
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: siteConfig.name,
        alternateName: siteConfig.shortName,
        foundingDate: "1979-08-08",
        founder: {
          "@type": "Organization",
          name: siteConfig.charterSponsor,
        },
        parentOrganization: {
          "@type": "Organization",
          name: siteConfig.parentOrganization,
        },
        email: siteConfig.email,
        telephone: siteConfig.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Pokhara",
          addressRegion: "Gandaki Province",
          addressCountry: "NP",
        },
        slogan: siteConfig.motto,
        url: siteConfig.website,
        sameAs: Object.values(siteConfig.social),
      },
      {
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.website,
        inLanguage: "en",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex flex-col">
        <Hero />
        <About />
        <Stats />
        <ExecutiveBoard />
        <Projects />
        <Events />
        <Gallery />
        <Membership />
        <Testimonials />
        <Sponsors />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
