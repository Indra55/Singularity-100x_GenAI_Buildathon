
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  Award,
  Star,
  Zap,
  Brain,
  CheckCircle,
  Calendar
} from "lucide-react";

interface SkillProgress {
  name: string;
  current: number;
  target: number;
  improvement: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ProgressTrackerProps {
  overallProgress: number;
  skillProgress: SkillProgress[];
  achievements: Achievement[];
  streakDays: number;
  totalStudyTime: number;
  weeklyGoal: number;
  nextMilestone: string;
}

const ProgressTracker = ({ 
  overallProgress, 
  skillProgress, 
  achievements, 
  streakDays, 
  totalStudyTime, 
  weeklyGoal,
  nextMilestone 
}: ProgressTrackerProps) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Brain className="w-6 h-6 text-blue-600" />
            Training Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{Math.round(overallProgress)}%</div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <Zap className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{streakDays}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{formatTime(totalStudyTime)}</div>
              <div className="text-sm text-gray-600">Study Time</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{achievements.length}</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Weekly Goal Progress</span>
              <span className="text-sm text-gray-600">{totalStudyTime} / {weeklyGoal} minutes</span>
            </div>
            <Progress value={(totalStudyTime / weeklyGoal) * 100} className="h-3" />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Next Milestone:</span>
              <span className="text-blue-800">{nextMilestone}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skill Progress */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Skill Development
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillProgress.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{skill.current} / {skill.target}</span>
                    {skill.improvement > 0 && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        +{skill.improvement}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <Progress value={(skill.current / skill.target) * 100} className="h-2" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-80" 
                       style={{ width: `${(skill.current / skill.target) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {achievements.slice(0, 6).map((achievement) => (
              <div 
                key={achievement.id} 
                className={`flex items-center gap-3 p-3 rounded-lg border ${getRarityColor(achievement.rarity)}`}
              >
                <achievement.icon className="w-6 h-6 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium">{achievement.title}</div>
                  <div className="text-sm opacity-80">{achievement.description}</div>
                  <div className="text-xs opacity-70 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    {achievement.unlockedAt.toLocaleDateString()}
                  </div>
                </div>
                <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                  {achievement.rarity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;
