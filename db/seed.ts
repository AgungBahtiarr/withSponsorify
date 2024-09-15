import {
  db,
  Roles,
  Users,
  Categories,
  TransactionsStatuses,
  PaymentStatuses,
  WithdrawStatuses,
  Reports,
  Transactions,
  Sponsors,
  Events,
} from "astro:db";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

export default async function () {
  // Seed Roles
  await db.insert(Roles).values([
    { id: nanoid(), role: "Event Organizer" },
    { id: nanoid(), role: "Sponsor" },
  ]);

  const [eventOrganizerRole, sponsorRole] = await db.select().from(Roles);

  // Seed Users
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user1Id = nanoid();
  const user2Id = nanoid();
  await db.insert(Users).values([
    {
      id: user1Id,
      roleId: eventOrganizerRole.id,
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
    },
    {
      id: user2Id,
      roleId: sponsorRole.id,
      name: "Jane Smith",
      email: "jane@example.com",
      password: hashedPassword,
    },
  ]);

  // Seed Categories
  const techCategoryId = nanoid();
  await db.insert(Categories).values([
    { id: techCategoryId, category: "Technology" },
    { id: nanoid(), category: "Business" },
    { id: nanoid(), category: "Education" },
  ]);

  // Seed TransactionsStatuses
  const pendingTsId = nanoid();
  await db.insert(TransactionsStatuses).values([
    { id: pendingTsId, status: "pending" },
    { id: nanoid(), status: "accepted" },
    { id: nanoid(), status: "rejected" },
  ]);

  // Seed PaymentStatuses
  const pendingPsId = nanoid();
  await db.insert(PaymentStatuses).values([
    { id: pendingPsId, status: "pending" },
    { id: nanoid(), status: "accepted" },
    { id: nanoid(), status: "rejected" },
  ]);

  // Seed WithdrawStatuses
  const pendingWsId = nanoid();
  await db.insert(WithdrawStatuses).values([
    { id: pendingWsId, status: "pending" },
    { id: nanoid(), status: "accepted" },
    { id: nanoid(), status: "rejected" },
  ]);

  // Seed Events (contoh)
  const eventId = nanoid();
  await db.insert(Events).values([
    {
      id: eventId,
      name: "Tech Conference 2024",
      description: "Annual technology conference",
      email: "tech@conference.com",
      location: "Jakarta Convention Center",
      proposal: "path/to/proposal.pdf",
      startDate: new Date("2024-07-15"),
      endDate: new Date("2024-07-17"),
      userId: user1Id,
    },
  ]);

  // Seed Sponsors (contoh)
  const sponsorId = nanoid();
  await db.insert(Sponsors).values([
    {
      id: sponsorId,
      name: "TechCorp",
      description: "Leading technology company",
      address: "123 Tech Street, Jakarta",
      maxSubmissionDate: 30,
      image: "path/to/techcorp_logo.png",
      categoryId: techCategoryId,
      userId: user2Id,
    },
  ]);

  // Seed Transactions (contoh)
  const transactionId = nanoid();
  await db.insert(Transactions).values([
    {
      id: transactionId,
      eventId: eventId,
      sponsorId: sponsorId,
      userId: user2Id,
      totalFund: 5000000,
      comment: "Sponsorship for Tech Conference 2024",
      accountNumber: "1234567890",
      bankName: "Bank Central",
      accountName: "John Doe",
      transactionStatusId: pendingTsId,
      paymentStatusId: pendingPsId,
      withdrawStatusId: pendingWsId,
    },
  ]);

  // Seed Reports (contoh)
  await db.insert(Reports).values([
    {
      id: nanoid(),
      report: "Initial sponsorship report for Tech Conference 2024",
      transactionId: transactionId,
    },
  ]);
}
