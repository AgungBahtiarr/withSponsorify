import { db, Users } from "astro:db";
// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Users).values([
    {
      name: "Agung Bahtiar",
      email: "ab@gmail.com",
      password: "1234",
    },
  ]);
}
