
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Target, 
  Brain, 
  Clock, 
  Award, 
  Zap,
  BarChart3,
  Users,
  MessageCircle,
  AlertTriangle
} from "lucide-react";

interface PerformanceData {
  overall: number;
  categories: {
    questioning: number;
    biasDetection: number;
    timeManagement: number;
    communication: number;
  };
  streak: number;
  totalTime: number;
  completedModules: number;
  averageScore: number;
  improvements: string[];
  achievements: string[];
}

interface PerformanceAnalyticsProps {
  data: PerformanceData;
}

const PerformanceAnalytics = ({ data }: PerformanceAnalyticsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 80) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-gradient-to-r from-green-500 to-emerald-500";
    if (score >= 80) return "bg-gradient-to-r from-blue-500 to-cyan-500";
    if (score >= 70) return "bg-gradient-to-r from-yellow-500 to-orange-500";
    return "bg-gradient-to-r from-red-500 to-pink-500";
  };

  return (
    <div className="space-y-6">
      {/* Overall Performance Card */}
      <Card className="relative overflow-hidden border-0 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-pulse-500/10 via-purple-500/10 to-blue-500/10" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Brain className="w-7 h-7 text-pulse-600" />
                Performance Analytics
              </CardTitle>
              <CardDescription className="text-base">
                AI-powered insights into your interviewing skills
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-pulse-600">{data.overall}%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Streak</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{data.streak}</div>
              <div className="text-xs text-gray-600">days</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Total Time</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{Math.round(data.totalTime / 60)}h</div>
              <div className="text-xs text-gray-600">practiced</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Modules</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{data.completedModules}</div>
              <div className="text-xs text-gray-600">completed</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Avg Score</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{data.averageScore}%</div>
              <div className="text-xs text-gray-600">accuracy</div>
            </div>
          </div>

          {/* Skill Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-pulse-600" />
                Skill Breakdown
              </h3>
              
              <div className="space-y-3">
                {Object.entries(data.categories).map(([skill, score]) => (
                  <div key={skill} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">
                        {skill.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm text-gray-600">{score}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={score} className="h-2" />
                      <div 
                        className={`absolute inset-0 rounded-full ${getProgressColor(score)} opacity-80`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-pulse-600" />
                Key Improvements
              </h3>
              
              <div className="space-y-2">
                {data.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-blue-800">{improvement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-pulse-600" />
              Recent Achievements
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {data.achievements.map((achievement, index) => (
                <Badge 
                  key={index} 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-3 py-1"
                >
                  <Award className="w-3 h-3 mr-1" />
                  {achievement}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAnalytics;
