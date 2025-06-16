
import React from "react";
import TrainingModuleCard from "./TrainingModuleCard";
import { 
  Brain, 
  Eye, 
  DollarSign, 
  Users, 
  Code, 
  MessageCircle, 
  AlertTriangle, 
  Clock, 
  Video, 
  Heart
} from "lucide-react";

interface ModuleProgressData {
  completed: boolean;
  score: number;
  completedAt: string;
}

interface ModuleProgressState {
  [moduleId: string]: ModuleProgressData;
}

interface TrainingModulesListProps {
  moduleProgress: ModuleProgressState;
  onModuleSelect: (moduleId: string) => void;
}

const trainingModulesList = [
  {
    id: 'question-mastery',
    title: 'Question Mastery Training',
    description: 'Practice asking better questions, avoiding illegal ones, and following up effectively',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    lessons: 12,
    duration: '45 min',
    difficulty: 'Intermediate'
  },
  {
    id: 'bias-detection',
    title: 'Bias Detection Training',
    description: 'Learn to recognize and eliminate unconscious bias during interviews',
    icon: Eye,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    lessons: 8,
    duration: '35 min',
    difficulty: 'Advanced'
  },
  {
    id: 'salary-negotiation',
    title: 'Salary Negotiation Training',
    description: 'Practice handling salary discussions, counteroffers, and compensation conversations',
    icon: DollarSign,
    color: 'from-green-500 to-teal-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    lessons: 10,
    duration: '40 min',
    difficulty: 'Intermediate'
  },
  {
    id: 'candidate-psychology',
    title: 'Candidate Psychology Training',
    description: 'Read body language, detect stress signals, and adapt interview style accordingly',
    icon: Users,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    lessons: 15,
    duration: '60 min',
    difficulty: 'Advanced'
  },
  {
    id: 'technical-interview',
    title: 'Technical Interview Training',
    description: 'Practice conducting coding interviews, whiteboarding sessions, and technical assessments',
    icon: Code,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    lessons: 18,
    duration: '75 min',
    difficulty: 'Expert'
  },
  {
    id: 'rejection-delivery',
    title: 'Rejection Delivery Training',
    description: 'Learn to give constructive feedback and maintain positive candidate experience',
    icon: MessageCircle,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600',
    lessons: 6,
    duration: '25 min',
    difficulty: 'Beginner'
  },
  {
    id: 'difficult-candidate',
    title: 'Difficult Candidate Training',
    description: 'Handle overconfident, nervous, hostile, or unprepared candidates professionally',
    icon: AlertTriangle,
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    lessons: 14,
    duration: '50 min',
    difficulty: 'Advanced'
  },
  {
    id: 'time-management',
    title: 'Time Management Training',
    description: 'Keep interviews on track, cover all topics, and manage multiple back-to-back sessions',
    icon: Clock,
    color: 'from-teal-500 to-green-500',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-600',
    lessons: 9,
    duration: '30 min',
    difficulty: 'Intermediate'
  },
  {
    id: 'remote-interview',
    title: 'Remote Interview Training',
    description: 'Master video interview techniques, engagement strategies, and technical troubleshooting',
    icon: Video,
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-600',
    lessons: 11,
    duration: '45 min',
    difficulty: 'Intermediate'
  },
  {
    id: 'cultural-fit',
    title: 'Cultural Fit Assessment Training',
    description: 'Evaluate soft skills, team dynamics, and company culture alignment without bias',
    icon: Heart,
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-600',
    lessons: 13,
    duration: '55 min',
    difficulty: 'Advanced'
  }
];

const TrainingModulesList = ({ moduleProgress, onModuleSelect }: TrainingModulesListProps) => {
  const getModuleProgress = (moduleId: string): number => {
    return moduleProgress[moduleId]?.score || 0;
  };

  const isModuleCompleted = (moduleId: string): boolean => {
    return moduleProgress[moduleId]?.completed || false;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trainingModulesList.map((module) => (
        <TrainingModuleCard
          key={module.id}
          module={module}
          isCompleted={isModuleCompleted(module.id)}
          progress={getModuleProgress(module.id)}
          onSelect={onModuleSelect}
        />
      ))}
    </div>
  );
};

export default TrainingModulesList;
export { trainingModulesList };
