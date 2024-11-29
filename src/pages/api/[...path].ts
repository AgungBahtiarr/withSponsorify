import { Hono } from "hono";
import type { APIRoute } from "astro";
import { db, Events, Sponsors, Transactions, Users } from "astro:db";
import auth from "@/controllers/auth";
import event from "@/controllers/event";
import sponsor from "@/controllers/sponsor";
import transaction from "@/controllers/transaction";
import { jwt } from "hono/jwt";
import isEvent from "@/middleware/isEvent";
import { prettyJSON } from "hono/pretty-json";
const app = new Hono().basePath("/api");

app.use(prettyJSON());

app.get(
  "/hello",
  // jwt({ secret: import.meta.env.JWT_SECRET }),
  // isEvent,
  async (c) => {
    const users = await db.select().from(Users);
    const events = await db.select().from(Events);
    const sponsors = await db.select().from(Sponsors);
    const transactions = await db.select().from(Transactions);
    return c.json([users, events, sponsors, transactions], 200);
  }
);

app.route("/auth", auth);

app.route("/events", event);

app.route("/sponsors", sponsor);

app.route("/transactions", transaction);

export const ALL: APIRoute = async ({ request }) => {
  return app.fetch(request);
};
