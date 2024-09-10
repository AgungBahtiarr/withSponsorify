import { Hono } from "hono";
import type { APIRoute } from "astro";

const app = new Hono().basePath("/api");

app.get("/hello", async (c) => {
  return c.json({
    Hello: "Hello From Hono",
  });
});

export const ALL: APIRoute = async ({ request }) => {
  return app.fetch(request);
};
