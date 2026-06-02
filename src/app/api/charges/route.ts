import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function GET() {
  return NextResponse.json(await prisma.charge.findMany({ include: { unit: true } }));
}
export async function POST(req: Request) {
  return NextResponse.json(await prisma.charge.create({ data: await req.json() }), { status: 201 });
}
