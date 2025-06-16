
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Clock, Brain, Zap, AlertTriangle } from "lucide-react";

interface RealTimePerformanceWidgetProps {
  accuracy: number;
  averageTime: number;
  streak: number;
  hintsUsed: number;
  confidence: number;
  difficulty: string;
}

const RealTimePerformanceWidget = ({
  accuracy,
  averageTime,
  streak,
  hintsUsed,
  confidence,
  difficulty
}: RealTimePerformanceWidgetProps) => {
  const getPerformanceLevel = () => {
    if (accuracy >= 90) return { level: 'Expert', color: 'text-green-600', bg: 'bg-green-50' };
    if (accuracy >= 75) return { level: 'Proficient', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (accuracy >= 60) return { level: 'Learning', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'Developing', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const performance = getPerformanceLevel();

  return (
    <Card className="border-2 border-purple-100">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Live Performance Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-3 rounded-lg ${performance.bg}`}>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Current Level</span>
            <Badge className={`${performance.color} bg-transparent border-current`}>
              {performance.level}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Accuracy</span>
              <span className="text-sm font-bold">{accuracy}%</span>
            </div>
            <Progress value={accuracy} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Confidence</span>
              <span className="text-sm font-bold">{confidence}/5</span>
            </div>
            <Progress value={(confidence / 5) * 100} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-lg font-bold text-orange-600">{streak}</div>
            <div className="text-xs text-gray-600">Streak</div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-lg font-bold text-blue-600">{averageTime}s</div>
            <div className="text-xs text-gray-600">Avg Time</div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-lg font-bold text-purple-600">{hintsUsed}</div>
            <div className="text-xs text-gray-600">Hints</div>
          </div>
        </div>

        {accuracy < 70 && (
          <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-2 rounded text-sm">
            <AlertTriangle className="w-4 h-4" />
            Consider slowing down and reading questions more carefully
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimePerformanceWidget;
