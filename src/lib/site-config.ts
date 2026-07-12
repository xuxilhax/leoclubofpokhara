/**
 * Leo Club of Pokhara — Centralized site configuration & content
 * -----------------------------------------------------------------
 * All static content lives here so a CMS/admin dashboard can later
 * replace this module with API calls without touching components.
 *
 * Replace placeholder text with real content as it becomes available.
 * Never use Lorem Ipsum — use the standard placeholder string below.
 */

export const PLACEHOLDER = "Content will be updated soon.";

export const siteConfig = {
  name: "Leo Club of Pokhara",
  shortName: "Leo Pokhara",
  motto: "Leadership · Experience · Opportunity",
  tagline: "Serving Pokhara since 1979",
  description:
    "The Leo Club of Pokhara is a youth service organization chartered on August 8, 1979 under the sponsorship of the Lions Club of Pokhara. For over four decades, we have cultivated leadership, experience, and opportunity through meaningful community service across the Pokhara Valley and beyond.",
  charterDate: "August 08, 1979",
  charterYear: 1979,
  charterSponsor: "Lions Club of Pokhara",
  parentOrganization: "Lions International",
  district: "District 325 B2, Nepal",
  email: "info@leoclubofpokhara.org.np",
  phone: "+977 9800000000",
  address: "Pokhara, Kaski, Gandaki Province, Nepal",
  website: "https://leoclubofpokhara.org.np",
  social: {
    facebook: "https://facebook.com/leoclubofpokhara",
    instagram: "https://instagram.com/leoclubofpokhara",
    twitter: "https://twitter.com/leoclubofpkh",
    linkedin: "https://linkedin.com/company/leoclubofpokhara",
    youtube: "https://youtube.com/@leoclubofpokhara",
  },
} as const;

/** Primary navigation — anchor IDs match the section IDs in page.tsx */
export const mainNav = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Events", href: "#events" },
  { label: "Gallery", href: "#gallery" },
  { label: "Board", href: "#board" },
  { label: "Membership", href: "#membership" },
  { label: "Contact", href: "#contact" },
] as const;

/** Mission & Vision */
export const missionVision = {
  mission:
    "To empower young people of Pokhara to serve their community with compassion, integrity, and excellence — developing ethical leaders who create lasting social impact through sustainable service initiatives in health, education, environment, and humanitarian relief.",
  vision:
    "To be the most trusted and impactful youth service club in the Pokhara Valley — recognized for cultivating compassionate leaders and delivering meaningful, measurable change in the communities we serve, while upholding the timeless values of Lions International.",
  values: [
    {
      title: "Service Above Self",
      description:
        "We place community before individual, dedicating our time, energy, and skills to causes larger than ourselves.",
    },
    {
      title: "Integrity & Transparency",
      description:
        "We act with honesty, accountability, and openness in every initiative, partnership, and decision we make.",
    },
    {
      title: "Leadership Development",
      description:
        "We invest in the growth of every member, providing platforms to lead, organize, and inspire through service.",
    },
    {
      title: "Inclusive Community",
      description:
        "We welcome young people from all backgrounds, beliefs, and walks of life, united by a shared commitment to serve.",
    },
  ],
};

/** President's message */
export const presidentMessage = {
  presidentName: "Leo [President Name]",
  presidentTitle: "President, Leo Club of Pokhara",
  presidentialTerm: "Leoistic Year 2025–2026",
  message:
    "It is my profound honor to welcome you to the Leo Club of Pokhara — a movement that has shaped young leaders and served our community with quiet dedication since 1979. For over four decades, this club has been a home for those who believe that small acts of service, performed consistently and with sincerity, can transform a city. As we step into a new Leoistic year, we reaffirm our commitment to the timeless motto of Leo: Leadership, Experience, and Opportunity. We invite you to walk with us — as a member, a partner, or a friend — and help us build a Pokhara that is healthier, more equitable, and full of opportunity for all.",
  quote:
    "Service is not what we do in our free time — it is who we choose to become.",
};

