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
  SponsorCategories,
  Reviews,
  Notifications,
  SponsorLevels,
  EventSponsorLevels,
} from "astro:db";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

export default async function () {
  // Seed Roles
  await db.insert(Roles).values([
    { id: nanoid(), role: "admin" },
    { id: nanoid(), role: "event_organizer" },
    { id: nanoid(), role: "sponsor" },
  ]);

  const [adminRole, eventOrganizerRole, sponsorRole] = await db
    .select()
    .from(Roles);

  console.log("role " + eventOrganizerRole.id);

  // Seed Users
  const hashedPassword = await bcrypt.hash("password123", 10);
  const adminId = nanoid();
  const user1Id = nanoid();
  const user2Id = nanoid();
  console.log("userId " + user1Id);
  await db.insert(Users).values([
    {
      id: adminId,
      roleId: adminRole.id,
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      isVerified: true,
    },
    {
      id: user1Id,
      roleId: eventOrganizerRole.id,
      name: "Agung Bahtiar EO",
      email: "agungeo@gmail.com",
      password: hashedPassword,
      isVerified: true,
    },
    {
      id: user2Id,
      roleId: sponsorRole.id,
      name: "Agung Bahtiar Sponsor",
      email: "agungsponsor@gmail.com",
      password: hashedPassword,
      isVerified: true,
    },
  ]);

  // Seed Categories
  const techCategoryId = nanoid();
  const businessCategoryId = nanoid();
  const educationCategoryId = nanoid();

  await db.insert(Categories).values([
    { id: techCategoryId, category: "Technology" },
    { id: businessCategoryId, category: "Business" },
    { id: educationCategoryId, category: "Education" },
    { id: nanoid(), category: "Sports" },
    { id: nanoid(), category: "Entertainment" },
  ]);

  console.log("categoryId " + educationCategoryId);
  // Seed TransactionsStatuses
  const pendingTsId = nanoid();
  await db.insert(TransactionsStatuses).values([
    { id: pendingTsId, status: "pending" },
    { id: nanoid(), status: "approved" },
    { id: nanoid(), status: "rejected" },
    { id: nanoid(), status: "completed" },
  ]);

  // Seed PaymentStatuses
  const pendingPsId = nanoid();
  await db.insert(PaymentStatuses).values([
    { id: pendingPsId, status: "pending" },
    { id: nanoid(), status: "paid" },
    { id: nanoid(), status: "failed" },
  ]);

  // Seed WithdrawStatuses
  const pendingWsId = nanoid();
  await db.insert(WithdrawStatuses).values([
    { id: pendingWsId, status: "pending" },
    { id: nanoid(), status: "processed" },
    { id: nanoid(), status: "completed" },
    { id: nanoid(), status: "failed" },
  ]);

  const platinumId = nanoid();
  const goldId = nanoid();
  const silverId = nanoid();
  const bronzeId = nanoid();

  await db.insert(SponsorLevels).values([
    { id: platinumId, name: "Platinum" },
    { id: goldId, name: "Gold" },
    { id: silverId, name: "Silver" },
    { id: bronzeId, name: "Bronze" },
  ]);

  // Seed Events
  const eventId = nanoid();
  await db.insert(Events).values([
    {
      id: eventId,
      name: "Tech Conference 2024",
      description: "Annual technology conference",
      email: "tech@conference.com",
      location: "Jakarta Convention Center",
      proposal: "path/to/proposal.pdf",
      budget: 50000000,
      image: "path/to/event_banner.jpg",
      status: "active",
      startDate: new Date("2024-07-15"),
      endDate: new Date("2024-07-17"),
      categoryId: techCategoryId,
      userId: user1Id,
    },
  ]);

  const platinumEventLevelId = nanoid();
  const goldEventLevelId = nanoid();
  const silverEventLevelId = nanoid();
  const bronzeEventLevelId = nanoid();

  await db.insert(EventSponsorLevels).values([
    {
      id: platinumEventLevelId,
      eventId: eventId,
      sponsorLevelId: platinumId,
      price: 50000000,
      maxSlot: 2,
      remainingSlot: 2,
      benefits: JSON.stringify([
        "Logo placement at main stage",
        "VIP booth",
        "Speaking session",
        "Social media promotion",
        "10 event tickets",
      ]),
    },
    {
      id: goldEventLevelId,
      eventId: eventId,
      sponsorLevelId: goldId,
      price: 30000000,
      maxSlot: 4,
      remainingSlot: 4,
      benefits: JSON.stringify([
        "Logo placement at secondary stage",
        "Standard booth",
        "Social media promotion",
        "5 event tickets",
      ]),
    },
    {
      id: silverEventLevelId,
      eventId: eventId,
      sponsorLevelId: silverId,
      price: 20000000,
      maxSlot: 6,
      remainingSlot: 6,
      benefits: JSON.stringify([
        "Logo placement at venue",
        "Small booth",
        "Social media mention",
        "3 event tickets",
      ]),
    },
    {
      id: bronzeEventLevelId,
      eventId: eventId,
      sponsorLevelId: bronzeId,
      price: 10000000,
      maxSlot: 8,
      remainingSlot: 8,
      benefits: JSON.stringify([
        "Logo placement at website",
        "Social media mention",
        "2 event tickets",
      ]),
    },
  ]);

  // Seed Sponsors
  const sponsorId = nanoid();
  await db.insert(Sponsors).values([
    {
      id: sponsorId,
      name: "TechCorp",
      description: "Leading technology company",
      address: "123 Tech Street, Jakarta",
      website: "https://techcorp.com",
      logo: "path/to/techcorp_logo.png",
      contactPerson: "John Doe",
      phone: "+6281234567890",
      maxSubmissionDate: 30,
      image: "path/to/sponsor_image.png",
      status: "active",
      userId: user2Id,
    },
  ]);

  // Seed SponsorCategories
  await db.insert(SponsorCategories).values([
    {
      id: nanoid(),
      sponsorId: sponsorId,
      categoryId: techCategoryId,
    },
    {
      id: nanoid(),
      sponsorId: sponsorId,
      categoryId: businessCategoryId,
    },
  ]);

  // Seed Transactions
  const transactionId = nanoid();
  await db.insert(Transactions).values([
    {
      id: transactionId,
      eventId: eventId,
      sponsorId: sponsorId,
      userId: user2Id,
      eventSponsorLevelId: platinumEventLevelId, // Add this line
      totalFund: 50000000, // Match with platinum price
      fundingType: "full", // Changed to full since it matches the level price
      comment: "Sponsorship for Tech Conference 2024",
      accountNumber: "1234567890",
      bankName: "Bank Central",
      accountName: "John Doe",
      proofOfPayment: "path/to/payment_proof.jpg",
      expiredAt: new Date("2024-06-15"),
      transactionStatusId: pendingTsId,
      paymentStatusId: pendingPsId,
      withdrawStatusId: pendingWsId,
    },
  ]);

  // Seed Reports
  await db.insert(Reports).values([
    {
      id: nanoid(),
      report: "Initial sponsorship report for Tech Conference 2024",
      transactionId: transactionId,
    },
  ]);

  // Seed Reviews
  await db.insert(Reviews).values([
    {
      id: nanoid(),
      transactionId: transactionId,
      rating: 5,
      review: "Great collaboration with TechCorp!",
    },
  ]);

  // Seed Notifications
  await db.insert(Notifications).values([
    {
      id: nanoid(),
      userId: user1Id,
      title: "New Sponsorship Request",
      message:
        "TechCorp has submitted a sponsorship request for Tech Conference 2024",
      isRead: false,
    },
    {
      id: nanoid(),
      userId: user2Id,
      title: "Sponsorship Request Received",
      message:
        "Your sponsorship request for Tech Conference 2024 has been received",
      isRead: false,
    },
  ]);
}
