
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Play, Target, ArrowRight } from "lucide-react";

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  textColor: string;
  lessons: number;
  duration: string;
  difficulty: string;
}

interface TrainingModuleCardProps {
  module: TrainingModule;
  isCompleted: boolean;
  progress: number;
  onSelect: (moduleId: string) => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-100 text-green-800';
    case 'Intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'Advanced':
      return 'bg-orange-100 text-orange-800';
    case 'Expert':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const TrainingModuleCard = ({ module, isCompleted, progress, onSelect }: TrainingModuleCardProps) => {
  return (
    <Card 
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1"
      onClick={() => onSelect(module.id)}
    >
      <CardHeader className={`${module.bgColor} rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${module.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <module.icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge className={getDifficultyColor(module.difficulty)}>
              {module.difficulty}
            </Badge>
            {isCompleted && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Complete
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="text-lg mb-2 group-hover:text-purple-600 transition-colors">
          {module.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-2">
          {module.description}
        </CardDescription>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-500">
            <span>{module.lessons} scenarios</span>
            <span>{module.duration}</span>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-600">
                {isCompleted ? 'Best Score' : 'Progress'}
              </span>
              <span className="text-xs text-gray-500">
                {isCompleted ? `${Math.round(progress)}%` : '0%'}
              </span>
            </div>
            <Progress 
              value={isCompleted ? progress : 0} 
              className="h-1.5" 
            />
          </div>
          
          <div className="flex items-center justify-between pt-2">
            {isCompleted ? (
              <div className="flex items-center text-green-600">
                <Target className="w-4 h-4 mr-1" />
                <span className="text-xs font-medium">Retake</span>
              </div>
            ) : (
              <div className="flex items-center text-purple-600">
                <Play className="w-4 h-4 mr-1" />
                <span className="text-xs font-medium">Start Training</span>
              </div>
            )}
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingModuleCard;
