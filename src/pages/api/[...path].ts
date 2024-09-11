import { Hono } from "hono";
import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/postgres-js";
import { user } from "@/schema";
import postgres from "postgres";
const client = postgres(import.meta.env.DATABASE_URL);
const db = drizzle(client);

const users = await db.select().from(user);

const app = new Hono().basePath("/api");

app.get("/hello", async (c) => {
  return c.json(users);
});

export const ALL: APIRoute = async ({ request }) => {
  return app.fetch(request);
};
