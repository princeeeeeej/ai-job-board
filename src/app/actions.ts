// app/actions.ts
"use server";
import { env } from "@/data/env/server";
import { neon } from "@neondatabase/serverless";

export async function getData() {
    const sql = neon(env.DATABASE_URL);
    const data = await sql`...`;
    return data;
}