"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle, Lightbulb, ArrowRight, Clock } from "lucide-react";

interface Question {
  id: string;
  question: string;
  type: string;
  options?: string[];
  explanation: string;
}

interface Exercise {
  type: string;
  title: string;
  description: string;
  questions: Question[];
}

interface WeDoPhaseProps {
  exercise: Exercise;
  title: string;
  isComplete: boolean;
  onComplete: (score: number) => void;
}

export function WeDoPhase({ exercise, title, isComplete, onComplete }: WeDoPhaseProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = ((currentQuestion + 1) / exercise.questions.length) * 100;
  const currentQ = exercise.questions[currentQuestion];

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    setShowExplanation(false);
  };

  const handleNext = () => {
    if (currentQuestion < exercise.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Calculate score based on completion
    const answeredQuestions = Object.keys(answers).length;
    const score = Math.round((answeredQuestions / exercise.questions.length) * 100);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(score);
    setIsSubmitting(false);
  };

  const canProceed = () => {
    return answers[currentQ.id] && answers[currentQ.id].trim() !== "";
  };

  const isLastQuestion = currentQuestion === exercise.questions.length - 1;
  const allQuestionsAnswered = exercise.questions.every(q => answers[q.id]);

  const renderQuestionInput = () => {
    const answer = answers[currentQ.id] || "";

    switch (currentQ.type) {
      case "multiple_choice":
        return (
          <RadioGroup
            value={answer}
            onValueChange={(value) => handleAnswer(currentQ.id, value)}
          >
            {currentQ.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent/50">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case "time":
        return (
          <div className="space-y-2">
            <Input
              type="time"
              value={answer}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnswer(currentQ.id, e.target.value)}
              className="text-lg"
            />
          </div>
        );
      
      case "text":
      default:
        return (
          <Textarea
            value={answer}
            onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-[100px]"
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">We Do: Interactive Practice</CardTitle>
                <CardDescription>
                  {exercise.title}
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
              <span className="text-sm font-medium">Question Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentQuestion + 1} of {exercise.questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Exercise Description */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground mb-4">
            {exercise.description}
          </p>
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              {currentQuestion + 1}
            </span>
            <span>{currentQ.question}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderQuestionInput()}
          
          {/* Show explanation after answering */}
          {canProceed() && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center space-x-2"
              >
                <Lightbulb className="h-4 w-4" />
                <span>{showExplanation ? "Hide" : "Show"} Explanation</span>
              </Button>
              
              {showExplanation && (
                <Card className="mt-3 bg-accent/10 border-accent/20">
                  <CardContent className="pt-4">
                    <p className="text-sm text-foreground">{currentQ.explanation}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="flex items-center space-x-2"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          <span>Previous</span>
        </Button>

        {isLastQuestion ? (
          <Button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered || isSubmitting || isComplete}
            className="flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>{isComplete ? "Completed" : "Complete Phase"}</span>
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center space-x-2"
          >
            <span>Next Question</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Progress Summary */}
      {isLastQuestion && allQuestionsAnswered && !isComplete && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="text-2xl">🎯</div>
              <h3 className="text-lg font-semibold">Ready to Submit!</h3>
              <p className="text-muted-foreground">
                You've answered all questions. Submit to complete the "We Do" phase.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 