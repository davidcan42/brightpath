"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, BookOpen, Lightbulb, CheckCircle } from "lucide-react";

interface StorySegment {
  type: string;
  content: string;
}

interface IDoPhaseProps {
  content: StorySegment[];
  title: string;
  expert: string;
  isComplete: boolean;
  onComplete: () => void;
}

export function IDoPhase({ content, title, expert, isComplete, onComplete }: IDoPhaseProps) {
  const [currentSegment, setCurrentSegment] = useState(0);
  const [hasReadAll, setHasReadAll] = useState(false);

  const progress = ((currentSegment + 1) / content.length) * 100;

  const handleNext = () => {
    if (currentSegment < content.length - 1) {
      setCurrentSegment(currentSegment + 1);
    } else {
      setHasReadAll(true);
    }
  };

  const handlePrevious = () => {
    if (currentSegment > 0) {
      setCurrentSegment(currentSegment - 1);
    }
  };

  const getSegmentIcon = (type: string) => {
    switch (type) {
      case "insight":
        return <Lightbulb className="h-5 w-5 text-accent" />;
      default:
        return <BookOpen className="h-5 w-5 text-primary" />;
    }
  };

  const getSegmentStyle = (type: string) => {
    switch (type) {
      case "insight":
        return "bg-accent/10 border-accent/20 border-l-4 border-l-accent";
      default:
        return "";
    }
  };

  const currentStorySegment = content[currentSegment];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-primary/10 p-2">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">I Do: Learn from the Expert</CardTitle>
                <CardDescription>
                  Follow along as {expert} shares their insights on {title}
                </CardDescription>
              </div>
            </div>
            {isComplete && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Complete</span>
              </Badge>
            )}
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Reading Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentSegment + 1} of {content.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Story Content */}
      <Card className={`min-h-[400px] ${getSegmentStyle(currentStorySegment.type)}`}>
        <CardHeader>
          <div className="flex items-center space-x-2">
            {getSegmentIcon(currentStorySegment.type)}
            <CardTitle className="text-lg">
              {currentStorySegment.type === "insight" ? "Key Insight" : "Story"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground leading-relaxed text-lg">
              {currentStorySegment.content}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentSegment === 0}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-2">
          {content.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentSegment
                  ? "bg-primary"
                  : index < currentSegment
                  ? "bg-primary/60"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        {currentSegment < content.length - 1 ? (
          <Button
            onClick={handleNext}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={onComplete}
            disabled={isComplete}
            className="flex items-center space-x-2"
          >
            <CheckCircle className="h-4 w-4" />
            <span>{isComplete ? "Completed" : "Complete Phase"}</span>
          </Button>
        )}
      </div>

      {/* Phase Summary */}
      {hasReadAll && !isComplete && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="text-2xl">🎯</div>
              <h3 className="text-lg font-semibold">Great job!</h3>
              <p className="text-muted-foreground">
                You've completed the story. Ready to put this knowledge into practice?
              </p>
              <Button onClick={onComplete} className="mt-4">
                Complete I Do Phase
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 