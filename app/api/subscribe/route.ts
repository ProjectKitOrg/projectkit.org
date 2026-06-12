import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, contributor } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  try {
    await sql`
      INSERT INTO subscribers (email, contributor, created_at)
      VALUES (${email.trim().toLowerCase()}, ${Boolean(contributor)}, NOW())
      ON CONFLICT (email) DO NOTHING
    `;
  } catch (err) {
    console.error("DB error", err);
    return NextResponse.json(
      { error: "Could not save your email. Please try again later." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
