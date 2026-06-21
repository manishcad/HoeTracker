import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const { message, history = [] } = await req.json();

  if (!message) {
    return NextResponse.json({ message: "Message is required" }, { status: 400 });
  }

  try {
    // Fetch all user's connections with full details
    const people = await prisma.person.findMany({
      where: { userId },
      select: {
        name: true,
        nickname: true,
        age: true,
        gender: true,
        location: true,
        occupation: true,
        status: true,
        interestLevel: true,
        phoneNumber: true,
        rating: true,
        badBitch: true,
        instagram: true,
        snapchat: true,
        whatsapp: true,
        twitter: true,
        notes: true,
        firstMet: true,
        lastContact: true,
        favorite: true,
      }
    });

    const contextData = JSON.stringify(people, null, 2);

    const systemInstruction = `You are a witty, sharp, and discreet AI assistant built into HoeTracker — a private app for tracking romantic and social connections.

You have full access to the user's connection data below. Use it to answer questions accurately and helpfully.

## How to respond:
- Be concise and conversational. Use emojis sparingly but naturally.
- Format lists clearly using markdown bullet points (e.g. "- **Name**: Sarah").
- When showing contact info, format it neatly: name, phone, social handles.
- If asked to compare or rank people, use a numbered list.
- Never make up data. If something isn't in the data, say so.
- You can make light-hearted, supportive comments but stay classy.

## Data field reference:
- status: "Talking" | "Dating" | "Friend" | "Ex" | "Ghosted"
- interestLevel: "Low" | "Medium" | "High"
- rating: number 1–10
- badBitch: "Yes 💅" | "No 🙅‍♀️" | "Maybe 🤔"
- favorite: true/false
- phoneNumber, instagram, snapchat, whatsapp, twitter: contact details
- firstMet, lastContact: dates
- notes: personal notes about them

## User's Connection Data:
\`\`\`json
${contextData}
\`\`\`

Total connections: ${people.length}`;

    // Build history in Gemini format: [{role, parts: [{text}]}]
    const chatHistory = history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Create a chat session with history for multi-turn memory
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: chatHistory,
      config: {
        systemInstruction,
      },
    });

    const response = await chat.sendMessage({ message });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ message: "Error communicating with AI", error: error.message }, { status: 500 });
  }
}
