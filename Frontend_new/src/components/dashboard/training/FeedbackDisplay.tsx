
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X, ArrowRight, AlertTriangle } from "lucide-react";
import { TrainingScenario } from "./trainingData";

interface FeedbackDisplayProps {
  scenario: TrainingScenario;
  selectedAnswer: number | null;
  confidenceLevel: number | null;
  isCorrect: boolean;
  isLastScenario: boolean;
  onNextScenario: () => void;
}

const FeedbackDisplay = ({
  scenario,
  selectedAnswer,
  confidenceLevel,
  isCorrect,
  isLastScenario,
  onNextScenario
}: FeedbackDisplayProps) => {
  return (
    <div className="space-y-4">
      <div className={`p-5 rounded-lg border-2 ${
        isCorrect
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center mb-3">
          {isCorrect ? (
            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
          ) : (
            <X className="w-6 h-6 text-red-600 mr-3" />
          )}
          <span className={`font-bold text-lg ${
            isCorrect ? 'text-green-800' : 'text-red-800'
          }`}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </span>
          {confidenceLevel && (
            <Badge variant="outline" className="ml-auto">
              Confidence: {confidenceLevel}/5
            </Badge>
          )}
        </div>
        <p className={`leading-relaxed ${
          isCorrect ? 'text-green-700' : 'text-red-700'
        }`}>
          {isCorrect 
            ? scenario.feedback.correct 
            : scenario.feedback.incorrect
          }
        </p>
        
        {!isCorrect && (
          <div className="mt-3 pt-3 border-t border-red-200">
            <p className="text-red-800 font-medium">
              Correct answer: Option {String.fromCharCode(65 + (scenario.correctAnswer || 0))}
            </p>
            <p className="text-red-700 text-sm mt-1">
              {scenario.options?.[scenario.correctAnswer || 0]}
            </p>
          </div>
        )}
      </div>

      {scenario.tips && scenario.tips.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
            <span className="font-semibold text-amber-800">Pro Tips for Future Interviews:</span>
          </div>
          <ul className="space-y-2">
            {scenario.tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-amber-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button 
        onClick={onNextScenario}
        className="w-full bg-pulse-500 hover:bg-pulse-600 text-lg py-3"
      >
        {isLastScenario ? (
          <>
            Complete Training
            <CheckCircle className="w-5 h-5 ml-2" />
          </>
        ) : (
          <>
            Next Scenario 
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};

export default FeedbackDisplay;
