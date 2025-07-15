import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LearningModule } from "@/components/LearningModule";

interface LearningPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Sample content modules data (in a real app this would come from database)
const sampleContentModules = [
  {
    id: "1",
    sourceExpert: "Andrew Huberman",
    topicTitle: "The Science of Sleep Optimization",
    category: "Health & Wellness",
    content: {
      i_do_story: [
        {
          type: "text",
          content: "Meet Sarah, a busy professional who struggled with sleep for years. Like many of us, she thought she just needed to 'power through' her exhaustion. But science shows us a different path...",
        },
        {
          type: "text", 
          content: "Dr. Andrew Huberman's research reveals that sleep isn't just about rest—it's about optimization. Your brain has a built-in system for deep, restorative sleep, and you can learn to work with it.",
        },
        {
          type: "insight",
          content: "The key insight: Your circadian rhythm is controlled by light exposure, temperature, and timing. By understanding these three pillars, you can transform your sleep quality.",
        },
        {
          type: "text",
          content: "Sarah started with just one change: morning sunlight exposure. Within a week, she noticed falling asleep became easier. Within a month, she was waking up refreshed. The science worked.",
        },
      ],
      we_do_exercise: {
        type: "interactive_assessment",
        title: "Sleep Optimization Challenge",
        description: "Let's identify your biggest sleep challenges and create a personalized plan.",
        questions: [
          {
            id: "1",
            question: "What time do you typically go to bed?",
            type: "time",
            explanation: "Consistent bedtime helps regulate your circadian rhythm."
          },
          {
            id: "2", 
            question: "How much sunlight do you get within 30 minutes of waking?",
            type: "multiple_choice",
            options: [
              "None - I stay indoors",
              "Some - through windows",
              "Direct sunlight for 5-10 minutes",
              "Direct sunlight for 10+ minutes"
            ],
            explanation: "Morning light exposure is crucial for setting your circadian clock."
          },
          {
            id: "3",
            question: "What's your biggest sleep challenge?",
            type: "multiple_choice",
            options: [
              "Falling asleep takes too long",
              "Waking up during the night",
              "Waking up too early",
              "Feeling tired despite sleeping"
            ],
            explanation: "Different challenges require different optimization strategies."
          }
        ]
      },
      you_do_challenge: "Create a 7-day sleep optimization experiment. Choose ONE technique from the lesson and track your sleep quality each night. Document what works and what doesn't, then share your insights with the community to help others learn from your experience."
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    sourceExpert: "James Clear",
    topicTitle: "Building Atomic Habits",
    category: "Personal Development",
    content: {
      i_do_story: [
        {
          type: "text",
          content: "James Clear was an average baseball player in high school. Then a freak accident changed everything. A baseball bat to the face led to a serious injury that sidelined him for months.",
        },
        {
          type: "text",
          content: "During recovery, James discovered something powerful: tiny changes, repeated consistently, created remarkable results. He didn't need to change everything at once—just 1% better each day.",
        },
        {
          type: "insight",
          content: "The breakthrough: Habits are not about having enough willpower. They're about designing your environment and systems to make good choices automatic.",
        },
        {
          type: "text",
          content: "James applied this to his training. Small daily improvements in technique, fitness, and mindset. By senior year, he was team captain and received offers to play college baseball.",
        },
      ],
      we_do_exercise: {
        type: "habit_design_workshop",
        title: "Design Your Atomic Habit",
        description: "Let's build a habit that will stick using the four-step habit loop.",
        questions: [
          {
            id: "1",
            question: "What habit do you want to build?",
            type: "text",
            explanation: "Choose something specific and small enough to do even on your worst day."
          },
          {
            id: "2",
            question: "What will be your cue (trigger)?",
            type: "text", 
            explanation: "Link your new habit to something you already do consistently."
          },
          {
            id: "3",
            question: "How will you make it obvious in your environment?",
            type: "text",
            explanation: "Design your environment to make the good habit the easy choice."
          },
          {
            id: "4",
            question: "What immediate reward will you give yourself?",
            type: "text",
            explanation: "Your brain needs to feel good immediately after the habit to want to repeat it."
          }
        ]
      },
      you_do_challenge: "Implement your atomic habit for 7 days. Create a simple tracking system and note what works and what doesn't. Then create a short video or post explaining your experience and the lessons learned to help others build better habits."
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default async function LearningPage({ params }: LearningPageProps) {
  const { id } = await params;
  
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect("/onboarding");
  }

  // Find the content module (in a real app, this would be a database query)
  const contentModule = sampleContentModules.find(module => module.id === id);

  if (!contentModule) {
    redirect("/");
  }

  // Create or get content module from database
  let dbContentModule = await prisma.contentModule.findUnique({
    where: { id: id }
  });

  if (!dbContentModule) {
    dbContentModule = await prisma.contentModule.create({
      data: {
        id: id,
        sourceExpert: contentModule.sourceExpert,
        topicTitle: contentModule.topicTitle,
        category: contentModule.category,
        content: contentModule.content,
      }
    });
  }

  // Get or create user progress for this module
  let userProgress = await prisma.userProgress.findUnique({
    where: {
      userId_moduleId: {
        userId: user.id,
        moduleId: id,
      },
    },
  });

  if (!userProgress) {
    userProgress = await prisma.userProgress.create({
      data: {
        userId: user.id,
        moduleId: id,
        status: "started",
        score: 0,
      },
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <LearningModule
        contentModule={contentModule}
        userProgress={userProgress}
        user={user}
      />
    </div>
  );
} 