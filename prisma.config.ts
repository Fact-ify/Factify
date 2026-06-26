import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Placeholder is only for `prisma generate` when DATABASE_URL is unset (e.g. CI install).
const databaseUrl =
  process.env.DATABASE_URL ?? 'postgresql://localhost:5432/factify';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: databaseUrl,
  },
});