/** Animated statistics */
export const statistics = [
  { label: "Years of Service", value: 46, suffix: "+", icon: "calendar" },
  { label: "Active Members", value: 85, suffix: "+", icon: "users" },
  { label: "Projects Completed", value: 320, suffix: "+", icon: "target" },
  { label: "Lives Impacted", value: 25000, suffix: "+", icon: "heart" },
  { label: "Volunteer Hours", value: 48000, suffix: "+", icon: "clock" },
  { label: "Partner Organizations", value: 40, suffix: "+", icon: "handshake" },
];

/** Executive Board — 12 members */
export const executiveBoard = [
  {
    name: "Leo [President Name]",
    position: "President",
    bio:
      "Leading the club's vision for the Leoistic Year 2025–2026 with a focus on sustainable community impact and member development.",
    image: "president",
    social: { facebook: "#", instagram: "#", linkedin: "#" },
  },
  {
    name: "Leo [Vice President Name]",
    position: "Immediate Past President",
    bio:
      "Providing counsel and continuity from the previous Leoistic year, mentoring the new board.",
    image: "ipp",
    social: { facebook: "#", instagram: "#", linkedin: "#" },
  },
  {
    name: "Leo [VP Name]",
    position: "Vice President",
    bio:
      "Supporting the President in steering club operations and overseeing project execution across portfolios.",
    image: "vp",
    social: { facebook: "#", instagram: "#", linkedin: "#" },
  },
  {
    name: "Leo [Secretary Name]",
    position: "Secretary",
    bio:
      "Maintaining club records, correspondence, and the official minutes of every meeting and resolution.",
    image: "secretary",
    social: { facebook: "#", instagram: "#", linkedin: "#" },
  },
  {
    name: "Leo [Treasurer Name]",
    position: "Treasurer",
    bio:
      "Stewarding the club's finances with transparency, accountability, and adherence to Lions International guidelines.",
    image: "treasurer",
    social: { facebook: "#", instagram: "#", linkedin: "#" },
  },
  {
    name: "Leo [Director Name]",
    position: "Director — Service",
    bio:
      "Curating and overseeing the year's community service initiatives and impact measurement.",
    image: "director-service",
    social: { facebook: "#", instagram: "#", linkedin: "#" },
  },
  {
    name: "Leo [Director Name]",
    position: "Director — Membership",
    bio:
      "Driving member recruitment, onboarding, and retention across the Leoistic year.",
    image: "director-membership",
    social: { facebook: "#", instagram: "#", linkedin: "#" },
  },
  {
    name: "Leo [Director Name]",
    position: "Director — PR & Communications",
    bio:
      "Telling the club's story across digital platforms and traditional media to amplify our impact.",
    image: "director-pr",
    social: { facebook: "#", instagram: "#", linkedin: "#" },
  },
  {
    name: "Leo [Director Name]",
    position: "Director — Finance",
    bio:
      "Supporting fundraising, sponsorships, and grant management for the year's initiatives.",
    image: "director-finance",
    social: { facebook: "#", instagram: "#", linkedin: "#" },
  },
  {
    name: "Leo [Director Name]",
    position: "Director — IT & Innovation",
    bio:
      "Modernizing the club's digital infrastructure and exploring technology-enabled service models.",
    image: "director-it",
    social: { facebook: "#", instagram: "#", linkedin: "#" },
  },
  {
    name: "Leo [Director Name]",
    position: "Director — Environment",
    bio:
      "Leading the club's environmental and sustainability portfolio, including clean-up and plantation drives.",
    image: "director-env",
    social: { facebook: "#", instagram: "#", linkedin: "#" },
  },
  {
    name: "Leo [Director Name]",
    position: "Director — Health",
    bio:
      "Coordinating blood donation camps, health camps, and awareness drives in partnership with local hospitals.",
    image: "director-health",
    social: { facebook: "#", instagram: "#", linkedin: "#" },
  },
];

