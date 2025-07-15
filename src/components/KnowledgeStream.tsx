"use client";

import { useState } from "react";
import { KnowledgeCard } from "@/components/KnowledgeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { Search, Plus, BookOpen, Trophy, Clock, Target } from "lucide-react";
import { User } from "@/generated/prisma";

interface KnowledgeStreamProps {
  user: User;
}

// Sample data - in a real app this would come from the database
const sampleContentModules = [
  {
    id: "1",
    title: "The Science of Sleep Optimization",
    sourceExpert: "Andrew Huberman",
    category: "Health & Wellness",
    difficulty: "Standard" as const,
    estimatedTime: 15,
    description: "Learn evidence-based strategies for improving sleep quality, including light exposure, temperature regulation, and sleep hygiene practices that can transform your daily energy levels.",
    progress: {
      status: "started" as const,
      score: 0,
    },
  },
  {
    id: "2", 
    title: "Building Atomic Habits",
    sourceExpert: "James Clear",
    category: "Personal Development",
    difficulty: "Simplified" as const,
    estimatedTime: 12,
    description: "Discover the power of small, consistent actions and how tiny changes can lead to remarkable results over time. Master the four-step habit loop and design your environment for success.",
    progress: {
      status: "wedo_complete" as const,
      score: 85,
    },
  },
  {
    id: "3",
    title: "The Future of AI and Human Collaboration",
    sourceExpert: "Lex Fridman",
    category: "Science & Technology",
    difficulty: "Advanced" as const,
    estimatedTime: 18,
    description: "Explore the cutting-edge developments in artificial intelligence and how humans and machines can work together to solve complex problems in the coming decades.",
  },
  {
    id: "4",
    title: "Productivity Systems That Actually Work",
    sourceExpert: "Tim Ferriss",
    category: "Learning & Productivity",
    difficulty: "Standard" as const,
    estimatedTime: 14,
    description: "Cut through the productivity noise with battle-tested systems used by high performers. Learn to identify the 20% of actions that generate 80% of results.",
    progress: {
      status: "youdo_complete" as const,
      score: 120,
    },
  },
  {
    id: "5",
    title: "My Learning Journey with Habit Formation",
    sourceExpert: "Community",
    category: "Personal Development",
    difficulty: "Standard" as const,
    estimatedTime: 8,
    description: "A fellow learner shares their 30-day journey implementing atomic habits and the unexpected challenges they faced along the way.",
    isUserGenerated: true,
    userCreator: {
      name: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
    },
    peerReviews: 24,
    rating: 4.6,
  },
];

const categories = [
  "All",
  "Health & Wellness",
  "Learning & Productivity", 
  "Science & Technology",
  "Personal Development",
];

export function KnowledgeStream({ user }: KnowledgeStreamProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [contentModules, setContentModules] = useState(sampleContentModules);

  const filteredModules = contentModules.filter((module) => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.sourceExpert.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getOverallProgress = () => {
    const completedModules = contentModules.filter(m => m.progress?.status === "youdo_complete").length;
    const totalModules = contentModules.length;
    return totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
  };

  const getTotalScore = () => {
    return contentModules.reduce((sum, module) => sum + (module.progress?.score || 0), 0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user.email.split('@')[0]}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Continue your personalized learning journey
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Content</span>
              </Button>
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Knowledge Stream */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filter */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search topics, experts, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Content Cards */}
            <div className="space-y-4">
              {filteredModules.length > 0 ? (
                filteredModules.map((module) => (
                  <KnowledgeCard
                    key={module.id}
                    id={module.id}
                    title={module.title}
                    sourceExpert={module.sourceExpert}
                    category={module.category}
                    difficulty={module.difficulty}
                    estimatedTime={module.estimatedTime}
                    description={module.description}
                    progress={module.progress}
                    isUserGenerated={module.isUserGenerated}
                    userCreator={module.userCreator}
                    peerReviews={module.peerReviews}
                    rating={module.rating}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No content found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.email.split('@')[0].charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>Your Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {getOverallProgress().toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={getOverallProgress()} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {getTotalScore()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Points
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-accent">
                      {contentModules.filter(m => m.progress?.status === "youdo_complete").length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Completed
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Learning Preferences</div>
                  <Badge variant="outline" className="text-xs">
                    {user.difficultyPreference}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    Age: {user.age} years
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Continue Learning
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Trophy className="h-4 w-4 mr-2" />
                  View Achievements
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Community
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 