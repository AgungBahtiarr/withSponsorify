import { db, eq, Roles } from "astro:db";
import { createMiddleware } from "hono/factory";
import { decode } from "hono/jwt";

const isEvent = createMiddleware(async (c, next) => {
  const header = c.req.header("Authorization").split(" ");
  const token = header[1];
  const user = decode(token).payload;

  const role = await db
    .select()
    .from(Roles)
    .where(eq(Roles.id, user.roleId as string));

  if (role[0].role !== "Sponsor") {
    return c.json(
      {
        message: "Roles are not permitted",
      },
      401
    );
  }
  await next();
});

export default isEvent;
