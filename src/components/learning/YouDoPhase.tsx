"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle, Upload, Share2, Camera, FileText, Clock, Users } from "lucide-react";

interface YouDoPhaseProps {
  challenge: string;
  title: string;
  moduleId: string;
  isComplete: boolean;
  onComplete: (score: number) => void;
}

export function YouDoPhase({ challenge, title, moduleId, isComplete, onComplete }: YouDoPhaseProps) {
  const [creationType, setCreationType] = useState<"video" | "text" | null>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleTypeSelection = (type: "video" | "text") => {
    setCreationType(type);
    setContent("");
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate API call
      const response = await fetch("/api/creations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moduleId,
          contentType: creationType,
          content,
        }),
      });

      clearInterval(interval);
      setUploadProgress(100);

      if (response.ok) {
        // Calculate score based on content quality (simplified)
        const score = Math.max(50, Math.min(100, content.length * 0.5));
        onComplete(Math.round(score));
      } else {
        throw new Error("Failed to submit creation");
      }
    } catch (error) {
      console.error("Error submitting creation:", error);
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = () => {
    return creationType && content.trim().length > 50;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">You Do: Apply & Create</CardTitle>
                <CardDescription>
                  Time to apply what you've learned and share with the community
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
        </CardHeader>
      </Card>

      {/* Challenge Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Target className="h-5 w-5 text-accent" />
            <span>Your Challenge</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">
            {challenge}
          </p>
          
          <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Recommended Time: 7-14 days</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Sharing encouraged for maximum learning</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Type Selection */}
      {!creationType && !isComplete && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Choose Your Creation Format</CardTitle>
            <CardDescription>
              Select how you'd like to share your learning experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className="cursor-pointer hover:bg-accent/50 transition-colors border-2 hover:border-primary"
                onClick={() => handleTypeSelection("video")}
              >
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto">
                      <Camera className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">Video Creation</h3>
                    <p className="text-sm text-muted-foreground">
                      Record yourself explaining the concept or demonstrating your experiment
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      Higher engagement • 150 pts max
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer hover:bg-accent/50 transition-colors border-2 hover:border-primary"
                onClick={() => handleTypeSelection("text")}
              >
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">Written Post</h3>
                    <p className="text-sm text-muted-foreground">
                      Write about your experience, insights, and what you learned
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      Quick to create • 100 pts max
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Creation */}
      {creationType && !isComplete && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center space-x-2">
                {creationType === "video" ? (
                  <Camera className="h-5 w-5 text-primary" />
                ) : (
                  <FileText className="h-5 w-5 text-primary" />
                )}
                <span>
                  {creationType === "video" ? "Video Creation" : "Written Post"}
                </span>
              </CardTitle>
              <Button
                variant="outline"
                onClick={() => setCreationType(null)}
                size="sm"
              >
                Change Format
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {creationType === "video" ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Record your video explaining your learning experience
                  </p>
                  <Button className="mb-4">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: MP4, MOV, AVI (max 100MB)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Video Description</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe your video content, key insights, and what others can learn from your experience..."
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    {content.length}/500 characters (minimum 50 required)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Learning Experience</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your experiment, insights, challenges, and what you learned. Be specific about what worked and what didn't..."
                    className="min-h-[200px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    {content.length}/1000 characters (minimum 50 required)
                  </p>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">💡 Tips for a great post:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Share specific examples and outcomes</li>
                    <li>• Mention what surprised you</li>
                    <li>• Include challenges you faced</li>
                    <li>• Explain how you'll apply this going forward</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {isSubmitting && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uploading your creation...</span>
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      {creationType && !isComplete && (
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit() || isSubmitting}
            size="lg"
            className="flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                <span>Share with Community</span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* Completion Summary */}
      {isComplete && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="text-4xl">🎉</div>
              <h3 className="text-xl font-semibold">Congratulations!</h3>
              <p className="text-muted-foreground">
                You've successfully completed all three phases of "{title}". 
                Your creation has been shared with the community to help others learn.
              </p>
              <div className="flex items-center justify-center space-x-4 mt-4">
                <Badge variant="secondary">Phase Complete</Badge>
                <Badge variant="outline">Points Earned</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 