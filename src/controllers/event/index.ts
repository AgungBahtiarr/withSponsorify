import { and, db, eq, Events, isNull, NOW } from "astro:db";
import { Hono } from "hono";
import { nanoid } from "nanoid";

const app = new Hono();

app.get("/", async (c) => {
  const events = await db.select().from(Events).where(isNull(Events.deletedAt));
  return c.json({
    data: events,
  });
});

app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const event = await db
    .select()
    .from(Events)
    .where(and(eq(Events.id, id), isNull(Events.deletedAt)));
  return c.json({
    data: event,
  });
});

app.post("/", async (c) => {
  try {
    const formData = await c.req.formData();
    const proposalPath = await c.get("proposal");
    const imagePath = await c.get("image");
    const {
      name,
      description,
      email,
      location,
      startDate,
      userId,
      endDate,
      categoryId,
      budget,
    } = Object.fromEntries(formData);

    const event = await db
      .insert(Events)
      .values({
        id: nanoid(),
        name: name.toString(),
        description: description.toString(),
        email: email.toString(),
        location: location.toString(),
        proposal: proposalPath.toString(),
        budget: Number(budget) || 0,
        image: imagePath.toString() || "",
        status: "active",
        startDate: new Date(startDate.toString()),
        endDate: new Date(endDate.toString()),
        categoryId: categoryId.toString(),
        userId: userId.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({
        id: Events.id,
        proposal: Events.proposal,
        image: Events.image,
      });

    return c.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return c.json({
      success: false,
      error: error.message,
    });
  }
});

app.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const formData = await c.req.formData();
  const {
    name,
    description,
    email,
    location,
    proposal,
    startDate,
    userId,
    endDate,
    categoryId,
    budget,
    image,
    status,
  } = Object.fromEntries(formData);

  try {
    const event = await db
      .update(Events)
      .set({
        name: name.toString() || undefined,
        description: description.toString() || undefined,
        email: email.toString() || undefined,
        location: location.toString() || undefined,
        proposal: proposal.toString() || undefined,
        startDate: new Date(startDate.toString()) || undefined,
        userId: userId.toString() || undefined,
        status: status.toString() || undefined,
        endDate: new Date(endDate.toString()) || undefined,
        categoryId: categoryId.toString() || undefined,
        budget: Number(budget) || undefined,
        image: image.toString() || undefined,
        updatedAt: NOW,
      })
      .where(eq(Events.id, id))
      .returning({ id: Events.id });

    return c.json({
      success: true,
      data: event,
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
    const event = await db
      .update(Events)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(Events.id, id))
      .returning({ id: Events.id });

    return c.json({
      success: true,
      data: event,
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

export default app;
