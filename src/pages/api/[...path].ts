import { Hono } from "hono";
import type { APIRoute } from "astro";

import { db, Users } from "astro:db";

import auth from "@/controllers/auth";

const app = new Hono().basePath("/api");

app.get("/hello", async (c) => {
  const users = await db.select().from(Users);
  return c.json(users);
});

app.route("/auth", auth);

export const ALL: APIRoute = async ({ request }) => {
  return app.fetch(request);
};
