export const runtime = "nodejs";

import { sql } from "@/app/lib/db";

async function getDbVersion() {
  const result = await sql`SELECT version()`;
  return result[0].version as string;
}

export default async function TestPage() {
  const version = await getDbVersion();
  return (
    <main>
      <h1>Connected to Neon!</h1>
      <p>PostgreSQL Version: {version}</p>
    </main>
  );
}
