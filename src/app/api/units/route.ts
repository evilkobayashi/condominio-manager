import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function GET() {
  return NextResponse.json(await prisma.unit.findMany({ include: { charges: true } }));
}
export async function POST(req: Request) {
  return NextResponse.json(await prisma.unit.create({ data: await req.json() }), { status: 201 });
}
