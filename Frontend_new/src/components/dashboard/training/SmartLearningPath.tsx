
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Circle, 
  Lock, 
  Play, 
  Star, 
  Clock, 
  Target,
  Brain,
  Lightbulb,
  Award,
  TrendingUp,
  BookOpen,
  Users,
  MessageSquare
} from "lucide-react";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'completed' | 'current' | 'locked';
  progress: number;
  skills: string[];
  icon: any;
}

interface SmartLearningPathProps {
  onModuleSelect: (moduleId: string) => void;
}

const SmartLearningPath = ({ onModuleSelect }: SmartLearningPathProps) => {
  const [selectedTrack, setSelectedTrack] = useState('technical');

  const learningModules: Record<string, LearningModule[]> = {
    technical: [
      {
        id: 'basics',
        title: 'Interview Fundamentals',
        description: 'Master the core principles of technical interviews',
        duration: '30 min',
        difficulty: 'Beginner',
        status: 'completed',
        progress: 100,
        skills: ['Communication', 'Problem Solving', 'Confidence'],
        icon: BookOpen
      },
      {
        id: 'coding',
        title: 'Live Coding Practice',
        description: 'Practice coding problems in real-time scenarios',
        duration: '45 min',
        difficulty: 'Intermediate',
        status: 'current',
        progress: 65,
        skills: ['Algorithms', 'Data Structures', 'Code Quality'],
        icon: Brain
      },
      {
        id: 'system-design',
        title: 'System Design Interviews',
        description: 'Learn to design scalable systems effectively',
        duration: '60 min',
        difficulty: 'Advanced',
        status: 'locked',
        progress: 0,
        skills: ['Architecture', 'Scalability', 'Trade-offs'],
        icon: Target
      }
    ],
    behavioral: [
      {
        id: 'storytelling',
        title: 'STAR Method Mastery',
        description: 'Structure compelling responses using STAR framework',
        duration: '25 min',
        difficulty: 'Beginner',
        status: 'completed',
        progress: 100,
        skills: ['Storytelling', 'Structure', 'Impact'],
        icon: MessageSquare
      },
      {
        id: 'leadership',
        title: 'Leadership Scenarios',
        description: 'Navigate complex leadership and team situations',
        duration: '35 min',
        difficulty: 'Intermediate',
        status: 'current',
        progress: 40,
        skills: ['Leadership', 'Conflict Resolution', 'Team Building'],
        icon: Users
      },
      {
        id: 'culture-fit',
        title: 'Culture & Values Alignment',
        description: 'Demonstrate cultural fit and value alignment',
        duration: '20 min',
        difficulty: 'Intermediate',
        status: 'locked',
        progress: 0,
        skills: ['Cultural Awareness', 'Values', 'Authenticity'],
        icon: Star
      }
    ]
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'current': return <Play className="w-5 h-5 text-blue-600" />;
      case 'locked': return <Lock className="w-5 h-5 text-gray-400" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-4 lg:space-y-6">
        {/* Header - Mobile Optimized */}
        <Card className="shadow-xl">
          <CardHeader className="p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-indigo-600" />
                  Smart Learning Path
                </CardTitle>
                <CardDescription className="text-sm lg:text-base mt-1">
                  AI-powered personalized interview training curriculum
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 lg:gap-4">
                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1">
                  <Award className="w-3 h-3 mr-1" />
                  Level 2
                </Badge>
                <div className="text-right">
                  <div className="text-lg lg:text-2xl font-bold text-indigo-600">67%</div>
                  <div className="text-xs lg:text-sm text-gray-500">Overall Progress</div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Track Selection - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row gap-2 lg:gap-4">
          <Button
            variant={selectedTrack === 'technical' ? 'default' : 'outline'}
            onClick={() => setSelectedTrack('technical')}
            className="flex-1 justify-center py-2 lg:py-3"
          >
            <Brain className="w-4 h-4 mr-2" />
            Technical Track
          </Button>
          <Button
            variant={selectedTrack === 'behavioral' ? 'default' : 'outline'}
            onClick={() => setSelectedTrack('behavioral')}
            className="flex-1 justify-center py-2 lg:py-3"
          >
            <Users className="w-4 h-4 mr-2" />
            Behavioral Track
          </Button>
        </div>

        {/* Learning Modules Grid - Mobile First */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {learningModules[selectedTrack].map((module, index) => (
            <Card 
              key={module.id} 
              className={`shadow-lg hover:shadow-xl transition-all duration-300 ${
                module.status === 'locked' ? 'opacity-60' : 'hover:-translate-y-1'
              }`}
            >
              <CardHeader className="p-4 lg:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className={`p-2 lg:p-3 rounded-lg ${
                      module.status === 'completed' ? 'bg-green-100' :
                      module.status === 'current' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <module.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${
                        module.status === 'completed' ? 'text-green-600' :
                        module.status === 'current' ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                    </div>
                    {getStatusIcon(module.status)}
                  </div>
                  <Badge className={`text-xs px-2 py-1 ${getDifficultyColor(module.difficulty)}`}>
                    {module.difficulty}
                  </Badge>
                </div>
                
                <CardTitle className="text-lg lg:text-xl mb-2">{module.title}</CardTitle>
                <CardDescription className="text-sm lg:text-base leading-relaxed">
                  {module.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 lg:p-6 pt-0">
                <div className="space-y-4">
                  {/* Progress Bar */}
                  {module.status !== 'locked' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>
                  )}

                  {/* Skills Tags - Mobile Responsive */}
                  <div className="flex flex-wrap gap-1 lg:gap-2">
                    {module.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs px-2 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Module Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{module.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />
                      <span>{module.skills.length} skills</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => onModuleSelect(module.id)}
                    disabled={module.status === 'locked'}
                    className="w-full py-2 lg:py-3"
                    variant={module.status === 'current' ? 'default' : 'outline'}
                  >
                    {module.status === 'completed' && (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Review Module
                      </>
                    )}
                    {module.status === 'current' && (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Continue Learning
                      </>
                    )}
                    {module.status === 'locked' && (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Unlock Next
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Summary - Mobile Optimized */}
        <Card className="shadow-xl">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-lg lg:text-xl">Your Learning Journey</CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-1">2</div>
                <div className="text-sm lg:text-base text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-1">2</div>
                <div className="text-sm lg:text-base text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-purple-600 mb-1">12</div>
                <div className="text-sm lg:text-base text-gray-600">Skills Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-indigo-600 mb-1">8.5h</div>
                <div className="text-sm lg:text-base text-gray-600">Time Invested</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmartLearningPath;
