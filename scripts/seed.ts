/**
 * Leo Club CMS — Database Seed Script
 * Creates demo admin users + sample data for every module.
 * Run with: bun run /home/z/my-project/scripts/seed.ts
 */
import { PrismaClient, UserRole, MemberStatus, MembershipType, ApplicationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const DEMO_USERS = [
  {
    email: "admin@leo.club",
    name: "Super Admin",
    password: "admin123",
    role: UserRole.SUPER_ADMIN,
  },
  {
    email: "president@leo.club",
    name: "Leo President",
    password: "leo123",
    role: UserRole.PRESIDENT,
  },
  {
    email: "editor@leo.club",
    name: "Leo Editor",
    password: "leo123",
    role: UserRole.EDITOR,
  },
];

async function main() {
  console.log("🌱 Seeding Leo Club CMS database...");

  // ─── Users ──────────────────────────────────────────────
  for (const u of DEMO_USERS) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await db.user.upsert({
      where: { email: u.email },
      update: { passwordHash, role: u.role, isActive: true },
      create: {
        email: u.email,
        name: u.name,
        passwordHash,
        role: u.role,
        isActive: true,
      },
    });
    console.log(`  ✓ User: ${u.email} (${u.role}) — password: ${u.password}`);
  }

  // ─── Board Members ──────────────────────────────────────
  const positions = [
    ["President", "Leo Aarav Sharma"],
    ["Immediate Past President", "Leo Bibek Thapa"],
    ["Vice President", "Leo Sita Gurung"],
    ["Secretary", "Leo Ram K.C."],
    ["Treasurer", "Leo Gita Adhikari"],
    ["Director — Service", "Leo Hari Poudel"],
    ["Director — Membership", "Leo Sita Rana"],
    ["Director — PR & Communications", "Leo Bikash Lama"],
    ["Director — Finance", "Leo Nisha Shrestha"],
    ["Director — IT & Innovation", "Leo Dipak Maharjan"],
    ["Director — Environment", "Leo Pooja Bhattarai"],
    ["Director — Health", "Leo Sanjay Karki"],
  ];
  await db.boardMember.deleteMany({});
  for (let i = 0; i < positions.length; i++) {
    const [position, name] = positions[i];
    await db.boardMember.create({
      data: {
        name,
        position,
        bio: `Serving as ${position} for the Leoistic Year 2025–2026. Dedicated to advancing the club's mission of Leadership, Experience, and Opportunity through meaningful community service across the Pokhara Valley.`,
        email: `${name.split(" ")[1].toLowerCase()}@leo.club`,
        order: i,
        boardYear: "2025-2026",
      },
    });
  }
  console.log(`  ✓ ${positions.length} board members`);

  // ─── Members ─────────────────────────────────────────────
  const memberNames = [
    "Aarav Sharma", "Bibek Thapa", "Sita Gurung", "Ram K.C.", "Gita Adhikari",
    "Hari Poudel", "Sita Rana", "Bikash Lama", "Nisha Shrestha", "Dipak Maharjan",
    "Pooja Bhattarai", "Sanjay Karki", "Anita Rai", "Ramesh Tamang", "Sarita Limbu",
    "Krishna Magar", "Laxmi Joshi", "Bishwa Sherpa", "Rajesh Thakuri", "Manita Gurung",
  ];
  await db.member.deleteMany({});
  for (let i = 0; i < memberNames.length; i++) {
    const status = i < 14 ? MemberStatus.ACTIVE : i < 18 ? MemberStatus.ALUMNI : MemberStatus.INACTIVE;
    await db.member.create({
      data: {
        memberId: `LCP-2025-${String(i + 1).padStart(3, "0")}`,
        name: memberNames[i],
        email: `${memberNames[i].toLowerCase().replace(/\s+/g, ".")}@leo.club`,
        phone: `+977 980${String(1000000 + i).slice(0, 7)}`,
        position: i < positions.length ? positions[i][0] : "Member",
        joinDate: new Date(2024, 7, 8),
        status,
        membershipType: i < 5 ? MembershipType.CHARTER : i < 16 ? MembershipType.STANDARD : MembershipType.LIFE,
      },
    });
  }
  console.log(`  ✓ ${memberNames.length} members`);

  // ─── Events ──────────────────────────────────────────────
  await db.event.deleteMany({});
  const events = [
    {
      title: "Annual Charter Night 2026",
      description: "Celebrating 47 years of Leo service in Pokhara with an evening of fellowship, recognition, and reflection on the year gone by.",
      category: "Celebration",
      startDate: new Date(2026, 7, 8, 18, 0),
      endDate: new Date(2026, 7, 8, 22, 0),
      location: "Hotel Pokhara Grande, Pokhara",
      registrationLimit: 200,
      isFeatured: true,
    },
    {
      title: "Monsoon Tree Plantation Drive",
      description: "Join fellow Leos and community volunteers in planting 500 native saplings on the slopes of Sarangkot.",
      category: "Environment",
      startDate: new Date(2026, 6, 28, 7, 0),
      endDate: new Date(2026, 6, 28, 11, 0),
      location: "Sarangkot Hill, Pokhara",
      registrationLimit: 50,
      isFeatured: true,
    },
    {
      title: "Quarterly Blood Donation Camp",
      description: "Our quarterly blood donation drive in partnership with Manipal Hospital and the Nepal Red Cross Society.",
      category: "Health",
      startDate: new Date(2026, 8, 15, 9, 0),
      endDate: new Date(2026, 8, 15, 15, 0),
      location: "Manipal Teaching Hospital, Pokhara",
      registrationLimit: 100,
    },
    {
      title: "Leo Leadership Conclave 2025",
      description: "A two-day leadership development conclave bringing together Leos from across District 325 B2.",
      category: "Leadership",
      startDate: new Date(2025, 10, 22, 9, 0),
      endDate: new Date(2025, 10, 23, 17, 0),
      location: "Pokhara, Nepal",
      registrationLimit: 80,
    },
    {
      title: "School Renovation Project",
      description: "A week-long renovation drive repainting classrooms, repairing furniture, and upgrading sanitation facilities.",
      category: "Education",
      startDate: new Date(2025, 8, 10, 8, 0),
      endDate: new Date(2025, 8, 16, 17, 0),
      location: "Lamachaur, Kaski",
      registrationLimit: 30,
    },
  ];
  for (const e of events) {
    await db.event.create({ data: e });
  }
  console.log(`  ✓ ${events.length} events`);

  // ─── Projects ─────────────────────────────────────────────
  await db.project.deleteMany({});
  const projects = [
    {
      title: "Blood Donation Drive",
      description: "A flagship annual initiative organized in partnership with local hospitals and the Red Cross Society, collecting life-saving blood units for patients in need across the Pokhara Valley.",
      category: "Service",
      startDate: new Date(2024, 0, 15),
      location: "Pokhara, Kaski",
      budget: 25000,
      volunteers: 24,
      beneficiaries: 1200,
      impact: "1,200+ units collected",
      isFeatured: true,
    },
    {
      title: "School Supplies Distribution",
      description: "Equipping underprivileged students across government schools in rural Kaski with books, stationery, uniforms, and backpacks at the start of every academic year.",
      category: "Service",
      startDate: new Date(2024, 3, 1),
      location: "Rural Kaski, Nepal",
      budget: 85000,
      volunteers: 35,
      beneficiaries: 3500,
      impact: "3,500+ students supported",
      isFeatured: true,
    },
    {
      title: "Phewa Lake Clean-Up",
      description: "A monthly community-driven effort to remove plastic, debris, and invasive growth from the shores of Phewa Lake.",
      category: "Service",
      startDate: new Date(2024, 1, 1),
      location: "Phewa Lakeside, Pokhara",
      budget: 15000,
      volunteers: 45,
      beneficiaries: 50000,
      impact: "4 tons of waste removed",
      isFeatured: true,
    },
    {
      title: "Winter Warmth Drive",
      description: "Distributing warm clothes, blankets, and essential supplies to communities in the high-altitude villages of the Gandaki region.",
      category: "Service",
      startDate: new Date(2024, 10, 1),
      location: "Gandaki Region",
      budget: 120000,
      volunteers: 28,
      beneficiaries: 1800,
      impact: "1,800+ families reached",
      isFeatured: true,
    },
    {
      title: "Health Awareness Camp",
      description: "Free health check-ups, dental screening, and awareness sessions on hygiene, nutrition, and preventive care.",
      category: "Service",
      startDate: new Date(2024, 5, 1),
      location: "Various Wards, Pokhara",
      budget: 45000,
      volunteers: 18,
      beneficiaries: 2400,
      impact: "2,400+ patients screened",
    },
    {
      title: "Tree Plantation Initiative",
      description: "Planting native saplings across degraded hill slopes and urban streets as part of a long-term reforestation commitment.",
      category: "Service",
      startDate: new Date(2024, 6, 1),
      location: "Pokhara-Lekhnath",
      budget: 35000,
      volunteers: 52,
      beneficiaries: 100000,
      impact: "5,000+ trees planted",
    },
  ];
  for (const p of projects) {
    await db.project.create({ data: p });
  }
  console.log(`  ✓ ${projects.length} projects`);

  // ─── News Articles ──────────────────────────────────────
  await db.newsArticle.deleteMany({});
  const newsArticles = [
    {
      title: "Leo Club of Pokhara Celebrates 46 Years of Service",
      slug: "46-years-of-service",
      excerpt: "The club marks its 46th charter anniversary with a year of expanded community initiatives across the Pokhara Valley.",
      content: "On August 8, 2025, the Leo Club of Pokhara celebrated 46 years of uninterrupted service to the community. The milestone was marked by a special Charter Night attended by members, alumni, and partners from across the region.",
      category: "Announcement",
      tags: "charter,anniversary,2025",
      status: "PUBLISHED",
      publishedAt: new Date(2025, 7, 8),
      isFeatured: true,
      authorId: (await db.user.findUnique({ where: { email: "president@leo.club" } }))?.id,
    },
    {
      title: "Annual Blood Donation Drive Collects 350+ Units",
      slug: "blood-donation-2025",
      excerpt: "Our flagship quarterly blood donation drive wrapped up another successful year, with 350+ units collected across four camps.",
      content: "The Leo Club of Pokhara, in partnership with Manipal Teaching Hospital and the Nepal Red Cross Society, completed its 2025 blood donation program with over 350 units collected across four quarterly camps.",
      category: "Service",
      tags: "health,blood-donation,2025",
      status: "PUBLISHED",
      publishedAt: new Date(2025, 11, 1),
      isFeatured: false,
    },
    {
      title: "New Executive Board Installed for Leoistic Year 2025-2026",
      slug: "new-board-2025-2026",
      excerpt: "The incoming Executive Board takes office with a renewed commitment to community service and member development.",
      content: "The Leo Club of Pokhara installed its new Executive Board for the Leoistic Year 2025-2026 in a ceremony held on July 15, 2025. The new board, led by President Leo Aarav Sharma, takes office with a comprehensive agenda for the year.",
      category: "Announcement",
      tags: "board,installation,2025",
      status: "PUBLISHED",
      publishedAt: new Date(2025, 6, 16),
      isFeatured: false,
    },
    {
      title: "Draft: Year-End Report 2025",
      slug: "year-end-report-2025",
      excerpt: "A comprehensive review of the club's service, fellowship, and impact over the Leoistic Year 2025-2026.",
      content: "This is a draft of the year-end report. Content will be updated soon.",
      category: "Report",
      tags: "report,2025",
      status: "DRAFT",
    },
    {
      title: "Scheduled: Winter Warmth Drive 2026 Launch",
      slug: "winter-warmth-2026",
      excerpt: "Announcing the 2026 edition of our annual Winter Warmth Drive.",
      content: "Content will be updated soon.",
      category: "Announcement",
      tags: "winter,humanitarian,2026",
      status: "SCHEDULED",
      scheduledAt: new Date(2026, 9, 1),
    },
  ];
  for (const n of newsArticles) {
    await db.newsArticle.create({ data: n });
  }
  console.log(`  ✓ ${newsArticles.length} news articles`);

  // ─── Gallery ────────────────────────────────────────────
  await db.galleryImage.deleteMany({});
  await db.galleryAlbum.deleteMany({});
  const albums = [
    { title: "Charter Night 2025", category: "Events" },
    { title: "Blood Donation Camp", category: "Service" },
    { title: "Phewa Lake Clean-Up", category: "Service" },
    { title: "Annual Picnic 2025", category: "Fellowship" },
  ];
  for (const a of albums) {
    await db.galleryAlbum.create({ data: a });
  }
  const galleryTitles = [
    ["Blood Donation Camp", "Service"],
    ["Charter Night 2024", "Events"],
    ["Member Retreat", "Fellowship"],
    ["Phewa Lake Clean-Up", "Service"],
    ["Best Leo Club Award", "Awards"],
    ["Dashain Celebration", "Cultural"],
    ["Winter Warmth Distribution", "Service"],
    ["Installation Ceremony", "Events"],
    ["School Supplies Drive", "Service"],
    ["Annual Picnic", "Fellowship"],
    ["District Recognition", "Awards"],
    ["Tree Plantation Drive", "Service"],
  ];
  for (let i = 0; i < galleryTitles.length; i++) {
    await db.galleryImage.create({
      data: {
        title: galleryTitles[i][0],
        category: galleryTitles[i][1],
        url: `/gallery/${i + 1}`,
        order: i,
      },
    });
  }
  console.log(`  ✓ ${albums.length} albums, ${galleryTitles.length} images`);

  // ─── Testimonials ───────────────────────────────────────
  await db.testimonial.deleteMany({});
  const testimonials = [
    {
      quote: "The Leo Club of Pokhara gave me my first platform to lead. The friendships, the discipline, and the spirit of service I learned here have shaped every chapter of my life since.",
      author: "Leo Alumnus",
      role: "Charter Member, Class of 1979",
      category: "Member",
      isApproved: true,
      isFeatured: true,
    },
    {
      quote: "I have watched this club grow from a small group of idealistic young people into one of the most respected service organizations in the Pokhara Valley. Their consistency is remarkable.",
      author: "Community Partner",
      role: "Principal, Government School, Kaski",
      category: "Community",
      isApproved: true,
      isFeatured: true,
    },
    {
      quote: "What sets Leo Pokhara apart is the seriousness with which they treat their commitments. When they promise a project, it gets done — and it gets done well.",
      author: "Lions Club Liaison",
      role: "Lions Club of Pokhara",
      category: "Partner",
      isApproved: true,
      isFeatured: true,
    },
    {
      quote: "Joining Leo Pokhara was the most formative decision of my twenties. I came in looking for friends; I left with a sense of purpose that has carried me through every stage of life.",
      author: "Past President",
      role: "Leoistic Year 2018-2019",
      category: "Member",
      isApproved: false,
      isFeatured: false,
    },
  ];
  for (const t of testimonials) {
    await db.testimonial.create({ data: t });
  }
  console.log(`  ✓ ${testimonials.length} testimonials`);

  // ─── Sponsors ───────────────────────────────────────────
  await db.sponsor.deleteMany({});
  const sponsors = [
    "Lions Club of Pokhara",
    "Lions International District 325 B2",
    "Pokhara Metropolitan City",
    "Nepal Red Cross Society — Kaski",
    "Manipal Teaching Hospital",
    "Hotel Pokhara Grande",
    "Annapurna Post",
    "Pokhara Chamber of Commerce",
  ];
  for (let i = 0; i < sponsors.length; i++) {
    await db.sponsor.create({
      data: {
        name: sponsors[i],
        category: i < 2 ? "Sponsor" : i < 5 ? "Partner" : "Supporter",
        order: i,
        websiteUrl: "#",
      },
    });
  }
  console.log(`  ✓ ${sponsors.length} sponsors`);

  // ─── Downloads ──────────────────────────────────────────
  await db.download.deleteMany({});
  const downloads = [
    { title: "Membership Application Form 2025", category: "Form", fileType: "pdf", fileSize: 245000, version: "2.1" },
    { title: "Annual Report 2024-2025", category: "Report", fileType: "pdf", fileSize: 4200000, version: "1.0" },
    { title: "Q4 Newsletter 2025", category: "Newsletter", fileType: "pdf", fileSize: 1800000, version: "1.0" },
    { title: "Club Constitution", category: "Document", fileType: "pdf", fileSize: 380000, version: "3.0" },
    { title: "Project Proposal Template", category: "Form", fileType: "docx", fileSize: 95000, version: "1.2" },
  ];
  for (const d of downloads) {
    await db.download.create({
      data: {
        ...d,
        fileUrl: `/downloads/${d.title.toLowerCase().replace(/\s+/g, "-")}.${d.fileType}`,
        description: `Official ${d.title} from the Leo Club of Pokhara.`,
      },
    });
  }
  console.log(`  ✓ ${downloads.length} downloads`);

  // ─── Membership Applications ────────────────────────────
  await db.membershipApplication.deleteMany({});
  const applications = [
    {
      name: "Rohan Khadka",
      email: "rohan.khadka@gmail.com",
      phone: "+977 9801234567",
      dateOfBirth: new Date(2000, 5, 15),
      address: "Lakeside, Pokhara",
      occupation: "Student",
      motivation: "I want to give back to my community and develop leadership skills through structured service.",
      status: ApplicationStatus.PENDING,
    },
    {
      name: "Sneha Agrawal",
      email: "sneha.agrawal@gmail.com",
      phone: "+977 9852345678",
      dateOfBirth: new Date(1999, 8, 22),
      address: "Mahendrapul, Pokhara",
      occupation: "Software Engineer",
      motivation: "I've been looking for a structured platform to volunteer consistently. Leo's mission aligns with my values.",
      status: ApplicationStatus.PENDING,
    },
    {
      name: "Aayush Poudel",
      email: "aayush.poudel@gmail.com",
      phone: "+977 9803456789",
      dateOfBirth: new Date(2001, 2, 10),
      address: "Birauta, Pokhara",
      occupation: "College Student",
      motivation: "I want to develop my leadership potential while serving the community I grew up in.",
      status: ApplicationStatus.WAITLISTED,
    },
    {
      name: "Priya Karki",
      email: "priya.karki@gmail.com",
      phone: "+977 9854567890",
      dateOfBirth: new Date(1998, 11, 5),
      address: "Prithvi Chowk, Pokhara",
      occupation: "Teacher",
      motivation: "As a teacher, I see the impact of community programs on students firsthand. I want to contribute more directly.",
      status: ApplicationStatus.APPROVED,
      reviewedAt: new Date(2025, 9, 1),
      reviewNote: "Strong application. Welcomed to the club.",
    },
  ];
  for (const a of applications) {
    await db.membershipApplication.create({ data: a });
  }
  console.log(`  ✓ ${applications.length} membership applications`);

  // ─── Contact Messages ───────────────────────────────────
  await db.contactMessage.deleteMany({});
  const messages = [
    {
      name: "Bikram Rai",
      email: "bikram.rai@gmail.com",
      phone: "+977 9801111111",
      subject: "Partnership opportunity",
      message: "Hello, I represent a local NGO working on education in rural Kaski. We'd love to explore a partnership with the Leo Club for our annual school supplies drive.",
    },
    {
      name: "Anjali Shrestha",
      email: "anjali.shrestha@gmail.com",
      phone: "+977 9852222222",
      subject: "Volunteering enquiry",
      message: "I'm a college student interested in volunteering with the club's environmental initiatives. How can I get involved?",
    },
    {
      name: "Deepak Thapa",
      email: "deepak.thapa@gmail.com",
      subject: "Donation query",
      message: "I'd like to make a contribution to your Winter Warmth Drive. Could someone reach out with the details?",
    },
  ];
  for (const m of messages) {
    await db.contactMessage.create({ data: m });
  }
  console.log(`  ✓ ${messages.length} contact messages`);

  // ─── Notifications ──────────────────────────────────────
  await db.notification.deleteMany({});
  const notifications = [
    { title: "New membership application", message: "Rohan Khadka submitted a membership application.", type: "info", module: "applications", isRead: false },
    { title: "New contact message", message: "Bikram Rai sent a message about partnership.", type: "info", module: "contact", isRead: false },
    { title: "Upcoming event", message: "Annual Charter Night 2026 is in 30 days.", type: "success", module: "events", isRead: false },
    { title: "Pending review", message: "1 testimonial is awaiting approval.", type: "warning", module: "testimonials", isRead: true },
  ];
  for (const n of notifications) {
    await db.notification.create({ data: n });
  }
  console.log(`  ✓ ${notifications.length} notifications`);

  // ─── Audit Logs ─────────────────────────────────────────
  await db.auditLog.create({
    data: {
      userName: "System",
      action: "SEED",
      module: "system",
      details: "Database seeded with sample data",
    },
  });

  console.log("\n✅ Seed complete!");
  console.log("\n📝 Demo credentials:");
  DEMO_USERS.forEach((u) => {
    console.log(`   ${u.email} / ${u.password}  (${u.role})`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
