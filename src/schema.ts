import { serial, text, timestamp, pgTable, date } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  role: text("role").$type<"event_organizer" | "sponsor" | "admin">(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  location: text("location"),
  proposal: text("proposal"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  userId: serial("user_id").references(() => user.id),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
