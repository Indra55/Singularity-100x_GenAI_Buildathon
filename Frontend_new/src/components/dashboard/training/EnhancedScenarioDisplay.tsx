import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, Lightbulb, Star, Zap, Target, HelpCircle, AlertTriangle } from "lucide-react";
import { TrainingScenario } from "./trainingData";

interface EnhancedScenarioDisplayProps {
  scenario: TrainingScenario;
  onAnswerSelect: (answer: number, confidence: number) => void;
  onHintRequest: () => void;
  hintsUsed: number;
  timeRemaining: number | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

const EnhancedScenarioDisplay = ({
  scenario,
  onAnswerSelect,
  onHintRequest,
  hintsUsed,
  timeRemaining,
  currentQuestionIndex,
  totalQuestions,
  difficulty
}: EnhancedScenarioDisplayProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [confidenceLevel, setConfidenceLevel] = useState<number>(3);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setConfidenceLevel(3);
    setShowHint(false);
  }, [scenario]);

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600';
      case 'intermediate': return 'text-yellow-600';
      case 'advanced': return 'text-red-600';
      case 'expert': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getTimeWarningLevel = () => {
    if (!timeRemaining || !scenario.timeLimit) return null;
    const percentage = (timeRemaining / scenario.timeLimit) * 100;
    if (percentage <= 25) return 'critical';
    if (percentage <= 50) return 'warning';
    return 'normal';
  };

  const timeWarning = getTimeWarningLevel();

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      onAnswerSelect(selectedAnswer, confidenceLevel);
    }
  };

  const handleHintClick = () => {
    setShowHint(true);
    onHintRequest();
  };

  return (
    <div className="space-y-6">
      {/* Progress and Stats Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`${getDifficultyColor()} border-current`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
          
          {timeRemaining !== null && scenario.timeLimit && (
            <div className={`flex items-center gap-2 ${
              timeWarning === 'critical' ? 'text-red-600' : 
              timeWarning === 'warning' ? 'text-yellow-600' : 'text-blue-600'
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-bold">{timeRemaining}s</span>
              {timeWarning === 'critical' && <AlertTriangle className="w-4 h-4" />}
            </div>
          )}
        </div>
        
        <Progress 
          value={((currentQuestionIndex + 1) / totalQuestions) * 100} 
          className="h-2"
        />
      </div>

      {/* Main Question Card */}
      <Card className="border-2 border-blue-100 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl leading-relaxed text-gray-800">
            {scenario.question}
          </CardTitle>
          {scenario.context && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-700 leading-relaxed">{scenario.context}</p>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Answer Options */}
          <RadioGroup 
            value={selectedAnswer?.toString()} 
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            className="space-y-3"
          >
            {scenario.options?.map((option, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer leading-relaxed">
                  <span className="font-medium text-blue-700 mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* Confidence Level */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              <label className="font-medium text-gray-700">
                Confidence Level: {confidenceLevel}/5
              </label>
            </div>
            <Slider
              value={[confidenceLevel]}
              onValueChange={(value) => setConfidenceLevel(value[0])}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Not sure</span>
              <span>Very confident</span>
            </div>
          </div>

          {/* Hint Section */}
          <div className="border-t pt-4">
            {!showHint ? (
              <Button
                variant="outline"
                onClick={handleHintClick}
                className="flex items-center gap-2 text-amber-600 border-amber-200 hover:bg-amber-50"
                disabled={!scenario.hint}
              >
                <Lightbulb className="w-4 h-4" />
                Need a hint? ({hintsUsed} used)
              </Button>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Hint:</span>
                </div>
                <p className="text-amber-700">{scenario.hint}</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Zap className="w-5 h-5 mr-2" />
            Submit Answer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedScenarioDisplay;