/** Featured projects */
export const featuredProjects = [
  {
    title: "Blood Donation Drive",
    category: "Health",
    description:
      "A flagship annual initiative organized in partnership with local hospitals and the Red Cross Society, collecting life-saving blood units for patients in need across the Pokhara Valley.",
    impact: "1,200+ units collected",
    date: "Ongoing — Quarterly",
    location: "Pokhara, Kaski",
    image: "blood-donation",
    featured: true,
  },
  {
    title: "School Supplies Distribution",
    category: "Education",
    description:
      "Equipping underprivileged students across government schools in rural Kaski with books, stationery, uniforms, and backpacks at the start of every academic year.",
    impact: "3,500+ students supported",
    date: "Annual — April",
    location: "Rural Kaski, Nepal",
    image: "school-supplies",
    featured: true,
  },
  {
    title: "Phewa Lake Clean-Up",
    category: "Environment",
    description:
      "A monthly community-driven effort to remove plastic, debris, and invasive growth from the shores of Phewa Lake — preserving Pokhara's most iconic natural landmark.",
    impact: "4 tons of waste removed",
    date: "Monthly",
    location: "Phewa Lakeside, Pokhara",
    image: "lake-cleanup",
    featured: true,
  },
  {
    title: "Winter Warmth Drive",
    category: "Humanitarian",
    description:
      "Distributing warm clothes, blankets, and essential supplies to communities in the high-altitude villages of the Gandaki region ahead of the harsh Himalayan winter.",
    impact: "1,800+ families reached",
    date: "Annual — November",
    location: "Gandaki Region",
    image: "winter-warmth",
    featured: true,
  },
  {
    title: "Health Awareness Camp",
    category: "Health",
    description:
      "Free health check-ups, dental screening, and awareness sessions on hygiene, nutrition, and preventive care conducted in collaboration with regional health institutions.",
    impact: "2,400+ patients screened",
    date: "Quarterly",
    location: "Various Wards, Pokhara",
    image: "health-camp",
    featured: false,
  },
  {
    title: "Tree Plantation Initiative",
    category: "Environment",
    description:
      "Planting native saplings across degraded hill slopes and urban streets as part of a long-term reforestation and urban-greening commitment.",
    impact: "5,000+ trees planted",
    date: "Annual — Monsoon",
    location: "Pokhara-Lekhnath",
    image: "tree-plantation",
    featured: false,
  },
];

/** Events */
export const upcomingEvents = [
  {
    title: "Annual Charter Night",
    date: "2026-08-08T18:00:00+05:45",
    endDate: "2026-08-08T22:00:00+05:45",
    location: "Hotel Pokhara Grande, Pokhara",
    description:
      "Celebrating 47 years of Leo service in Pokhara with an evening of fellowship, recognition, and reflection on the year gone by.",
    category: "Celebration",
    registrationUrl: "#membership",
  },
  {
    title: "Monsoon Tree Plantation Drive",
    date: "2026-07-28T07:00:00+05:45",
    endDate: "2026-07-28T11:00:00+05:45",
    location: "Sarangkot Hill, Pokhara",
    description:
      "Join fellow Leos and community volunteers in planting 500 native saplings on the slopes of Sarangkot. Breakfast and tools provided.",
    category: "Environment",
    registrationUrl: "#membership",
  },
  {
    title: "Quarterly Blood Donation Camp",
    date: "2026-09-15T09:00:00+05:45",
    endDate: "2026-09-15T15:00:00+05:45",
    location: "Manipal Teaching Hospital, Pokhara",
    description:
      "Our quarterly blood donation drive in partnership with Manipal Hospital and the Nepal Red Cross Society. Open to all eligible donors.",
    category: "Health",
    registrationUrl: "#membership",
  },
];

export const pastEvents = [
  {
    title: "Leo Leadership Conclave 2025",
    date: "2025-11-22",
    location: "Pokhara, Nepal",
    description:
      "A two-day leadership development conclave bringing together Leos from across District 325 B2 for workshops, networking, and strategic planning.",
    category: "Leadership",
  },
  {
    title: "Festival of Lights — Diwali Celebration",
    date: "2025-11-01",
    location: "Pokhara, Nepal",
    description:
      "An evening of cultural celebration and community fellowship marking the festival of lights with members, families, and alumni.",
    category: "Cultural",
  },
  {
    title: "School Renovation Project",
    date: "2025-09-10",
    location: "Lamachaur, Kaski",
    description:
      "A week-long renovation drive repainting classrooms, repairing furniture, and upgrading sanitation facilities at a local government school.",
    category: "Education",
  },
  {
    title: "Earthquake Preparedness Workshop",
    date: "2025-08-15",
    location: "Pokhara, Nepal",
    description:
      "An awareness workshop equipping community members with practical knowledge on earthquake preparedness and emergency response.",
    category: "Awareness",
  },
];

