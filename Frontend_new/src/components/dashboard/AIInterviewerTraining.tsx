import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrainingHeader from "./training/TrainingHeader";
import TrainingModulesList, { trainingModulesList } from "./training/TrainingModulesList";
import SimulatorTab from "./training/SimulatorTab";
import TrainingCompletionCard from "./training/TrainingCompletionCard";
import EnhancedTrainingModule from "./training/EnhancedTrainingModule";
import PerformanceAnalytics from "./training/PerformanceAnalytics";
import InteractiveSimulator from "./training/InteractiveSimulator";
import AICoachAssistant from "./training/AICoachAssistant";
import { trainingModules } from "./training/trainingData";
import { Brain, Video, BarChart3, Bot } from "lucide-react";
import { type User } from "@/contexts/AuthContext";

interface ModuleProgressData {
  completed: boolean;
  score: number;
  completedAt: string;
}

interface ModuleProgressState {
  [moduleId: string]: ModuleProgressData;
}

interface AIInterviewerTrainingProps {
  user?: User;
}

const AIInterviewerTraining = ({ user }: AIInterviewerTrainingProps) => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgressState>({});
  const [activeTab, setActiveTab] = useState("modules");
  const [showSimulator, setShowSimulator] = useState(false);

  const handleModuleComplete = (moduleId: string, score: number) => {
    setModuleProgress(prev => ({
      ...prev,
      [moduleId]: {
        completed: true,
        score: score,
        completedAt: new Date().toISOString()
      }
    }));
    setSelectedModule(null);
  };

  const getOverallProgress = (): number => {
    const completedModules = Object.values(moduleProgress).filter(p => p.completed).length;
    return (completedModules / trainingModulesList.length) * 100;
  };

  const completedModulesCount = Object.values(moduleProgress).filter(p => p.completed).length;

  // Mock performance data
  const performanceData = {
    overall: 85,
    categories: {
      questioning: 88,
      biasDetection: 76,
      timeManagement: 94,
      communication: 82
    },
    streak: 7,
    totalTime: 2340, // in minutes
    completedModules: completedModulesCount,
    averageScore: 83,
    improvements: [
      "Focus more on follow-up questions during technical assessments",
      "Practice handling salary negotiation scenarios",
      "Improve bias detection in cultural fit evaluations"
    ],
    achievements: [
      "Perfect Week",
      "Question Master",
      "Bias Detector",
      "Time Keeper"
    ]
  };

  if (showSimulator) {
    return (
      <InteractiveSimulator
        onComplete={(score, insights) => {
          console.log('Simulator completed:', score, insights);
          setShowSimulator(false);
        }}
        onBack={() => setShowSimulator(false)}
      />
    );
  }

  if (selectedModule) {
    const module = trainingModules[selectedModule];
    if (module) {
      return (
        <EnhancedTrainingModule
          module={module}
          onBack={() => setSelectedModule(null)}
        />
      );
    }
  }

  return (
    <div className="space-y-6">
      <TrainingHeader
        overallProgress={getOverallProgress()}
        completedModules={completedModulesCount}
        totalModules={trainingModulesList.length}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-12">
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Training Modules
          </TabsTrigger>
          <TabsTrigger value="simulator" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Live Simulator
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="coach" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            AI Coach
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-6">
          <TrainingModulesList
            moduleProgress={moduleProgress}
            onModuleSelect={setSelectedModule}
          />
        </TabsContent>

        <TabsContent value="simulator">
          <SimulatorTab onStartSimulator={() => setShowSimulator(true)} />
        </TabsContent>

        <TabsContent value="analytics">
          <PerformanceAnalytics data={performanceData} />
        </TabsContent>

        <TabsContent value="coach">
          <AICoachAssistant 
            userProgress={moduleProgress} 
            currentModule={selectedModule || undefined}
          />
        </TabsContent>
      </Tabs>
      
      <TrainingCompletionCard completedModules={completedModulesCount} />
    </div>
  );
};

export default AIInterviewerTraining;
