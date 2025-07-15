"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, Users, Target, CheckCircle, Clock, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { User, UserProgress } from "@/generated/prisma";
import { IDoPhase } from "@/components/learning/IDoPhase";
import { WeDoPhase } from "@/components/learning/WeDoPhase";
import { YouDoPhase } from "@/components/learning/YouDoPhase";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";

interface ContentModule {
  id: string;
  sourceExpert: string;
  topicTitle: string;
  category: string;
  content: {
    i_do_story: Array<{
      type: string;
      content: string;
    }>;
    we_do_exercise: {
      type: string;
      title: string;
      description: string;
      questions: Array<{
        id: string;
        question: string;
        type: string;
        options?: string[];
        explanation: string;
      }>;
    };
    you_do_challenge: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface LearningModuleProps {
  contentModule: ContentModule;
  userProgress: UserProgress;
  user: User;
}

const phaseIcons = {
  ido: BookOpen,
  wedo: Users,
  youdo: Target,
};

const phaseNames = {
  ido: "I Do",
  wedo: "We Do", 
  youdo: "You Do",
};

export function LearningModule({ contentModule, userProgress, user }: LearningModuleProps) {
  const router = useRouter();
  const [currentPhase, setCurrentPhase] = useState<"ido" | "wedo" | "youdo">(
    getInitialPhase(userProgress.status)
  );

  function getInitialPhase(status: string): "ido" | "wedo" | "youdo" {
    switch (status) {
      case "started":
        return "ido";
      case "ido_complete":
        return "wedo";
      case "wedo_complete":
        return "youdo";
      case "youdo_complete":
        return "youdo";
      default:
        return "ido";
    }
  }

  const getPhaseProgress = (phase: "ido" | "wedo" | "youdo") => {
    const { status } = userProgress;
    
    switch (phase) {
      case "ido":
        return status === "started" ? 0 : 100;
      case "wedo":
        return status === "ido_complete" ? 0 : 
               status === "wedo_complete" || status === "youdo_complete" ? 100 : 0;
      case "youdo":
        return status === "wedo_complete" ? 0 : 
               status === "youdo_complete" ? 100 : 0;
      default:
        return 0;
    }
  };

  const getOverallProgress = () => {
    const { status } = userProgress;
    switch (status) {
      case "started":
        return 33;
      case "ido_complete":
        return 66;
      case "wedo_complete":
        return 90;
      case "youdo_complete":
        return 100;
      default:
        return 0;
    }
  };

  const isPhaseAvailable = (phase: "ido" | "wedo" | "youdo") => {
    const { status } = userProgress;
    
    switch (phase) {
      case "ido":
        return true;
      case "wedo":
        return status === "ido_complete" || status === "wedo_complete" || status === "youdo_complete";
      case "youdo":
        return status === "wedo_complete" || status === "youdo_complete";
      default:
        return false;
    }
  };

  const isPhaseComplete = (phase: "ido" | "wedo" | "youdo") => {
    const { status } = userProgress;
    
    switch (phase) {
      case "ido":
        return status === "ido_complete" || status === "wedo_complete" || status === "youdo_complete";
      case "wedo":
        return status === "wedo_complete" || status === "youdo_complete";
      case "youdo":
        return status === "youdo_complete";
      default:
        return false;
    }
  };

  const handlePhaseComplete = async (phase: "ido" | "wedo" | "youdo", score: number = 0) => {
    try {
      const response = await fetch("/api/progress/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moduleId: contentModule.id,
          phase,
          score,
        }),
      });

      if (response.ok) {
        // Move to next phase or complete
        if (phase === "ido") {
          setCurrentPhase("wedo");
        } else if (phase === "wedo") {
          setCurrentPhase("youdo");
        }
        // Refresh the page to update progress
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Stream</span>
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {contentModule.topicTitle}
                </h1>
                <p className="text-sm text-muted-foreground">
                  by {contentModule.sourceExpert}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{contentModule.category}</Badge>
              <div className="text-sm text-muted-foreground">
                {getOverallProgress()}% Complete
              </div>
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={getOverallProgress()} className="h-2" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
                      <Tabs value={currentPhase} onValueChange={(value: string) => setCurrentPhase(value as "ido" | "wedo" | "youdo")}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              {(["ido", "wedo", "youdo"] as const).map((phase) => {
                const Icon = phaseIcons[phase];
                const isAvailable = isPhaseAvailable(phase);
                const isComplete = isPhaseComplete(phase);
                
                return (
                  <TabsTrigger 
                    key={phase} 
                    value={phase}
                    disabled={!isAvailable}
                    className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{phaseNames[phase]}</span>
                    {isComplete && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="ido">
              <IDoPhase
                content={contentModule.content.i_do_story}
                title={contentModule.topicTitle}
                expert={contentModule.sourceExpert}
                isComplete={isPhaseComplete("ido")}
                onComplete={() => handlePhaseComplete("ido")}
              />
            </TabsContent>

            <TabsContent value="wedo">
              <WeDoPhase
                exercise={contentModule.content.we_do_exercise}
                title={contentModule.topicTitle}
                isComplete={isPhaseComplete("wedo")}
                onComplete={(score: number) => handlePhaseComplete("wedo", score)}
              />
            </TabsContent>

            <TabsContent value="youdo">
              <YouDoPhase
                challenge={contentModule.content.you_do_challenge}
                title={contentModule.topicTitle}
                moduleId={contentModule.id}
                isComplete={isPhaseComplete("youdo")}
                onComplete={(score: number) => handlePhaseComplete("youdo", score)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
} 