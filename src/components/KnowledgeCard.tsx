"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Star, Users, Play, BookOpen, Lightbulb, Target } from "lucide-react";
import { useRouter } from "next/navigation";

interface KnowledgeCardProps {
  id: string;
  title: string;
  sourceExpert: string;
  category: string;
  difficulty: "Simplified" | "Standard" | "Advanced";
  estimatedTime: number; // in minutes
  description: string;
  progress?: {
    status: "started" | "ido_complete" | "wedo_complete" | "youdo_complete";
    score: number;
  };
  isUserGenerated?: boolean;
  userCreator?: {
    name: string;
    avatar?: string;
  };
  peerReviews?: number;
  rating?: number;
}

const difficultyColors = {
  Simplified: "bg-green-100 text-green-800 border-green-200",
  Standard: "bg-blue-100 text-blue-800 border-blue-200", 
  Advanced: "bg-purple-100 text-purple-800 border-purple-200",
};

const categoryIcons = {
  "Health & Wellness": Lightbulb,
  "Learning & Productivity": BookOpen,
  "Science & Technology": Target,
  "Personal Development": Star,
};

export function KnowledgeCard({
  id,
  title,
  sourceExpert,
  category,
  difficulty,
  estimatedTime,
  description,
  progress,
  isUserGenerated = false,
  userCreator,
  peerReviews,
  rating,
}: KnowledgeCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons] || BookOpen;

  const getProgressPercentage = () => {
    if (!progress) return 0;
    switch (progress.status) {
      case "started":
        return 25;
      case "ido_complete":
        return 50;
      case "wedo_complete":
        return 75;
      case "youdo_complete":
        return 100;
      default:
        return 0;
    }
  };

  const getProgressText = () => {
    if (!progress) return "Start Learning";
    switch (progress.status) {
      case "started":
        return "Continue I Do";
      case "ido_complete":
        return "Continue We Do";
      case "wedo_complete":
        return "Continue You Do";
      case "youdo_complete":
        return `Completed • ${progress.score} pts`;
      default:
        return "Start Learning";
    }
  };

  const handleCardClick = () => {
    router.push(`/learn/${id}`);
  };

  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isHovered ? "shadow-lg border-primary/50" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-primary/10 p-2">
              <CategoryIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Badge variant="secondary" className="text-xs">
                  {category}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${difficultyColors[difficulty]}`}
                >
                  {difficulty}
                </Badge>
              </div>
              <CardTitle className="text-lg font-semibold leading-tight">
                {title}
              </CardTitle>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {isUserGenerated && userCreator ? (
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={userCreator.avatar} />
                  <AvatarFallback className="text-xs">
                    {userCreator.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <span>by {userCreator.name}</span>
              </div>
            ) : (
              <span className="font-medium text-primary">
                {sourceExpert}
              </span>
            )}
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{estimatedTime} min</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {rating && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              </div>
            )}
            {peerReviews && (
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">{peerReviews}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <CardDescription className="text-sm mb-4 line-clamp-3">
          {description}
        </CardDescription>

        {progress && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {getProgressPercentage()}%
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            className="flex items-center space-x-2 flex-1"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            <Play className="h-4 w-4" />
            <span>{getProgressText()}</span>
          </Button>
          
          {progress?.status === "youdo_complete" && (
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/learn/${id}/review`);
              }}
            >
              Review
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 