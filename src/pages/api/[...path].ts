import { Hono } from "hono";
import type { APIRoute } from "astro";
import { db, Events, Sponsors, Users } from "astro:db";
import auth from "@/controllers/auth";
import { jwt } from "hono/jwt";

const app = new Hono().basePath("/api");

app.get("/hello", jwt({ secret: import.meta.env.JWT_SECRET }), async (c) => {
  const users = await db.select().from(Users);
  const events = await db.select().from(Events);
  const sponsors = await db.select().from(Sponsors);
  return c.json([users, events, sponsors], 200);
});

app.route("/auth", auth);

export const ALL: APIRoute = async ({ request }) => {
  return app.fetch(request);
};
