import { and, db, eq, isNull, Sponsors } from "astro:db";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import uploadImage from "@/lib/uploadImage";

const app = new Hono<{ Variables: Variables }>();

app.get("/", async (c) => {
  const sponsors = await db
    .select()
    .from(Sponsors)
    .where(isNull(Sponsors.deletedAt));

  return c.json({
    success: true,
    data: sponsors,
  });
});

app.get("/:id", async (c) => {
  const id = c.req.param("id");

  const sponsor = await db
    .select()
    .from(Sponsors)
    .where(and(eq(Sponsors.id, id), isNull(Sponsors.deletedAt)));

  return c.json({
    success: true,
    data: sponsor,
  });
});

type Variables = {
  imageSponsor: string;
  logoSponsor: string;
};

app.use(uploadImage).post("/", async (c) => {
  const formData = await c.req.formData();
  const imagePath = c.get("imageSponsor");
  const logoPath = c.get("logoSponsor");
  const {
    name,
    description,
    address,
    website,
    contactPerson,
    phone,
    maxSubmissionDate,
    userId,
  } = Object.fromEntries(formData);

  try {
    const sponsor = await db
      .insert(Sponsors)
      .values({
        id: nanoid(),
        name: name.toString(),
        description: description.toString(),
        address: address.toString(),
        contactPerson: contactPerson.toString(),
        image: imagePath.toString(),
        logo: logoPath.toString(),
        maxSubmissionDate: Number(maxSubmissionDate),
        phone: phone.toString(),
        userId: userId.toString(),
        website: website.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: Sponsors.id });

    return c.json({
      success: true,
      data: sponsor,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        data: error.message,
      },
      500
    );
  }
});

app.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const formData = await c.req.formData();
  const {
    name,
    description,
    address,
    website,
    logo,
    contactPerson,
    phone,
    maxSubmissionDate,
    image,
    userId,
  } = Object.fromEntries(formData);

  try {
    const sponsor = await db
      .update(Sponsors)
      .set({
        name: name.toString() || undefined,
        description: description.toString() || undefined,
        address: address.toString() || undefined,
        contactPerson: contactPerson.toString() || undefined,
        image: image.toString() || undefined,
        logo: logo.toString() || undefined,
        maxSubmissionDate: Number(maxSubmissionDate) || undefined,
        phone: phone.toString() || undefined,
        userId: userId.toString() || undefined,
        website: website.toString() || undefined,
        updatedAt: new Date(),
      })
      .where(eq(Sponsors.id, id))
      .returning({ id: Sponsors.id });

    return c.json({
      success: true,
      data: sponsor,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        data: error.message,
      },
      500
    );
  }
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const sponsor = await db
      .update(Sponsors)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(Sponsors.id, id))
      .returning({ id: Sponsors.id });

    return c.json({
      success: true,
      data: sponsor,
    });
  } catch (error) {
    return c.json({
      success: false,
      data: error.message,
    });
  }
});

export default app;
