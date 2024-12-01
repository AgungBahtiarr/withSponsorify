import { Hono } from "hono";
import { sign } from "hono/jwt";
import { db, eq, Users } from "astro:db";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

const auth = new Hono();

auth.post("/register", async (c) => {
  const body = await c.req.formData();
  const name = body.get("name").toString();
  const roleId = body.get("roleId").toString();
  const email = body.get("email").toString();
  const password = body.get("password").toString();

  const existingUser = await db
    .select()
    .from(Users)
    .where(eq(Users.email, email));

  if (existingUser.length !== 0) {
    return c.json(
      {
        message: "Email already registered",
      },
      401
    );
  }

  await db.insert(Users).values({
    id: nanoid(),
    roleId,
    name,
    email,
    password: (await bcrypt.hash(password, 10)).toString(),
    isVerified: true,
  });

  const userData = await db
    .select({
      id: Users.id,
      name: Users.name,
      email: Users.email,
      roleId: Users.roleId,
    })
    .from(Users)
    .where(eq(Users.email, email));

  return c.json(
    {
      message: "Register Success",
      data: userData,
    },
    201
  );
});

auth.post("/login", async (c) => {
  const body = await c.req.formData();
  const email = body.get("email").toString();
  const password = body.get("password").toString();

  const isRegistered = await db
    .select()
    .from(Users)
    .where(eq(Users.email, email));

  if (isRegistered.length == 0) {
    return c.json(
      {
        message: "Email is not registered",
      },
      401
    );
  }

  const user = isRegistered[0];

  if ((await bcrypt.compare(password, user.password)) == false) {
    return c.json(
      {
        message: "Wrong Password",
      },
      401
    );
  }

  const secret = import.meta.env.JWT_SECRET;
  const token = await sign(user, secret);
  return c.json({
    name: user.name,
    email: user.email,
    roleId: user.roleId,
    token: token,
  });
});

export default auth;