/** Gallery */
export const galleryCategories = [
  "All",
  "Service",
  "Events",
  "Fellowship",
  "Awards",
  "Cultural",
] as const;

export const galleryImages = [
  { id: 1, category: "Service", title: "Blood Donation Camp", height: "tall", seed: "blood-donation-camp" },
  { id: 2, category: "Events", title: "Charter Night 2024", height: "short", seed: "charter-night" },
  { id: 3, category: "Fellowship", title: "Member Retreat", height: "medium", seed: "member-retreat" },
  { id: 4, category: "Service", title: "Phewa Lake Clean-Up", height: "medium", seed: "phewa-cleanup" },
  { id: 5, category: "Awards", title: "Best Leo Club Award", height: "tall", seed: "best-leo-award" },
  { id: 6, category: "Cultural", title: "Dashain Celebration", height: "short", seed: "dashain-celebration" },
  { id: 7, category: "Service", title: "Winter Warmth Distribution", height: "medium", seed: "winter-distribution" },
  { id: 8, category: "Events", title: "Installation Ceremony", height: "tall", seed: "installation-ceremony" },
  { id: 9, category: "Service", title: "School Supplies Drive", height: "short", seed: "school-supplies-drive" },
  { id: 10, category: "Fellowship", title: "Annual Picnic", height: "medium", seed: "annual-picnic" },
  { id: 11, category: "Awards", title: "District Recognition", height: "short", seed: "district-recognition" },
  { id: 12, category: "Service", title: "Tree Plantation Drive", height: "tall", seed: "tree-plantation" },
];

/** Testimonials */
export const testimonials = [
  {
    quote:
      "The Leo Club of Pokhara gave me my first platform to lead. The friendships, the discipline, and the spirit of service I learned here have shaped every chapter of my life since.",
    author: "Leo Alumnus",
    role: "Charter Member, Class of 1979",
  },
  {
    quote:
      "I have watched this club grow from a small group of idealistic young people into one of the most respected service organizations in the Pokhara Valley. Their consistency is remarkable.",
    author: "Community Partner",
    role: "Principal, Government School, Kaski",
  },
  {
    quote:
      "What sets Leo Pokhara apart is the seriousness with which they treat their commitments. When they promise a project, it gets done — and it gets done well.",
    author: "Lions Club Liaison",
    role: "Lions Club of Pokhara",
  },
  {
    quote:
      "Joining Leo Pokhara was the most formative decision of my twenties. I came in looking for friends; I left with a sense of purpose that has carried me through every stage of life.",
    author: "Past President",
    role: "Leoistic Year 2018–2019",
  },
];

/** Sponsors & partners */
export const sponsors = [
  "Lions Club of Pokhara",
  "Lions International District 325 B2",
  "Pokhara Metropolitan City",
  "Nepal Red Cross Society — Kaski",
  "Manipal Teaching Hospital",
  "Hotel Pokhara Grande",
  "Annapurna Post",
  "Pokhara Chamber of Commerce",
];

/** Membership */
export const membershipBenefits = [
  {
    title: "Leadership Development",
    description:
      "Hands-on opportunities to lead projects, teams, and initiatives that shape the community — building skills that last a lifetime.",
    icon: "crown",
  },
  {
    title: "Meaningful Service",
    description:
      "A structured platform to give back through service initiatives in health, education, environment, and humanitarian relief.",
    icon: "heart-handshake",
  },
  {
    title: "Global Network",
    description:
      "Membership in Lions International connects you with a worldwide community of 1.4 million volunteers across 200+ countries.",
    icon: "globe",
  },
  {
    title: "Professional Growth",
    description:
      "Public speaking, event management, finance, communications — practical experience that complements any career path.",
    icon: "trending-up",
  },
  {
    title: "Lifelong Friendships",
    description:
      "A fellowship of like-minded young people who become a second family — bonded by shared purpose and shared experiences.",
    icon: "users",
  },
  {
    title: "Recognition & Awards",
    description:
      "Eligibility for district, national, and international Leo awards recognizing service excellence and leadership.",
    icon: "award",
  },
];

