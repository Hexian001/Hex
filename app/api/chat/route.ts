import { connection } from "next/server";
import {
  completeChat,
  parseChatRequest,
  ProviderError,
  readAvailability,
} from "@/lib/providers";

export async function GET() {
  await connection();
  return Response.json(
    { availability: readAvailability() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  await connection();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Send a JSON body.", 400);
  }

  try {
    const { model, messages } = parseChatRequest(body);
    const result = await completeChat(model, messages);
    return Response.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof ProviderError) {
      return errorResponse(error.message, error.status);
    }
    if (error instanceof Error && error.name === "TimeoutError") {
      return errorResponse("The provider did not answer in time.", 504);
    }
    return errorResponse("The chat service failed before a reply was ready.", 500);
  }
}

function errorResponse(message: string, status: number) {
  return Response.json(
    { mode: "error", message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
