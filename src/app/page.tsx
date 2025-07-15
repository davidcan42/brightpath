import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { KnowledgeStream } from "@/components/KnowledgeStream";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user exists in database (onboarding completed)
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-background">
      <KnowledgeStream user={user} />
    </div>
  );
}
