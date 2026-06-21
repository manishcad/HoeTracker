import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { name, password, profileImage } = await req.json();

  const dataToUpdate = { name };
  if (password) {
    dataToUpdate.password = await bcrypt.hash(password, 10);
  }
  if (profileImage !== undefined) {
    dataToUpdate.profileImage = profileImage;
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: dataToUpdate
    });
    return NextResponse.json({ message: "Updated" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
