
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Target, 
  Zap, 
  TrendingUp, 
  Lightbulb, 
  BookOpen, 
  RotateCcw, 
  Clock 
} from "lucide-react";

interface CompletionScreenProps {
  moduleTitle: string;
  finalScore: number;
  detailedScore: {
    correct: number;
    points: number;
    timeBonus: number;
  };
  timeSpent: number;
  scenarios: any[];
  streakCorrect: number;
  hintsUsed: number;
  onRestart: () => void;
  onBack: () => void;
}

const CompletionScreen = ({
  moduleTitle,
  finalScore,
  detailedScore,
  timeSpent,
  scenarios,
  streakCorrect,
  hintsUsed,
  onRestart,
  onBack
}: CompletionScreenProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          ← Back to Training Modules
        </Button>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Completed in {formatTime(timeSpent)}</span>
        </div>
      </div>

      <Card className="text-center border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <Award className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl">Enhanced Training Complete!</CardTitle>
          <CardDescription className="text-lg">{moduleTitle}</CardDescription>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge className="bg-green-100 text-green-800 px-3 py-1">
              <Target className="w-4 h-4 mr-1" />
              {finalScore.toFixed(0)}% Accuracy
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              <Zap className="w-4 h-4 mr-1" />
              {detailedScore.points + detailedScore.timeBonus} Points
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          {/* Enhanced Performance Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600">{detailedScore.correct}</div>
              <div className="text-sm text-green-700">Correct Answers</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">{detailedScore.points}</div>
              <div className="text-sm text-blue-700">Base Points</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">{detailedScore.timeBonus}</div>
              <div className="text-sm text-purple-700">Time Bonus</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="text-3xl font-bold text-orange-600">{streakCorrect}</div>
              <div className="text-sm text-orange-700">Max Streak</div>
            </div>
          </div>

          {/* Performance Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Performance Analysis
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Average Response Time:</span>
                  <span className="font-medium">{formatTime(Math.round(timeSpent / scenarios.length))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hints Used:</span>
                  <span className="font-medium">{hintsUsed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Difficulty Level:</span>
                  <span className="font-medium capitalize">{scenarios[0]?.difficulty || 'Intermediate'}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                Key Insights
              </h4>
              <div className="space-y-2 text-sm text-yellow-800">
                {finalScore >= 90 && <p>• Exceptional mastery of concepts</p>}
                {detailedScore.timeBonus > 20 && <p>• Excellent time management</p>}
                {streakCorrect >= 3 && <p>• Strong consistency in performance</p>}
                {hintsUsed === 0 && <p>• Independent problem-solving</p>}
                {hintsUsed > scenarios.length / 2 && <p>• Consider reviewing fundamentals</p>}
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={onRestart} variant="outline" className="flex items-center">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Training
            </Button>
            <Button onClick={onBack} className="bg-gradient-to-r from-blue-500 to-purple-600">
              <BookOpen className="w-4 h-4 mr-2" />
              Continue Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletionScreen;
