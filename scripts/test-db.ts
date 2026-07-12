import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  const count = await db.member.count();
  console.log("Members in DB:", count);
  const board = await db.boardMember.count();
  console.log("Board members:", board);
  const projects = await db.project.count();
  console.log("Projects:", projects);
  const settings = await db.siteSetting.count();
  console.log("Settings:", settings);
}
main().catch(console.error).finally(() => db.$disconnect());
