import { Hono } from "hono";

const auth = new Hono();

auth.get("/", (c) => {
  return c.text("hello from auth");
});

export default auth;
