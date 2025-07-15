import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { age, difficultyPreference } = body;

    // Validate input
    if (!age || age < 9 || age > 120) {
      return NextResponse.json({ error: "Invalid age" }, { status: 400 });
    }

    if (!["Simplified", "Standard", "Advanced"].includes(difficultyPreference)) {
      return NextResponse.json({ error: "Invalid difficulty preference" }, { status: 400 });
    }

    // Get the user's email from Clerk
    const clerkUser = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then((res) => res.json());

    if (!clerkUser.email_addresses || clerkUser.email_addresses.length === 0) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    const email = clerkUser.email_addresses[0].email_address;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: { clerkId: userId },
        data: {
          age,
          difficultyPreference,
          email,
        },
      });

      return NextResponse.json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } else {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email,
          age,
          difficultyPreference,
        },
      });

      return NextResponse.json({
        message: "User created successfully",
        user: newUser,
      });
    }
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 