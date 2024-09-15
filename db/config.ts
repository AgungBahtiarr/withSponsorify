import { column, defineDb, defineTable, NOW } from "astro:db";

const Users = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    roleId: column.text({ references: () => Roles.columns.id }),
    name: column.text(),
    email: column.text({ unique: true }),
    password: column.text(),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
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
    startDate: column.date(),
    endDate: column.date(),
    userId: column.text({ references: () => Users.columns.id }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
});

const Sponsors = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    description: column.text(),
    address: column.text(),
    maxSubmissionDate: column.number(),
    image: column.text(),
    categoryId: column.text({ references: () => Categories.columns.id }),
    userId: column.text({ references: () => Users.columns.id }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
});

const Categories = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    category: column.text(),
  },
});

const Transactions = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    eventId: column.text({ references: () => Events.columns.id }),
    sponsorId: column.text({ references: () => Sponsors.columns.id }),
    userId: column.text({ references: () => Users.columns.id }),
    totalFund: column.number(),
    comment: column.text(),
    accountNumber: column.text(),
    bankName: column.text(),
    accountName: column.text(),
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

export default defineDb({
  tables: {
    Users,
    Roles,
    Events,
    Sponsors,
    Categories,
    Transactions,
    TransactionsStatuses,
    WithdrawStatuses,
    PaymentStatuses,
    Reports,
  },
});
