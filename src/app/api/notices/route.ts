import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function GET() {
  return NextResponse.json(await prisma.notice.findMany({ orderBy: { createdAt: "desc" } }));
}
export async function POST(req: Request) {
  return NextResponse.json(await prisma.notice.create({ data: await req.json() }), { status: 201 });
}
