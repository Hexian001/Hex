import { NextRequest, NextResponse } from "next/server";
import { PCS_SWAP_API } from "@/lib/pcs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const payload = await req.json();

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const apiKey = process.env.PCS_API_KEY;
  if (apiKey) headers["X-API-KEY"] = apiKey;

  try {
    const res = await fetch(`${PCS_SWAP_API}/v1/calldata`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const text = await res.text();
    let body: unknown = text;
    try {
      body = JSON.parse(text);
    } catch {
      /* keep text */
    }
    return NextResponse.json(
      typeof body === "object" && body !== null
        ? body
        : { message: String(body) },
      { status: res.status },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to reach PancakeSwap",
      },
      { status: 502 },
    );
  }
}
