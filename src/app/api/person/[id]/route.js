import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PUT(req, { params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const data = await req.json();

  try {
    const existing = await prisma.person.findUnique({ where: { id, userId } });
    if (!existing) return NextResponse.json({ message: "Not found" }, { status: 404 });

    const person = await prisma.person.update({
      where: { id },
      data: {
        name: data.name,
        nickname: data.nickname || null,
        age: data.age ? parseInt(data.age) : null,
        gender: data.gender || null,
        location: data.location || null,
        occupation: data.occupation || null,
        instagram: data.instagram || null,
        snapchat: data.snapchat || null,
        whatsapp: data.whatsapp || null,
        twitter: data.twitter || null,
        phoneNumber: data.phoneNumber || null,
        rating: data.rating ? parseInt(data.rating) : null,
        badBitch: data.badBitch || null,
        status: data.status,
        interestLevel: data.interestLevel,
        favorite: data.favorite,
        firstMet: data.firstMet ? new Date(data.firstMet) : null,
        lastContact: data.lastContact ? new Date(data.lastContact) : null,
        notes: data.notes || null,
        profileImage: data.profileImage !== undefined ? data.profileImage : null,
      }
    });

    if (existing.status !== data.status) {
      await prisma.timelineEvent.create({
        data: {
          personId: person.id,
          eventType: 'Status Changed',
          description: `Status changed from ${existing.status} to ${data.status}.`,
        }
      });
    }

    return NextResponse.json(person);
  } catch (error) {
    return NextResponse.json({ message: "Error updating connection" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  try {
    const existing = await prisma.person.findUnique({ where: { id, userId } });
    if (!existing) return NextResponse.json({ message: "Not found" }, { status: 404 });

    await prisma.person.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting connection" }, { status: 500 });
  }
}
