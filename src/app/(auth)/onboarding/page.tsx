"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { OnboardingWizard } from "@/components/OnboardingWizard";

export default function OnboardingPage() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  if (isLoaded && !userId) {
    router.push("/sign-in");
    return null;
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleOnboardingComplete = async (data: {
    age: number;
    difficultyPreference: "Simplified" | "Standard" | "Advanced";
  }) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/users/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to complete onboarding");
      }

      // Redirect to main dashboard
      router.push("/");
    } catch (error) {
      console.error("Onboarding error:", error);
      // TODO: Add proper error handling/toast notification
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <OnboardingWizard
        onComplete={handleOnboardingComplete}
        isSubmitting={isSubmitting}
      />
    </div>
  );
} 