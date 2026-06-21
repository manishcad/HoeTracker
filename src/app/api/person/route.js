import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const data = await req.json();

  try {
    const person = await prisma.person.create({
      data: {
        userId,
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
        favorite: data.favorite || false,
        firstMet: data.firstMet ? new Date(data.firstMet) : null,
        lastContact: data.lastContact ? new Date(data.lastContact) : null,
        notes: data.notes || null,
      }
    });

    // Create a timeline event for adding the profile
    await prisma.timelineEvent.create({
      data: {
        personId: person.id,
        eventType: 'Profile Created',
        description: `Added ${person.name} to tracker.`,
      }
    });

    return NextResponse.json(person, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error creating connection" }, { status: 500 });
  }
}
