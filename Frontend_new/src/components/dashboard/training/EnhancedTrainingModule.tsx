
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Target, Clock, Brain } from "lucide-react";
import { TrainingScenario } from "./trainingData";
import EnhancedScenarioDisplay from "./EnhancedScenarioDisplay";
import EnhancedFeedbackDisplay from "./EnhancedFeedbackDisplay";
import RealTimePerformanceWidget from "./RealTimePerformanceWidget";
import CompletionScreen from "./CompletionScreen";

interface EnhancedTrainingModuleProps {
  module: {
    id: string;
    title: string;
    description: string;
    scenarios: TrainingScenario[];
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };
  onBack: () => void;
}

const EnhancedTrainingModule = ({ module, onBack }: EnhancedTrainingModuleProps) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [confidenceLevel, setConfidenceLevel] = useState<number | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0,
    totalTime: 0,
    totalHints: 0,
    confidence: [] as number[]
  });

  const currentScenario = module.scenarios[currentScenarioIndex];
  const isLastScenario = currentScenarioIndex === module.scenarios.length - 1;

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
  
    const startTimer = () => {
      intervalId = setInterval(() => {
        setTimeSpent((prevTime) => prevTime + 1);
      }, 1000);
    };
  
    if (!showFeedback && !isCompleted) {
      startTimer();
    }
  
    return () => clearInterval(intervalId);
  }, [showFeedback, isCompleted]);

  useEffect(() => {
    if (currentScenario?.timeLimit && !showFeedback && !isCompleted) {
      setTimeRemaining(currentScenario.timeLimit);
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            if (selectedAnswer !== null && confidenceLevel !== null) {
              handleAnswerSubmit(selectedAnswer, confidenceLevel);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentScenarioIndex, showFeedback, isCompleted, selectedAnswer, confidenceLevel]);

  const calculatePerformanceData = () => {
    const accuracy = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0;
    const avgTime = sessionStats.total > 0 ? Math.round(sessionStats.totalTime / sessionStats.total) : 0;
    const avgConfidence = sessionStats.confidence.length > 0 
      ? Math.round(sessionStats.confidence.reduce((a, b) => a + b, 0) / sessionStats.confidence.length) 
      : 3;

    return {
      accuracy,
      averageTime: avgTime,
      streak,
      hintsUsed: sessionStats.totalHints,
      confidence: avgConfidence,
      difficulty: module.difficulty,
      speed: Math.max(0, 100 - (avgTime > 30 ? 50 : (avgTime / 30) * 50)),
      consistency: Math.max(0, 100 - (sessionStats.totalHints * 10))
    };
  };

  const handleAnswerSubmit = (answer: number, confidence: number) => {
    setSelectedAnswer(answer);
    setConfidenceLevel(confidence);
    
    const isCorrect = answer === currentScenario.correctAnswer;
    
    setSessionStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
      totalTime: prev.totalTime + timeSpent,
      totalHints: prev.totalHints + hintsUsed,
      confidence: [...prev.confidence, confidence]
    }));

    if (isCorrect) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setShowFeedback(true);
  };

  const handleNextScenario = () => {
    if (isLastScenario) {
      setIsCompleted(true);
    } else {
      setCurrentScenarioIndex(prev => prev + 1);
      setShowFeedback(false);
      setSelectedAnswer(null);
      setConfidenceLevel(null);
      setTimeSpent(0);
      setHintsUsed(0);
    }
  };

  const handleHintRequest = () => {
    setHintsUsed(prev => prev + 1);
  };

  const performanceData = calculatePerformanceData();

  if (isCompleted) {
    return (
      <CompletionScreen
        moduleTitle={module.title}
        finalScore={performanceData.accuracy}
        detailedScore={{
          correct: sessionStats.correct,
          points: sessionStats.correct * 10,
          timeBonus: Math.max(0, 50 - performanceData.averageTime)
        }}
        timeSpent={sessionStats.totalTime}
        scenarios={module.scenarios}
        streakCorrect={streak}
        hintsUsed={sessionStats.totalHints}
        onRestart={() => {
          setCurrentScenarioIndex(0);
          setShowFeedback(false);
          setIsCompleted(false);
          setSelectedAnswer(null);
          setConfidenceLevel(null);
          setTimeSpent(0);
          setHintsUsed(0);
          setStreak(0);
          setSessionStats({ correct: 0, total: 0, totalTime: 0, totalHints: 0, confidence: [] });
        }}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Modules
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">{module.title}</h1>
            <p className="text-gray-600 mt-1">{module.description}</p>
          </div>
          
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            {module.difficulty.charAt(0).toUpperCase() + module.difficulty.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {!showFeedback ? (
              <EnhancedScenarioDisplay
                scenario={currentScenario}
                onAnswerSelect={handleAnswerSubmit}
                onHintRequest={handleHintRequest}
                hintsUsed={hintsUsed}
                timeRemaining={timeRemaining}
                currentQuestionIndex={currentScenarioIndex}
                totalQuestions={module.scenarios.length}
                difficulty={module.difficulty}
              />
            ) : (
              <EnhancedFeedbackDisplay
                scenario={currentScenario}
                selectedAnswer={selectedAnswer}
                confidenceLevel={confidenceLevel}
                isCorrect={selectedAnswer === currentScenario.correctAnswer}
                isLastScenario={isLastScenario}
                timeSpent={timeSpent}
                hintsUsed={hintsUsed}
                performanceData={performanceData}
                onNextScenario={handleNextScenario}
              />
            )}
          </div>

          {/* Sidebar with Real-time Analytics */}
          <div className="lg:col-span-1">
            <RealTimePerformanceWidget
              accuracy={performanceData.accuracy}
              averageTime={performanceData.averageTime}
              streak={streak}
              hintsUsed={sessionStats.totalHints}
              confidence={performanceData.confidence}
              difficulty={module.difficulty}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTrainingModule;
