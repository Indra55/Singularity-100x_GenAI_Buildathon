
import React from "react";
import { Sparkles, Trophy } from "lucide-react";

interface TrainingHeaderProps {
  overallProgress: number;
  completedModules: number;
  totalModules: number;
}

const TrainingHeader = ({ overallProgress, completedModules, totalModules }: TrainingHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          AI Interviewer Training Zone
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Master the art of interviewing with AI-powered training and real-time coaching
        </p>
      </div>
      <div className="text-right">
        <div className="text-sm text-gray-500">Overall Progress</div>
        <div className="text-2xl font-bold text-purple-600">{Math.round(overallProgress)}%</div>
        <div className="flex items-center gap-2 mt-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-gray-600">
            {completedModules} / {totalModules} completed
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrainingHeader;
