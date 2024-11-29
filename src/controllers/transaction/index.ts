import { and, db, eq, isNull, ne, Transactions } from "astro:db";
import { Hono } from "hono";
import { nanoid } from "nanoid";

const app = new Hono();

app.get("/", async (c) => {
  const transactions = await db
    .select()
    .from(Transactions)
    .where(isNull(Transactions.deletedAt));
  return c.json({
    success: true,
    data: transactions,
  });
});

app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const transaction = await db
    .select()
    .from(Transactions)
    .where(and(eq(Transactions.id, id), isNull(Transactions.deletedAt)));
  return c.json({
    success: true,
    data: transaction,
  });
});

app.post("/", async (c) => {
  const formData = await c.req.formData();
  const {
    eventId,
    sponsorId,
    userId,
    totalFund,
    fundingType,
    comment,
    accountNumber,
    bankName,
    accountName,
    proofOfPayment,
    expiredAt,
    transactionStatusId,
    paymentStatusId,
    withdrawStatusId,
  } = Object.fromEntries(formData);

  const data = {
    id: nanoid(),
    eventId: eventId.toString(),
    sponsorId: sponsorId.toString(),
    userId: userId.toString(),
    totalFund: Number(totalFund),
    fundingType: fundingType.toString(),
    comment: comment.toString(),
    accountNumber: accountNumber.toString(),
    bankName: bankName.toString(),
    accountName: accountName.toString(),
    proofOfPayment: proofOfPayment.toString(),
    expiredAt: new Date(expiredAt.toString()),
    transactionStatusId: transactionStatusId.toString(),
    paymentStatusId: paymentStatusId.toString(),
    withdrawStatusId: withdrawStatusId.toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const transaction = await db
      .insert(Transactions)
      .values(data)
      .returning({ id: Transactions.id });
    return c.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    return c.json(
      {
        success: true,
        data: error.message,
      },
      500
    );
  }
});

export default app;
