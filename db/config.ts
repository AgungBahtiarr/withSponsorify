import { column, defineDb, defineTable, NOW } from "astro:db";

const Users = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    roleId: column.text({ references: () => Roles.columns.id }),
    name: column.text(),
    email: column.text({ unique: true }),
    password: column.text(),
    isVerified: column.boolean({ default: false }),
    verificationToken: column.text({ optional: true }),
    resetPasswordToken: column.text({ optional: true }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
    deletedAt: column.date({ optional: true }),
  },
});

const Roles = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    role: column.text(),
  },
});

const Events = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    description: column.text(),
    email: column.text(),
    location: column.text(),
    proposal: column.text(),
    budget: column.number(),
    image: column.text(),
    status: column.text({ default: "active" }), // active/inactive/completed
    startDate: column.date(),
    endDate: column.date(),
    categoryId: column.text({ references: () => Categories.columns.id }),
    userId: column.text({ references: () => Users.columns.id }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
    deletedAt: column.date({ optional: true }),
  },
});

const Sponsors = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    description: column.text(),
    address: column.text(),
    website: column.text(),
    logo: column.text(),
    contactPerson: column.text(),
    phone: column.text(),
    maxSubmissionDate: column.number(),
    image: column.text(),
    status: column.text({ default: "active" }), // active/inactive
    userId: column.text({ references: () => Users.columns.id }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
    deletedAt: column.date({ optional: true }),
  },
});

const Categories = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    category: column.text(),
  },
});

const SponsorCategories = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    sponsorId: column.text({ references: () => Sponsors.columns.id }),
    categoryId: column.text({ references: () => Categories.columns.id }),
  },
});

const Transactions = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    eventId: column.text({ references: () => Events.columns.id }),
    sponsorId: column.text({ references: () => Sponsors.columns.id }),
    userId: column.text({ references: () => Users.columns.id }),
    totalFund: column.number(),
    fundingType: column.text(), // full/partial
    comment: column.text(),
    accountNumber: column.text(),
    bankName: column.text(),
    accountName: column.text(),
    proofOfPayment: column.text(),
    expiredAt: column.date(),
    transactionStatusId: column.text({
      references: () => TransactionsStatuses.columns.id,
    }),
    paymentStatusId: column.text({
      references: () => PaymentStatuses.columns.id,
    }),
    withdrawStatusId: column.text({
      references: () => WithdrawStatuses.columns.id,
    }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
    deletedAt: column.date({ optional: true }),
  },
});

const TransactionsStatuses = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    status: column.text(),
  },
});

const PaymentStatuses = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    status: column.text(),
  },
});

const WithdrawStatuses = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    status: column.text(),
  },
});

const Reports = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    report: column.text(),
    transactionId: column.text({ references: () => Transactions.columns.id }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
});

const Reviews = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    transactionId: column.text({ references: () => Transactions.columns.id }),
    rating: column.number(),
    review: column.text(),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
});

const Notifications = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ references: () => Users.columns.id }),
    title: column.text(),
    message: column.text(),
    isRead: column.boolean({ default: false }),
    createdAt: column.date({ default: NOW }),
  },
});

export default defineDb({
  tables: {
    Users,
    Roles,
    Events,
    Sponsors,
    Categories,
    SponsorCategories,
    Transactions,
    TransactionsStatuses,
    WithdrawStatuses,
    PaymentStatuses,
    Reports,
    Reviews,
    Notifications,
  },
});
