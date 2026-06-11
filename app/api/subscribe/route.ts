import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, contributor } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const baseUrl = process.env.LISTMONK_URL;
  const username = process.env.LISTMONK_USERNAME;
  const password = process.env.LISTMONK_PASSWORD;
  const listId = Number(process.env.LISTMONK_LIST_ID);

  if (!baseUrl || !username || !password || !listId) {
    console.error("Listmonk env vars not configured");
    return NextResponse.json(
      { error: "Mailing list is not configured yet." },
      { status: 503 },
    );
  }

  const credentials = Buffer.from(`${username}:${password}`).toString("base64");

  const res = await fetch(`${baseUrl}/api/subscribers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      name: email.split("@")[0],
      lists: [listId],
      status: "enabled",
      preconfirm_subscriptions: true,
      attribs: { contributor: Boolean(contributor) },
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // listmonk returns 409 when the email already exists
    if (res.status === 409) {
      return NextResponse.json({ ok: true });
    }
    console.error("Listmonk error", res.status, body);
    return NextResponse.json(
      { error: "Could not subscribe. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
