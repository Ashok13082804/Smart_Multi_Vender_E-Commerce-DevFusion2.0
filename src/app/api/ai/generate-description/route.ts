import { NextResponse } from "next/server";
import { generateAIDescription } from "@/ai/descriptions/descriptionGeneratorService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = generateAIDescription(body);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 400 });
  }
}
