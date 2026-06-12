import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: NextRequest) {
  const { email, contributor } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  try {
    await pool.query(
      `INSERT INTO subscribers (email, contributor, created_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (email) DO NOTHING`,
      [email.trim().toLowerCase(), Boolean(contributor)],
    );
  } catch (err) {
    console.error("DB error", err);
    return NextResponse.json(
      { error: "Could not save your email. Please try again later." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
