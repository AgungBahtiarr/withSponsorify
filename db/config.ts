import { column, defineDb, defineTable } from "astro:db";

// https://astro.build/db/config

const Users = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    email: column.text({ unique: true }),
    password: column.text(),
  },
});

export default defineDb({
  tables: { Users },
});
