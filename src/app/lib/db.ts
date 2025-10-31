// app/lib/db.ts
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL not found! Check your .env.local file");
} else {
  console.log("✅ DATABASE_URL loaded:", process.env.DATABASE_URL);
}

export const sql = neon(process.env.DATABASE_URL!);
