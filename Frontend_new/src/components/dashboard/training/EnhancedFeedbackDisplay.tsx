
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, X, ArrowRight, AlertTriangle, Lightbulb, Target, Clock, TrendingUp } from "lucide-react";
import { TrainingScenario } from "./trainingData";

interface EnhancedFeedbackDisplayProps {
  scenario: TrainingScenario;
  selectedAnswer: number | null;
  confidenceLevel: number | null;
  isCorrect: boolean;
  isLastScenario: boolean;
  timeSpent: number;
  hintsUsed: number;
  performanceData: {
    accuracy: number;
    speed: number;
    consistency: number;
  };
  onNextScenario: () => void;
}

const EnhancedFeedbackDisplay = ({
  scenario,
  selectedAnswer,
  confidenceLevel,
  isCorrect,
  isLastScenario,
  timeSpent,
  hintsUsed,
  performanceData,
  onNextScenario
}: EnhancedFeedbackDisplayProps) => {
  const getTimePerformance = () => {
    if (!scenario.timeLimit) return null;
    const efficiency = (scenario.timeLimit - timeSpent) / scenario.timeLimit;
    if (efficiency > 0.5) return { level: 'excellent', color: 'text-green-600', label: 'Lightning Fast' };
    if (efficiency > 0.2) return { level: 'good', color: 'text-blue-600', label: 'Good Timing' };
    if (efficiency > 0) return { level: 'okay', color: 'text-yellow-600', label: 'Just in Time' };
    return { level: 'slow', color: 'text-red-600', label: 'Too Slow' };
  };

  const timePerformance = getTimePerformance();

  const getConfidenceAnalysis = () => {
    if (!confidenceLevel) return null;
    
    if (isCorrect && confidenceLevel >= 4) {
      return { message: "Perfect! You were confident and correct.", color: "text-green-700" };
    } else if (isCorrect && confidenceLevel <= 2) {
      return { message: "You got it right but seemed unsure. Trust your instincts!", color: "text-blue-700" };
    } else if (!isCorrect && confidenceLevel >= 4) {
      return { message: "Overconfidence alert! Review the fundamentals.", color: "text-red-700" };
    } else if (!isCorrect && confidenceLevel <= 2) {
      return { message: "Your uncertainty was justified. Study this topic more.", color: "text-yellow-700" };
    }
    return null;
  };

  const confidenceAnalysis = getConfidenceAnalysis();

  return (
    <div className="space-y-6">
      {/* Main Feedback Card */}
      <div className={`relative p-6 rounded-xl border-2 overflow-hidden ${
        isCorrect
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
          : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {isCorrect ? (
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                <X className="w-7 h-7 text-white" />
              </div>
            )}
            <div>
              <span className={`font-bold text-2xl ${
                isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {isCorrect ? 'Excellent!' : 'Not Quite'}
              </span>
              <div className="flex gap-2 mt-1">
                {confidenceLevel && (
                  <Badge variant="outline" className="text-xs">
                    Confidence: {confidenceLevel}/5
                  </Badge>
                )}
                {timePerformance && (
                  <Badge variant="outline" className={`text-xs ${timePerformance.color}`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {timePerformance.label}
                  </Badge>
                )}
                {hintsUsed > 0 && (
                  <Badge variant="outline" className="text-xs text-yellow-700">
                    <Lightbulb className="w-3 h-3 mr-1" />
                    {hintsUsed} hint{hintsUsed > 1 ? 's' : ''} used
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <p className={`leading-relaxed text-lg mb-4 ${
          isCorrect ? 'text-green-700' : 'text-red-700'
        }`}>
          {isCorrect 
            ? scenario.feedback.correct 
            : scenario.feedback.incorrect
          }
        </p>
        
        {!isCorrect && (
          <div className="mt-4 pt-4 border-t border-red-200">
            <p className="text-red-800 font-semibold mb-2">
              Correct answer: Option {String.fromCharCode(65 + (scenario.correctAnswer || 0))}
            </p>
            <p className="text-red-700 bg-red-100 p-3 rounded-lg">
              {scenario.options?.[scenario.correctAnswer || 0]}
            </p>
          </div>
        )}

        {/* Confidence Analysis */}
        {confidenceAnalysis && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center mb-2">
              <Target className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-semibold text-gray-800">Confidence Analysis</span>
            </div>
            <p className={confidenceAnalysis.color}>{confidenceAnalysis.message}</p>
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Accuracy</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{performanceData.accuracy}%</div>
          <Progress value={performanceData.accuracy} className="h-2 mt-2" />
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Speed</span>
            <Clock className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{performanceData.speed}%</div>
          <Progress value={performanceData.speed} className="h-2 mt-2" />
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Consistency</span>
            <Target className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{performanceData.consistency}%</div>
          <Progress value={performanceData.consistency} className="h-2 mt-2" />
        </div>
      </div>

      {/* Enhanced Tips Section */}
      {scenario.tips && scenario.tips.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-5">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center mr-3">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-amber-900 text-lg">Pro Tips for Future Interviews</span>
          </div>
          <div className="space-y-3">
            {scenario.tips.map((tip, index) => (
              <div key={index} className="flex items-start bg-white bg-opacity-50 p-3 rounded-lg">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-amber-800 leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Next Button */}
      <Button 
        onClick={onNextScenario}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isLastScenario ? (
          <>
            Complete Training & See Results
            <CheckCircle className="w-5 h-5 ml-2" />
          </>
        ) : (
          <>
            Continue to Next Scenario 
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};

export default EnhancedFeedbackDisplay;
