import { db, Users } from "astro:db";
import { nanoid } from "nanoid";
// https://astro.build/db/seed
export default async function seed() {
  for (let index = 0; index < 9; index++) {
    await db.insert(Users).values([
      {
        id: nanoid(),
        name: `Agung Bahtiar ${index}`,
        email: `ab${index}@gmail.com`,
        password: `1234`,
      },
    ]);
  }
}
