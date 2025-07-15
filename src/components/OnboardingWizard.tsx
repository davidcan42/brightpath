"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, BookOpen, Settings, Check } from "lucide-react";

interface OnboardingWizardProps {
  onComplete: (data: {
    age: number;
    difficultyPreference: "Simplified" | "Standard" | "Advanced";
  }) => void;
  isSubmitting: boolean;
}

export function OnboardingWizard({ onComplete, isSubmitting }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    age: "",
    difficultyPreference: "Standard" as "Simplified" | "Standard" | "Advanced",
  });

  const steps = [
    {
      title: "Welcome to BrightPath",
      description: "Let's get you set up with a personalized learning experience",
      icon: BookOpen,
    },
    {
      title: "Tell us about yourself",
      description: "This helps us provide age-appropriate content",
      icon: Settings,
    },
    {
      title: "Choose your learning style",
      description: "We'll adapt content to your preferred difficulty level",
      icon: Settings,
    },
    {
      title: "Ready to learn!",
      description: "Your personalized learning journey starts now",
      icon: Check,
    },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const age = parseInt(formData.age);
    if (age && age >= 9 && age <= 120) {
      onComplete({
        age,
        difficultyPreference: formData.difficultyPreference,
      });
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        const age = parseInt(formData.age);
        return age && age >= 9 && age <= 120;
      case 2:
        return formData.difficultyPreference;
      case 3:
        return true; // Final step - always allow proceed
      default:
        return false;
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <StepIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
          <CardDescription className="text-lg">
            {steps[currentStep].description}
          </CardDescription>
          <div className="mt-6">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentStep === 0 && (
            <div className="text-center space-y-4">
              <div className="text-4xl mb-4">🌟</div>
              <p className="text-muted-foreground">
                BrightPath transforms complex expert knowledge into engaging, personalized learning experiences. 
                Using the proven "I Do, We Do, You Do" methodology, we'll help you learn from top experts 
                in health, productivity, science, and personal development.
              </p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">What's your age?</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, age: e.target.value })}
                  min="9"
                  max="120"
                  className="text-center text-lg"
                />
                <p className="text-sm text-muted-foreground text-center">
                  We support learners aged 9 and up
                </p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <Label>How do you prefer to learn complex topics?</Label>
              <RadioGroup
                value={formData.difficultyPreference}
                onValueChange={(value: string) => 
                  setFormData({ 
                    ...formData, 
                    difficultyPreference: value as "Simplified" | "Standard" | "Advanced" 
                  })
                }
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-accent/50 cursor-pointer">
                  <RadioGroupItem value="Simplified" id="simplified" />
                  <div className="flex-1">
                    <Label htmlFor="simplified" className="font-medium cursor-pointer">
                      Simplified
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Break down complex topics into easy-to-understand concepts
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-accent/50 cursor-pointer">
                  <RadioGroupItem value="Standard" id="standard" />
                  <div className="flex-1">
                    <Label htmlFor="standard" className="font-medium cursor-pointer">
                      Standard
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Balanced complexity appropriate for most learners
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-accent/50 cursor-pointer">
                  <RadioGroupItem value="Advanced" id="advanced" />
                  <div className="flex-1">
                    <Label htmlFor="advanced" className="font-medium cursor-pointer">
                      Advanced
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Detailed explanations with full complexity and nuance
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center space-y-4">
              <div className="text-4xl mb-4">🚀</div>
              <p className="text-muted-foreground">
                You're all set! Your personalized learning experience is ready. 
                Start exploring expert knowledge tailored to your preferences.
              </p>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                <span>{isSubmitting ? "Setting up..." : "Complete Setup"}</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 