export const membershipEligibility = [
  "Aged between 18 and 30 years at the time of application",
  "Of good moral character and standing in the community",
  "Resident of, or regularly active in, the Pokhara Valley",
  "Willing to commit at least 4–6 hours per month to club activities",
  "Endorsed by a current Leo or Lion in good standing",
  "Available to attend the monthly general meeting and annual charter event",
];

export const membershipFaqs = [
  {
    q: "What is the age requirement to join Leo Club of Pokhara?",
    a: "Leo membership is open to young people aged 18 to 30. Members transition to Lions Clubs after the age of 30, where they continue their service journey.",
  },
  {
    q: "Do I need prior volunteer experience to apply?",
    a: "No prior experience is required. We look for sincerity, willingness to learn, and a genuine desire to serve. Many of our most impactful members joined with no prior volunteering background.",
  },
  {
    q: "What is the time commitment expected of members?",
    a: "Members are expected to attend the monthly general meeting and participate in at least one service initiative per month — roughly 4 to 6 hours of commitment monthly.",
  },
  {
    q: "Is there a membership fee?",
    a: "Yes, there is a modest annual membership dues structure set by the club in accordance with Lions International guidelines. The exact amount for the current Leoistic year is shared during the orientation session.",
  },
  {
    q: "What happens after I submit the application form?",
    a: "Our Membership Director will reach out within 7 working days to schedule an orientation session, after which your application is reviewed by the Executive Board.",
  },
  {
    q: "Can I volunteer with the club without becoming a member?",
    a: "Absolutely. We welcome volunteers for individual projects and events. Reach out via the Contact section to express your interest.",
  },
];

/** Timeline / History */
export const historyTimeline = [
  {
    year: "1979",
    title: "The Charter",
    description:
      "The Leo Club of Pokhara is officially chartered on August 8, 1979 under the sponsorship of the Lions Club of Pokhara — one of the earliest Leo clubs in the Pokhara Valley.",
  },
  {
    year: "1985",
    title: "First Major Service Initiative",
    description:
      "The club launches its first signature community initiative — a sustained rural education support program reaching government schools across the Pokhara Valley.",
  },
  {
    year: "1995",
    title: "District Recognition",
    description:
      "Recognized at the district level for sustained excellence in community service — the first of many district-level honors to follow over the coming decades.",
  },
  {
    year: "2005",
    title: "Blood Donation Program Launched",
    description:
      "Establishment of what would become one of the most consistent quarterly blood donation programs in the Pokhara Valley, in partnership with regional hospitals.",
  },
  {
    year: "2015",
    title: "Earthquake Relief Mobilization",
    description:
      "Following the devastating 2015 earthquake, the club mobilizes round-the-clock relief operations — distributing emergency supplies across affected villages in the Gandaki region.",
  },
  {
    year: "2024",
    title: "Digital Transformation",
    description:
      "Launch of the club's digital presence and modernization of internal operations to better serve a new generation of members and partners.",
  },
];

/** Footer quick links */
export const footerLinks = {
  club: [
    { label: "About Us", href: "#about" },
    { label: "Our History", href: "#about" },
    { label: "Mission & Vision", href: "#about" },
    { label: "Executive Board", href: "#board" },
  ],
  engage: [
    { label: "Projects", href: "#projects" },
    { label: "Events", href: "#events" },
    { label: "Gallery", href: "#gallery" },
    { label: "Membership", href: "#membership" },
  ],
  connect: [
    { label: "Contact Us", href: "#contact" },
    { label: "Newsletter", href: "#newsletter" },
    { label: "Become a Sponsor", href: "#contact" },
    { label: "Volunteer", href: "#membership" },
  ],
};
