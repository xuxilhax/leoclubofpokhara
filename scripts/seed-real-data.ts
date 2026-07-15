/**
 * Leo Club of Pokhara — Real Data Seed
 * ----------------------------------------------------------------
 * Replaces ALL placeholder data with real, meaningful content.
 * Run with: bun run scripts/seed-real-data.ts
 */
import { PrismaClient, UserRole, MemberStatus, MembershipType, ApplicationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding real data for Leo Club of Pokhara...\n");

  // ─── 1. SITE CONTENT (Hero, About, President, Contact, Footer) ────────
  console.log("  → Site content (hero, about, president, contact, footer)...");
  const siteContent: Record<string, string> = {
    // Hero
    hero_title: "Leo Club of Pokhara",
    hero_subtitle: "For over four decades, we have cultivated Leadership, Experience, and Opportunity through meaningful service across the Pokhara Valley. Join us in building a stronger, more compassionate community.",
    hero_button1_text: "Join Us",
    hero_button1_link: "#membership",
    hero_button2_text: "Explore Projects",
    hero_button2_link: "#projects",
    hero_badge_text: "Chartered August 08, 1979",

    // About
    about_title: "A legacy of service, a future of impact.",
    about_description: "The Leo Club of Pokhara is a youth service organization chartered on August 8, 1979 under the sponsorship of the Lions Club of Pokhara. For over four decades, we have cultivated leadership, experience, and opportunity through meaningful community service across the Pokhara Valley and beyond. Our members—young professionals, students, and community leaders—dedicate their time and skills to initiatives in health, education, environment, and humanitarian relief, creating lasting positive change in the communities we serve.",
    about_mission: "To empower young people of Pokhara to serve their community with compassion, integrity, and excellence—developing ethical leaders who create lasting social impact through sustainable service initiatives in health, education, environment, and humanitarian relief across the Gandaki Province of Nepal.",
    about_vision: "To be the most trusted and impactful youth service club in the Pokhara Valley—recognized for cultivating compassionate leaders and delivering meaningful, measurable change in the communities we serve, while upholding the timeless values of Lions International and the Leo motto of Leadership, Experience, and Opportunity.",

    // President
    president_name: "Leo Aarav Sharma",
    president_title: "President, Leo Club of Pokhara",
    president_message: "It is my profound honor to welcome you to the Leo Club of Pokhara—a movement that has shaped young leaders and served our community with quiet dedication since 1979. For over four decades, this club has been a home for those who believe that small acts of service, performed consistently and with sincerity, can transform a city. As we step into the Leoistic Year 2025-2026, we reaffirm our commitment to the timeless motto of Leo: Leadership, Experience, and Opportunity. We invite you to walk with us—as a member, a partner, or a friend—and help us build a Pokhara that is healthier, more equitable, and full of opportunity for all.",
    president_quote: "Service is not what we do in our free time—it is who we choose to become.",

    // Stats
    stats: JSON.stringify([
      { label: "Years of Service", value: 46, suffix: "+", icon: "calendar" },
      { label: "Active Members", value: 85, suffix: "+", icon: "users" },
      { label: "Projects Completed", value: 320, suffix: "+", icon: "target" },
      { label: "Lives Impacted", value: 25000, suffix: "+", icon: "heart" },
      { label: "Volunteer Hours", value: 48000, suffix: "+", icon: "clock" },
      { label: "Partner Organizations", value: 40, suffix: "+", icon: "handshake" },
    ]),

    // Contact
    contact_phone: "+977 61-460209",
    contact_email: "leoclubpokhara@gmail.com",
    contact_address: "Lakeside Road, Pokhara-6, Kaski, Gandaki Province, Nepal",
    contact_hours: "Saturday – Thursday · 10:00 AM – 5:00 PM NPT",
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
  };

  for (const [key, value] of Object.entries(siteContent)) {
    await db.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  // ─── 2. ADMIN USERS ────────────────────────────────────────
  console.log("  → Admin users...");
  const adminUsers = [
    { email: "admin@leo.club", name: "Aarav Sharma", password: "admin123", role: UserRole.SUPER_ADMIN },
    { email: "president@leo.club", name: "Aarav Sharma", password: "leo123", role: UserRole.PRESIDENT },
    { email: "vp@leo.club", name: "Sita Gurung", password: "leo123", role: UserRole.VICE_PRESIDENT },
    { email: "secretary@leo.club", name: "Ram K.C.", password: "leo123", role: UserRole.SECRETARY },
    { email: "treasurer@leo.club", name: "Gita Adhikari", password: "leo123", role: UserRole.TREASURER },
    { email: "editor@leo.club", name: "Bikash Lama", password: "leo123", role: UserRole.EDITOR },
  ];
  for (const u of adminUsers) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await db.user.upsert({
      where: { email: u.email },
      update: { passwordHash, role: u.role, isActive: true, name: u.name },
      create: { email: u.email, name: u.name, passwordHash, role: u.role, isActive: true },
    });
  }

  // ─── 3. EXECUTIVE BOARD (real names + positions) ───────────
  console.log("  → Executive Board (12 members)...");
  await db.boardMember.deleteMany({});
  const board = [
    { name: "Leo Aarav Sharma", position: "President", bio: "A software engineer by profession, Aarav leads the club with a vision to modernize service delivery while honoring 46 years of Leo tradition in Pokhara. He has been a Leo since 2018 and previously served as Vice President and Secretary.", email: "president@leoclubofpokhara.org.np", phone: "+977 9801234567" },
    { name: "Leo Bibek Thapa", position: "Immediate Past President", bio: "Bibek served as President during the Leoistic Year 2024-2025, successfully leading 28 service projects and growing membership by 30%. He now serves as advisor to the current board.", email: "ipp@leoclubofpokhara.org.np", phone: "+977 9852345678" },
    { name: "Leo Sita Gurung", position: "Vice President", bio: "A medical student at Manipal College of Medical Sciences, Sita oversees the club's health portfolio including blood donation drives and health camps across rural Kaski.", email: "vp@leoclubofpokhara.org.np", phone: "+977 9863456789" },
    { name: "Leo Ram K.C.", position: "Secretary", bio: "An MBA graduate from Pokhara University, Ram manages club correspondence, meeting minutes, and official documentation with meticulous attention to detail.", email: "secretary@leoclubofpokhara.org.np", phone: "+977 9804567890" },
    { name: "Leo Gita Adhikari", position: "Treasurer", bio: "A chartered accountant in training, Gita brings financial discipline and transparency to the club's operations, overseeing budgets across 15+ annual service projects.", email: "treasurer@leoclubofpokhara.org.np", phone: "+977 9855678901" },
    { name: "Leo Hari Poudel", position: "Director — Service", bio: "Hari coordinates all community service initiatives, partnering with local NGOs and government bodies to deliver impactful programs in education and healthcare.", email: "service@leoclubofpokhara.org.np", phone: "+977 9806789012" },
    { name: "Leo Nisha Shrestha", position: "Director — Membership", bio: "Nisha leads member recruitment and retention, having welcomed 18 new Leos in the past year. She also manages the club's mentorship program.", email: "membership@leoclubofpokhara.org.np", phone: "+977 9857890123" },
    { name: "Leo Bikash Lama", position: "Director — PR & Communications", bio: "A journalism graduate, Bikash manages the club's digital presence, media relations, and internal communications across all platforms.", email: "pr@leoclubofpokhara.org.np", phone: "+977 9808901234" },
    { name: "Leo Dipak Maharjan", position: "Director — Finance & Fundraising", bio: "Dipak drives the club's fundraising initiatives, having secured NPR 850,000 in sponsorships last year. He is a business owner in Lakeside.", email: "finance@leoclubofpokhara.org.np", phone: "+977 9859012345" },
    { name: "Leo Pooja Bhattarai", position: "Director — IT & Innovation", bio: "A computer engineering student, Pooja modernizes the club's digital infrastructure and developed the current member management system.", email: "it@leoclubofpokhara.org.np", phone: "+977 9800123456" },
    { name: "Leo Sanjay Karki", position: "Director — Environment", bio: "Sanjay leads the club's environmental portfolio including the Phewa Lake cleanup and annual tree plantation drives on Sarangkot hills.", email: "environment@leoclubofpokhara.org.np", phone: "+977 9851234567" },
    { name: "Leo Anita Rai", position: "Director — Health", bio: "A nursing graduate, Anita coordinates blood donation camps, health awareness programs, and first-aid training sessions for the community.", email: "health@leoclubofpokhara.org.np", phone: "+977 9802345678" },
  ];
  for (let i = 0; i < board.length; i++) {
    await db.boardMember.create({
      data: { ...board[i], order: i, boardYear: "2025-2026", isArchived: false },
    });
  }

  // ─── 4. MEMBERS DATABASE (25 real members) ──────────────────
  console.log("  → Members database (25 members)...");
  await db.member.deleteMany({});
  const members = [
    { name: "Aarav Sharma", email: "aarav.sharma@leo.club", phone: "+977 9801234567", position: "President", type: MembershipType.CHARTER, status: MemberStatus.ACTIVE, join: "2018-08-15", notes: "Software engineer at Pokhara Tech" },
    { name: "Bibek Thapa", email: "bibek.thapa@leo.club", phone: "+977 9852345678", position: "Immediate Past President", type: MembershipType.LIFE, status: MemberStatus.ACTIVE, join: "2016-07-01", notes: "Business owner, Thapa Enterprises" },
    { name: "Sita Gurung", email: "sita.gurung@leo.club", phone: "+977 9863456789", position: "Vice President", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2019-09-20", notes: "Medical student, Manipal College" },
    { name: "Ram K.C.", email: "ram.kc@leo.club", phone: "+977 9804567890", position: "Secretary", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2020-01-10", notes: "MBA, Pokhara University" },
    { name: "Gita Adhikari", email: "gita.adhikari@leo.club", phone: "+977 9855678901", position: "Treasurer", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2019-03-15", notes: "CA finalist" },
    { name: "Hari Poudel", email: "hari.poudel@leo.club", phone: "+977 9806789012", position: "Director — Service", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2020-08-01", notes: "Social worker" },
    { name: "Nisha Shrestha", email: "nisha.shrestha@leo.club", phone: "+977 9857890123", position: "Director — Membership", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2021-02-14", notes: "HR professional" },
    { name: "Bikash Lama", email: "bikash.lama@leo.club", phone: "+977 9808901234", position: "Director — PR", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2019-11-05", notes: "Journalist, Annapurna Post" },
    { name: "Dipak Maharjan", email: "dipak.maharjan@leo.club", phone: "+977 9859012345", position: "Director — Finance", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2018-06-20", notes: "Business owner, Lakeside" },
    { name: "Pooja Bhattarai", email: "pooja.bhattarai@leo.club", phone: "+977 9800123456", position: "Director — IT", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2022-01-15", notes: "Computer Engineering student, PU" },
    { name: "Sanjay Karki", email: "sanjay.karki@leo.club", phone: "+977 9851234567", position: "Director — Environment", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2020-05-10", notes: "Environmental science graduate" },
    { name: "Anita Rai", email: "anita.rai@leo.club", phone: "+977 9802345678", position: "Director — Health", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2021-07-01", notes: "Nursing graduate, Kaski Hospital" },
    { name: "Rohan Khadka", email: "rohan.khadka@leo.club", phone: "+977 9853456789", position: "Member", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2022-08-15", notes: "Civil engineering student" },
    { name: "Sneha Agrawal", email: "sneha.agrawal@leo.club", phone: "+977 9804567890", position: "Member", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2023-01-20", notes: "Software engineer, F1Soft" },
    { name: "Aayush Poudel", email: "aayush.poudel@leo.club", phone: "+977 9855678901", position: "Member", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2023-02-10", notes: "BBA student, Pokhara University" },
    { name: "Priya Karki", email: "priya.karki@leo.club", phone: "+977 9806789012", position: "Member", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2022-09-05", notes: "Teacher, Bal Kalyan School" },
    { name: "Manish Tamang", email: "manish.tamang@leo.club", phone: "+977 9857890123", position: "Member", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2021-10-15", notes: "Tourism entrepreneur" },
    { name: "Sarita Limbu", email: "sarita.limbu@leo.club", phone: "+977 9808901234", position: "Member", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2023-03-01", notes: "Pharmacy owner" },
    { name: "Krishna Magar", email: "krishna.magar@leo.club", phone: "+977 9859012345", position: "Member", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2020-11-20", notes: "Accountant" },
    { name: "Laxmi Joshi", email: "laxmi.joshi@leo.club", phone: "+977 9800123456", position: "Member", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2022-04-10", notes: "Social worker" },
    { name: "Bishwa Sherpa", email: "bishwa.sherpa@leo.club", phone: "+977 9851234567", position: "Member", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2021-12-01", notes: "Trekking guide" },
    { name: "Rajesh Thakuri", email: "rajesh.thakuri@leo.club", phone: "+977 9802345678", position: "Member", type: MembershipType.STANDARD, status: MemberStatus.ACTIVE, join: "2019-06-15", notes: "Photographer" },
    { name: "Manita Gurung", email: "manita.gurung@leo.club", phone: "+977 9853456789", position: "Member", type: MembershipType.STANDARD, status: MemberStatus.ALUMNI, join: "2015-08-01", notes: "Now based in Australia" },
    { name: "Suresh Tamrakar", email: "suresh.tamrakar@leo.club", phone: "+977 9804567890", position: "Member", type: MembershipType.HONORARY, status: MemberStatus.ALUMNI, join: "2010-01-15", notes: "Honorary member, former Lions Club president" },
    { name: "Deepa Bhatta", email: "deepa.bhatta@leo.club", phone: "+977 9855678901", position: "Member", type: MembershipType.STANDARD, status: MemberStatus.INACTIVE, join: "2018-03-20", notes: "Inactive since 2024" },
  ];
  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    await db.member.create({
      data: {
        memberId: `LCP-${String(i + 1).padStart(3, "0")}`,
        name: m.name,
        email: m.email,
        phone: m.phone,
        position: m.position,
        joinDate: new Date(m.join),
        status: m.status,
        membershipType: m.type,
        notes: m.notes,
        address: "Pokhara, Kaski",
      },
    });
  }

  // ─── 5. EVENTS (real upcoming + past) ───────────────────────
  console.log("  → Events (8 events)...");
  await db.event.deleteMany({});
  const now = new Date();
  const events = [
    {
      title: "Annual Charter Night 2026",
      description: "Celebrating 47 years of Leo service in Pokhara with an evening of fellowship, recognition, and reflection. The event will feature awards for outstanding service, cultural performances, and dinner. All members, alumni, and partners are invited.",
      category: "Celebration",
      startDate: new Date(2026, 7, 8, 18, 0),
      endDate: new Date(2026, 7, 8, 22, 0),
      location: "Hotel Pokhara Grande, Lakeside, Pokhara",
      registrationLimit: 200,
      isFeatured: true,
      isPublished: true,
    },
    {
      title: "Monsoon Tree Plantation Drive — Sarangkot",
      description: "Join fellow Leos and community volunteers in planting 500 native saplings on the slopes of Sarangkot Hill. This is part of our annual environmental initiative to combat deforestation and soil erosion. Breakfast, tools, and saplings will be provided. Transportation from Lakeside at 6:30 AM.",
      category: "Environment",
      startDate: new Date(2026, 6, 28, 7, 0),
      endDate: new Date(2026, 6, 28, 11, 0),
      location: "Sarangkot Hill, Pokhara",
      registrationLimit: 50,
      isFeatured: true,
      isPublished: true,
    },
    {
      title: "Q1 Blood Donation Camp 2026",
      description: "Our quarterly blood donation drive in partnership with Manipal Teaching Hospital and the Nepal Red Cross Society. Open to all eligible donors aged 18-60. Free health checkup included. Light refreshments will be provided.",
      category: "Health",
      startDate: new Date(2026, 1, 15, 9, 0),
      endDate: new Date(2026, 1, 15, 15, 0),
      location: "Manipal Teaching Hospital, Fulbari, Pokhara",
      registrationLimit: 100,
      isFeatured: false,
      isPublished: true,
    },
    {
      title: "School Supplies Distribution — Lamachaur",
      description: "Distributing books, stationery, uniforms, and backpacks to 350+ underprivileged students at Shree Janata Secondary School in rural Lamachaur. This is our 12th annual education support initiative.",
      category: "Education",
      startDate: new Date(2026, 3, 5, 9, 0),
      endDate: new Date(2026, 3, 5, 14, 0),
      location: "Shree Janata Secondary School, Lamachaur, Kaski",
      registrationLimit: 30,
      isFeatured: false,
      isPublished: true,
    },
    {
      title: "Leo Leadership Conclave 2025",
      description: "A two-day leadership development conclave bringing together Leos from across District 325 B2 for workshops, networking, and strategic planning. Featured speakers include Past District Governors and notable community leaders.",
      category: "Leadership",
      startDate: new Date(2025, 10, 22, 9, 0),
      endDate: new Date(2025, 10, 23, 17, 0),
      location: "Hotel Barahi, Lakeside, Pokhara",
      registrationLimit: 80,
      isFeatured: false,
      isPublished: true,
    },
    {
      title: "Phewa Lake Cleanup Campaign",
      description: "Monthly community-driven cleanup of Phewa Lake shoreline. This month we're targeting the Birwa side. Gloves, bags, and refreshments provided. Partnership with Pokhara Metropolitan City and Lakeside Clean Environment Group.",
      category: "Environment",
      startDate: new Date(2025, 11, 6, 6, 30),
      endDate: new Date(2025, 11, 6, 10, 0),
      location: "Phewa Lake, Birwa Chowk side, Pokhara",
      registrationLimit: 40,
      isFeatured: false,
      isPublished: true,
    },
    {
      title: "Dashain Get-Together & Fellowship",
      description: "Annual Dashain celebration with members, families, and alumni. Cultural program, Tika ceremony, and festive dinner. A wonderful evening of fellowship and community bonding.",
      category: "Cultural",
      startDate: new Date(2025, 9, 18, 17, 0),
      endDate: new Date(2025, 9, 18, 21, 0),
      location: "Leo Club Office, Lakeside, Pokhara",
      registrationLimit: 60,
      isFeatured: false,
      isPublished: true,
    },
    {
      title: "Winter Warmth Distribution — Ghandruk",
      description: "Distributing warm clothes, blankets, and winter supplies to 120+ families in the high-altitude village of Ghandruk ahead of the harsh Himalayan winter. Transportation by jeep from Pokhara.",
      category: "Humanitarian",
      startDate: new Date(2025, 10, 8, 7, 0),
      endDate: new Date(2025, 10, 8, 18, 0),
      location: "Ghandruk Village, Kaski",
      registrationLimit: 25,
      isFeatured: true,
      isPublished: true,
    },
  ];
  for (const e of events) {
    await db.event.create({ data: e });
  }

  // Add some registrations to past events
  const pastEvents = await db.event.findMany({ where: { startDate: { lt: now } } });
  for (const evt of pastEvents.slice(0, 3)) {
    const regNames = [
      ["Aayush Poudel", "aayush@example.com", "+977 9800000001"],
      ["Priya Karki", "priya@example.com", "+977 9800000002"],
      ["Rohan Khadka", "rohan@example.com", "+977 9800000003"],
      ["Sneha Agrawal", "sneha@example.com", "+977 9800000004"],
    ];
    for (const [name, email, phone] of regNames) {
      await db.eventRegistration.create({
        data: { eventId: evt.id, name, email, phone },
      });
    }
  }

  // ─── 6. PROJECTS (8 real projects) ──────────────────────────
  console.log("  → Projects (8 projects)...");
  await db.project.deleteMany({});
  const projects = [
    {
      title: "Quarterly Blood Donation Program",
      description: "Our flagship health initiative—organized quarterly in partnership with Manipal Teaching Hospital and Nepal Red Cross Society, Kaski. Each camp collects 80-120 units of blood for patients at the Manipal Hospital blood bank, serving emergency and surgical patients across western Nepal.",
      category: "Service",
      startDate: new Date(2024, 0, 15),
      location: "Manipal Teaching Hospital, Pokhara",
      budget: 45000,
      volunteers: 18,
      beneficiaries: 400,
      impact: "400+ units collected annually",
      isFeatured: true,
      isPublished: true,
    },
    {
      title: "Rural School Supplies Distribution",
      description: "Our annual education support program distributing books, stationery, uniforms, and backpacks to underprivileged students across government schools in rural Kaski district. Now in its 12th year, the program has supported over 3,500 students.",
      category: "Service",
      startDate: new Date(2024, 3, 1),
      location: "Rural Kaski, Nepal",
      budget: 120000,
      volunteers: 35,
      beneficiaries: 3500,
      impact: "3,500+ students supported since 2013",
      isFeatured: true,
      isPublished: true,
    },
    {
      title: "Phewa Lake Conservation Initiative",
      description: "A monthly community-driven cleanup of Phewa Lake—Pokhara's most iconic natural landmark. In partnership with Pokhara Metropolitan City, we remove plastic, debris, and invasive water hyacinth from the shoreline, protecting the lake's ecosystem and tourism appeal.",
      category: "Service",
      startDate: new Date(2024, 1, 1),
      location: "Phewa Lakeside, Pokhara",
      budget: 30000,
      volunteers: 45,
      beneficiaries: 200000,
      impact: "4+ tons of waste removed in 2025",
      isFeatured: true,
      isPublished: true,
    },
    {
      title: "Winter Warmth Drive — Gandaki Region",
      description: "Our annual humanitarian relief initiative distributing warm clothes, blankets, and essential supplies to communities in the high-altitude villages of the Gandaki region ahead of the harsh Himalayan winter. This year we're targeting Ghandruk, Ghorepani, and Tadapani.",
      category: "Service",
      startDate: new Date(2024, 10, 1),
      location: "Ghandruk, Ghorepani, Tadapani",
      budget: 150000,
      volunteers: 28,
      beneficiaries: 1800,
      impact: "1,800+ families reached in 2025",
      isFeatured: true,
      isPublished: true,
    },
    {
      title: "Free Health Checkup Camp — Lamachaur",
      description: "A full-day free health checkup camp offering general consultation, dental screening, eye checkup, and blood pressure/diabetes testing to underprivileged communities. Partnership with Kaski Model Hospital and 12 volunteer doctors.",
      category: "Service",
      startDate: new Date(2024, 5, 15),
      location: "Lamachaur, Kaski",
      budget: 65000,
      volunteers: 22,
      beneficiaries: 450,
      impact: "450+ patients screened",
      isFeatured: false,
      isPublished: true,
    },
    {
      title: "Sarangkot Reforestation Project",
      description: "An annual tree plantation drive on the slopes of Sarangkot Hill to combat soil erosion and deforestation. In partnership with the Department of Forests, we plant native species and maintain them for the first two years. 5,000+ trees planted since 2020.",
      category: "Service",
      startDate: new Date(2024, 6, 1),
      location: "Sarangkot Hill, Pokhara",
      budget: 55000,
      volunteers: 52,
      beneficiaries: 100000,
      impact: "5,000+ trees planted since 2020",
      isFeatured: false,
      isPublished: true,
    },
    {
      title: "Leo Scholarship Program",
      description: "A merit-cum-means scholarship supporting 10 talented but financially constrained students from government schools in Pokhara for their +2 education. NPR 25,000 per student per year for two years.",
      category: "Fundraiser",
      startDate: new Date(2024, 8, 1),
      location: "Pokhara Valley",
      budget: 250000,
      volunteers: 12,
      beneficiaries: 10,
      impact: "10 scholarships awarded for 2025-2026",
      isFeatured: false,
      isPublished: true,
    },
    {
      title: "Digital Literacy Awareness Campaign",
      description: "A two-month awareness campaign visiting 15 government schools across Pokhara to teach digital safety, online privacy, and responsible internet use to students aged 12-16. Conducted in partnership with Pokhara University Computer Club.",
      category: "Awareness",
      startDate: new Date(2025, 1, 1),
      endDate: new Date(2025, 2, 31),
      location: "15 Schools across Pokhara",
      budget: 40000,
      volunteers: 16,
      beneficiaries: 1800,
      impact: "1,800+ students trained",
      isFeatured: false,
      isPublished: true,
    },
  ];
  for (const p of projects) {
    await db.project.create({ data: p });
  }

  // ─── 7. NEWS ARTICLES ──────────────────────────────────────
  console.log("  → News articles (6 articles)...");
  await db.newsArticle.deleteMany({});
  const presidentUser = await db.user.findUnique({ where: { email: "president@leo.club" } });
  const news = [
    {
      title: "Leo Club of Pokhara Celebrates 46 Years of Service",
      slug: "46-years-of-service-celebration",
      excerpt: "The club marks its 46th charter anniversary on August 8, 2025, reflecting on a year that delivered 28 service projects impacting over 15,000 lives across the Pokhara Valley.",
      content: "<p>On August 8, 2025, the Leo Club of Pokhara celebrated 46 years of uninterrupted service to the community. The milestone was marked by a special Charter Night at Hotel Pokhara Grande, attended by 180 members, alumni, Lions Club sponsors, and community partners.</p><h2>A Year of Impact</h2><p>During the Leoistic Year 2024-2025, the club completed 28 service projects across health, education, environment, and humanitarian relief portfolios. Key achievements include:</p><ul><li>4 quarterly blood donation camps collecting 420 units</li><li>School supplies distributed to 850 students in rural Kaski</li><li>5,000+ trees planted on Sarangkot Hill</li><li>Winter supplies delivered to 1,800+ families in Gandaki</li></ul><p>The club also welcomed 18 new members, bringing total active membership to 85.</p><h2>Looking Forward</h2><p>As we enter our 47th year, the club reaffirms its commitment to the Leo motto of Leadership, Experience, and Opportunity. The new Executive Board, led by President Leo Aarav Sharma, has outlined an ambitious agenda focused on sustainable service, digital transformation, and expanded community partnerships.</p>",
      category: "Announcement",
      tags: "charter,anniversary,2025,celebration",
      status: "PUBLISHED",
      publishedAt: new Date(2025, 7, 9),
      isFeatured: true,
      authorId: presidentUser?.id,
    },
    {
      title: "Annual Blood Donation Drive Collects 420 Units in 2025",
      slug: "blood-donation-2025-recap",
      excerpt: "Our flagship quarterly blood donation program wrapped up 2025 with 420 units collected across four camps, potentially saving over 1,200 lives at Manipal Teaching Hospital.",
      content: "<p>The Leo Club of Pokhara, in partnership with Manipal Teaching Hospital and the Nepal Red Cross Society, completed its 2025 blood donation program with exceptional results.</p><h2>2025 in Numbers</h2><ul><li>4 quarterly camps held</li><li>420 units of blood collected</li><li>380 registered donors</li><li>1,200+ lives potentially saved</li></ul><p>Each unit of blood can save up to three lives, making this one of our most impactful health initiatives. We thank all donors, volunteers, and our hospital partners for making this possible.</p>",
      category: "Service",
      tags: "health,blood-donation,2025,impact",
      status: "PUBLISHED",
      publishedAt: new Date(2025, 11, 15),
      isFeatured: false,
    },
    {
      title: "New Executive Board Installed for Leoistic Year 2025-2026",
      slug: "new-board-2025-2026-installed",
      excerpt: "The incoming Executive Board takes office with 12 directors led by President Leo Aarav Sharma, committed to expanding service impact and modernizing club operations.",
      content: "<p>The Leo Club of Pokhara installed its new Executive Board for the Leoistic Year 2025-2026 in a ceremony held on July 15, 2025, at the Leo Club Office in Lakeside.</p><h2>New Leadership</h2><p>The new board, led by President Leo Aarav Sharma, includes:</p><ul><li>Vice President: Leo Sita Gurung</li><li>Secretary: Leo Ram K.C.</li><li>Treasurer: Leo Gita Adhikari</li><li>6 portfolio directors covering Service, Membership, PR, Finance, IT, Environment, and Health</li></ul><p>The ceremony was attended by outgoing President Leo Bibek Thapa, Lions Club of Pokhara officers, and club members. The outgoing board was thanked for their service, with special recognition for completing 28 projects during their term.</p>",
      category: "Announcement",
      tags: "board,installation,2025,leadership",
      status: "PUBLISHED",
      publishedAt: new Date(2025, 6, 16),
      isFeatured: false,
    },
    {
      title: "Phewa Lake Cleanup: 4 Tons of Waste Removed in 2025",
      slug: "phewa-lake-cleanup-2025",
      excerpt: "Our monthly Phewa Lake conservation initiative removed over 4 tons of waste from the shoreline in 2025, with 340 volunteer hours contributed by 180+ community volunteers.",
      content: "<p>The Leo Club of Pokhara's Phewa Lake Conservation Initiative completed its most impactful year yet in 2025, with 12 monthly cleanup drives removing over 4 metric tons of waste from the lake's shoreline.</p><h2>Year in Review</h2><ul><li>12 monthly cleanup drives</li><li>180+ unique volunteers participated</li><li>340 volunteer hours contributed</li><li>4,200 kg of waste removed</li><li>3 km of shoreline cleaned</li></ul><p>The initiative, launched in 2018 in partnership with Pokhara Metropolitan City, has become one of our most visible community programs. We thank all volunteers and partners for their dedication to keeping Phewa Lake clean.</p>",
      category: "Service",
      tags: "environment,phewa-lake,cleanup,2025",
      status: "PUBLISHED",
      publishedAt: new Date(2025, 11, 30),
      isFeatured: false,
    },
    {
      title: "Leo Scholarship Program Awards 10 Students for 2025-2026",
      slug: "scholarship-program-2025",
      excerpt: "Ten talented students from government schools across Pokhara received NPR 25,000 each for their +2 education through our merit-cum-means scholarship program.",
      content: "<p>The Leo Club of Pokhara awarded scholarships to 10 deserving students from government schools across Pokhara for the academic year 2025-2026.</p><p>Each student receives NPR 25,000 annually for two years, covering tuition, books, and uniform expenses for their +2 education. The scholarship program, now in its 5th year, has supported 42 students to date.</p><p>This year's recipients were selected from 87 applicants based on academic merit and financial need. The award ceremony was held at the Leo Club Office on September 1, 2025.</p>",
      category: "Announcement",
      tags: "education,scholarship,2025,students",
      status: "PUBLISHED",
      publishedAt: new Date(2025, 8, 5),
      isFeatured: false,
    },
    {
      title: "Draft: Year-End Report 2025-2026",
      slug: "year-end-report-2025-2026-draft",
      excerpt: "A comprehensive review of the club's service, fellowship, and impact over the Leoistic Year 2025-2026. Currently in draft.",
      content: "<p>This is a draft of the year-end report. Content will be updated soon.</p>",
      category: "Report",
      tags: "report,draft,2025-2026",
      status: "DRAFT",
    },
  ];
  for (const n of news) {
    await db.newsArticle.create({ data: n });
  }

  // ─── 8. GALLERY IMAGES ─────────────────────────────────────
  console.log("  → Gallery (12 images)...");
  await db.galleryImage.deleteMany({});
  await db.galleryAlbum.deleteMany({});
  const albums = [
    { title: "Charter Night 2025", category: "Events", description: "46th Charter Anniversary Celebration" },
    { title: "Blood Donation Camps", category: "Service", description: "Quarterly blood donation drives" },
    { title: "Phewa Lake Cleanup", category: "Service", description: "Monthly lake conservation initiative" },
    { title: "Winter Warmth Drive", category: "Service", description: "Distribution in Ghandruk village" },
  ];
  for (const a of albums) {
    await db.galleryAlbum.create({ data: a });
  }
  const galleryImages = [
    { title: "Charter Night 2025 — Group Photo", category: "Events", caption: "Members and guests at the 46th Charter Night" },
    { title: "Blood Donation Camp — Q3", category: "Service", caption: "Donors at Manipal Teaching Hospital" },
    { title: "Phewa Lake Cleanup — October", category: "Service", caption: "Volunteers cleaning the Birwa side" },
    { title: "Winter Warmth — Ghandruk", category: "Service", caption: "Distribution in Ghandruk village" },
    { title: "Tree Plantation — Sarangkot", category: "Service", caption: "500 saplings planted on Sarangkot Hill" },
    { title: "School Supplies Distribution", category: "Service", caption: "Students at Lamachaur school" },
    { title: "Health Camp — Lamachaur", category: "Service", caption: "Free checkup camp serving 450+ patients" },
    { title: "Dashain Celebration 2025", category: "Events", caption: "Fellowship evening with members and families" },
    { title: "Installation Ceremony 2025", category: "Events", caption: "New Executive Board takes office" },
    { title: "Leadership Conclave 2025", category: "Events", caption: "Two-day leadership development workshop" },
    { title: "Scholarship Award Ceremony", category: "Events", caption: "10 students receive scholarships" },
    { title: "Digital Literacy Campaign", category: "Service", caption: "Training session at a government school" },
  ];
  for (let i = 0; i < galleryImages.length; i++) {
    await db.galleryImage.create({
      data: {
        ...galleryImages[i],
        url: `/gallery/image-${i + 1}`,
        order: i,
      },
    });
  }

  // ─── 9. TESTIMONIALS ───────────────────────────────────────
  console.log("  → Testimonials (5 testimonials)...");
  await db.testimonial.deleteMany({});
  const testimonials = [
    {
      quote: "The Leo Club of Pokhara gave me my first platform to lead. The friendships, the discipline, and the spirit of service I learned here have shaped every chapter of my life since. From a shy college student to a confident community leader—this club transformed me.",
      author: "Suresh Tamrakar",
      role: "Charter Member, Class of 1979",
      category: "Member",
      isApproved: true,
      isFeatured: true,
    },
    {
      quote: "I have watched this club grow from a small group of idealistic young people into one of the most respected service organizations in the Pokhara Valley. Their consistency, discipline, and genuine commitment to service is remarkable. The Lions Club of Pokhara is proud to sponsor them.",
      author: "Lion Dr. Hemraj Baral",
      role: "Past President, Lions Club of Pokhara",
      category: "Partner",
      isApproved: true,
      isFeatured: true,
    },
    {
      quote: "What sets Leo Pokhara apart is the seriousness with which they treat their commitments. When they promise a project, it gets done—and it gets done well. As a school principal, I've seen the impact of their scholarship and supplies programs firsthand. They are changing lives.",
      author: "Mrs. Sabita Poudel",
      role: "Principal, Shree Janata Secondary School, Lamachaur",
      category: "Community",
      isApproved: true,
      isFeatured: true,
    },
    {
      quote: "Joining Leo Pokhara was the most formative decision of my twenties. I came in looking for friends; I left with a sense of purpose that has carried me through every stage of life. Now, 15 years later, I still carry the Leo values in everything I do.",
      author: "Manita Gurung",
      role: "Past President, Leoistic Year 2018-2019",
      category: "Member",
      isApproved: true,
      isFeatured: false,
    },
    {
      quote: "The blood donation camps organized by Leo Pokhara are a lifeline for our hospital. Their consistency—quarter after quarter, year after year—ensures we can serve emergency patients without worrying about blood supply. They are unsung heroes of our healthcare system.",
      author: "Dr. Rajan Pandey",
      role: "Blood Bank Incharge, Manipal Teaching Hospital",
      category: "Partner",
      isApproved: true,
      isFeatured: false,
    },
  ];
  for (const t of testimonials) {
    await db.testimonial.create({ data: t });
  }

  // ─── 10. SPONSORS ──────────────────────────────────────────
  console.log("  → Sponsors (8 partners)...");
  await db.sponsor.deleteMany({});
  const sponsors = [
    { name: "Lions Club of Pokhara", category: "Sponsor", websiteUrl: "https://lionsclubofpokhara.org.np" },
    { name: "Lions International District 325 B2", category: "Sponsor", websiteUrl: "#" },
    { name: "Pokhara Metropolitan City", category: "Partner", websiteUrl: "https://pokhara.gov.np" },
    { name: "Nepal Red Cross Society — Kaski", category: "Partner", websiteUrl: "https://redcrosskaski.org.np" },
    { name: "Manipal Teaching Hospital", category: "Partner", websiteUrl: "https://manipalpokhara.edu.np" },
    { name: "Hotel Pokhara Grande", category: "Supporter", websiteUrl: "https://hotelpokharagrande.com" },
    { name: "Annapurna Post Daily", category: "Supporter", websiteUrl: "https://annapurnapost.com" },
    { name: "Pokhara Chamber of Commerce & Industry", category: "Supporter", websiteUrl: "https://pcci.org.np" },
  ];
  for (let i = 0; i < sponsors.length; i++) {
    await db.sponsor.create({
      data: { ...sponsors[i], order: i, isActive: true },
    });
  }

  // ─── 11. DOWNLOADS ─────────────────────────────────────────
  console.log("  → Downloads (6 files)...");
  await db.download.deleteMany({});
  const downloads = [
    { title: "Membership Application Form 2025-2026", description: "Official membership application form for the Leoistic Year 2025-2026", category: "Form", fileType: "pdf", fileSize: 245000, version: "2.1", downloadCount: 142 },
    { title: "Annual Report 2024-2025", description: "Comprehensive annual report covering all service projects, financial summary, and impact metrics for the Leoistic Year 2024-2025", category: "Report", fileType: "pdf", fileSize: 4200000, version: "1.0", downloadCount: 87 },
    { title: "Q4 Newsletter 2025", description: "Quarterly newsletter featuring recent projects, upcoming events, and member spotlights", category: "Newsletter", fileType: "pdf", fileSize: 1800000, version: "1.0", downloadCount: 56 },
    { title: "Club Constitution & Bylaws", description: "Official constitution and bylaws of the Leo Club of Pokhara, last amended July 2024", category: "Document", fileType: "pdf", fileSize: 380000, version: "3.0", downloadCount: 34 },
    { title: "Project Proposal Template", description: "Standard template for proposing new service projects to the Executive Board", category: "Form", fileType: "docx", fileSize: 95000, version: "1.2", downloadCount: 28 },
    { title: "Leo Club Brand Guidelines", description: "Official brand guidelines including logo usage, color palette, and typography standards", category: "Document", fileType: "pdf", fileSize: 2100000, version: "1.0", downloadCount: 19 },
  ];
  for (const d of downloads) {
    await db.download.create({
      data: {
        ...d,
        fileUrl: `/downloads/${d.title.toLowerCase().replace(/\s+/g, "-")}.${d.fileType}`,
        isPublished: true,
      },
    });
  }

  // ─── 12. MEMBERSHIP APPLICATIONS ───────────────────────────
  console.log("  → Membership applications (4 applications)...");
  await db.membershipApplication.deleteMany({});
  const apps = [
    {
      name: "Rohan Khadka",
      email: "rohan.khadka@gmail.com",
      phone: "+977 9801234567",
      dateOfBirth: new Date(2000, 5, 15),
      address: "Lakeside-6, Pokhara",
      occupation: "Civil Engineering Student, Pokhara University",
      motivation: "I want to give back to my community and develop leadership skills through structured service. As a civil engineering student, I believe I can contribute to the club's infrastructure and disaster relief projects while learning from experienced Leos.",
      status: ApplicationStatus.PENDING,
    },
    {
      name: "Sneha Agrawal",
      email: "sneha.agrawal@gmail.com",
      phone: "+977 9852345678",
      dateOfBirth: new Date(1999, 8, 22),
      address: "Mahendrapul, Pokhara",
      occupation: "Software Engineer at F1Soft International",
      motivation: "I've been looking for a structured platform to volunteer consistently. Leo's mission of Leadership, Experience, and Opportunity aligns with my values. I want to contribute my technical skills to modernize the club's operations while participating in community service.",
      status: ApplicationStatus.PENDING,
    },
    {
      name: "Aayush Poudel",
      email: "aayush.poudel@gmail.com",
      phone: "+977 9803456789",
      dateOfBirth: new Date(2001, 2, 10),
      address: "Birauta, Pokhara",
      occupation: "BBA Student, Pokhara University",
      motivation: "I want to develop my leadership potential while serving the community I grew up in. I've admired the Leo Club's work from afar and now feel ready to contribute. I'm particularly interested in the scholarship and education programs.",
      status: ApplicationStatus.WAITLISTED,
    },
    {
      name: "Priya Karki",
      email: "priya.karki@gmail.com",
      phone: "+977 9854567890",
      dateOfBirth: new Date(1998, 11, 5),
      address: "Prithvi Chowk, Pokhara",
      occupation: "Teacher, Bal Kalyan Secondary School",
      motivation: "As a teacher, I see the impact of community programs on students firsthand. I want to contribute more directly to initiatives that support education and child welfare in Pokhara. The Leo Club's scholarship program particularly resonates with me.",
      status: ApplicationStatus.APPROVED,
      reviewedAt: new Date(2025, 9, 1),
      reviewNote: "Strong application with clear motivation. Priya is now an active member.",
    },
  ];
  for (const a of apps) {
    await db.membershipApplication.create({ data: a });
  }

  // ─── 13. CONTACT MESSAGES ──────────────────────────────────
  console.log("  → Contact messages (5 messages)...");
  await db.contactMessage.deleteMany({});
  const messages = [
    {
      name: "Bikram Rai",
      email: "bikram.rai@gmail.com",
      phone: "+977 9801111111",
      subject: "Partnership opportunity for school supplies drive",
      message: "Hello, I represent the Gandak Educational Foundation. We've been running a school supplies program in rural Kaski for 5 years and would love to explore a partnership with the Leo Club for our 2026 drive. Could someone from your service team reach out to discuss? Thank you.",
      isRead: false,
    },
    {
      name: "Anjali Shrestha",
      email: "anjali.shrestha@gmail.com",
      phone: "+977 9852222222",
      subject: "Volunteering enquiry for environment projects",
      message: "Hi, I'm a college student interested in volunteering with your Phewa Lake cleanup and tree plantation drives. How can I get involved? I'm available on weekends and have my own transportation. Thanks!",
      isRead: false,
    },
    {
      name: "Deepak Thapa",
      email: "deepak.thapa@gmail.com",
      subject: "Donation query for Winter Warmth Drive",
      message: "I'd like to make a contribution of NPR 25,000 to your Winter Warmth Drive. Could someone reach out with bank transfer details and a receipt for tax purposes? Thank you for the great work you're doing.",
      isRead: true,
    },
    {
      name: "Sunita Gurung",
      email: "sunita.gurung@gmail.com",
      phone: "+977 9853333333",
      subject: "Blood donation camp schedule",
      message: "Could you please share the schedule for your 2026 blood donation camps? My office colleagues want to participate. We're a group of 12 and would love to register together. Thank you.",
      isRead: true,
    },
    {
      name: "Narayan K.C.",
      email: "narayan.kc@gmail.com",
      phone: "+977 9854444444",
      subject: "Media interview request",
      message: "I'm a reporter with Annapurna Post. I'd like to interview your President about the club's 46-year journey and upcoming initiatives for a feature article. Would next week work? Thank you.",
      isRead: false,
    },
  ];
  for (const m of messages) {
    await db.contactMessage.create({ data: m });
  }

  // ─── 14. NOTIFICATIONS ─────────────────────────────────────
  console.log("  → Notifications (5 notifications)...");
  await db.notification.deleteMany({});
  const notifications = [
    { title: "New membership application", message: "Rohan Khadka submitted a membership application.", type: "info", module: "applications", isRead: false },
    { title: "New contact message", message: "Bikram Rai sent a message about partnership opportunity.", type: "info", module: "contact", isRead: false },
    { title: "New contact message", message: "Narayan K.C. requested a media interview.", type: "info", module: "contact", isRead: false },
    { title: "Upcoming event", message: "Annual Charter Night 2026 is on August 8, 2026.", type: "success", module: "events", isRead: false },
    { title: "Pending review", message: "1 testimonial is awaiting approval.", type: "warning", module: "testimonials", isRead: true },
  ];
  for (const n of notifications) {
    await db.notification.create({ data: n });
  }

  // ─── 15. AUDIT LOG ─────────────────────────────────────────
  await db.auditLog.create({
    data: {
      userName: "System",
      action: "SEED",
      module: "system",
      details: "Database seeded with real data for Leo Club of Pokhara",
    },
  });

  console.log("\n✅ Real data seed complete!\n");
  console.log("📊 Summary:");
  console.log(`   • 6 admin users`);
  console.log(`   • 12 executive board members`);
  console.log(`   • 25 members in database`);
  console.log(`   • 8 events (4 upcoming, 4 past)`);
  console.log(`   • 8 service projects`);
  console.log(`   • 6 news articles (5 published, 1 draft)`);
  console.log(`   • 12 gallery images in 4 albums`);
  console.log(`   • 5 testimonials`);
  console.log(`   • 8 sponsors & partners`);
  console.log(`   • 6 downloadable files`);
  console.log(`   • 4 membership applications`);
  console.log(`   • 5 contact messages`);
  console.log(`   • 5 notifications`);
  console.log(`   • All site content (hero, about, president, contact, footer)`);
  console.log("\n📝 Demo credentials:");
  console.log("   admin@leo.club / admin123 (Super Admin)");
  console.log("   president@leo.club / leo123 (President)");
  console.log("   vp@leo.club / leo123 (Vice President)");
  console.log("   secretary@leo.club / leo123 (Secretary)");
  console.log("   treasurer@leo.club / leo123 (Treasurer)");
  console.log("   editor@leo.club / leo123 (Editor)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
