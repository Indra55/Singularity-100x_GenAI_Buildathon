
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Users, MessageCircle, Clock, Lightbulb } from "lucide-react";
import { TrainingScenario } from "./trainingData";

interface ScenarioDisplayProps {
  scenario: TrainingScenario;
  scenarioNumber: number;
  selectedAnswer: number | null;
  freeTextAnswer: string;
  confidenceLevel: number | null;
  showHint: boolean;
  scenarioTimeSpent: number;
  onAnswerSelect: (index: number) => void;
  onFreeTextChange: (value: string) => void;
  onConfidenceSelect: (level: number) => void;
  onHintRequest: () => void;
  onSubmitAnswer: () => void;
}

const ScenarioDisplay = ({
  scenario,
  scenarioNumber,
  selectedAnswer,
  freeTextAnswer,
  confidenceLevel,
  showHint,
  scenarioTimeSpent,
  onAnswerSelect,
  onFreeTextChange,
  onConfidenceSelect,
  onHintRequest,
  onSubmitAnswer
}: ScenarioDisplayProps) => {
  return (
    <Card className="border-2 border-pulse-100 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-pulse-700 flex items-center gap-2">
              {scenario.title}
              <Badge className={`text-xs ${
                scenario.difficulty === 'expert' ? 'bg-red-100 text-red-800' :
                scenario.difficulty === 'advanced' ? 'bg-orange-100 text-orange-800' :
                scenario.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {scenario.difficulty}
              </Badge>
            </CardTitle>
            <p className="text-gray-600 mt-1">{scenario.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-pulse-600">#{scenarioNumber}</div>
            <div className="text-xs text-gray-500">
              {scenario.points} pts • {scenario.timeLimit ? `${scenario.timeLimit}s` : 'No limit'}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Context Section */}
        {scenario.context && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Users className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-900 mb-2">Interview Context</h4>
                <p className="text-amber-800 leading-relaxed">{scenario.context}</p>
              </div>
            </div>
          </div>
        )}

        {/* Question Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">Scenario Challenge</h3>
              <p className="text-blue-800 leading-relaxed text-lg">{scenario.question}</p>
              {scenario.timeLimit && (
                <div className="mt-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    Time remaining: {Math.max(0, scenario.timeLimit - scenarioTimeSpent)}s
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Answer Options or Text Input */}
          {scenario.type === 'roleplay' ? (
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Your Response:</h4>
              <Textarea
                value={freeTextAnswer}
                onChange={(e) => onFreeTextChange(e.target.value)}
                placeholder="Type your response to this interview scenario..."
                className="min-h-[120px] text-base"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">Choose the best response:</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Select one option</span>
                  {scenario.tips && !showHint && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onHintRequest}
                      className="text-yellow-600 border-yellow-300"
                    >
                      <Lightbulb className="w-4 h-4 mr-1" />
                      Hint
                    </Button>
                  )}
                </div>
              </div>
              
              {showHint && scenario.tips && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="font-medium text-yellow-800">Hint:</span>
                  </div>
                  <p className="text-yellow-700">{scenario.tips[0]}</p>
                </div>
              )}
              
              <div className="grid gap-3">
                {scenario.options?.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedAnswer === index
                        ? 'border-pulse-500 bg-pulse-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => onAnswerSelect(index)}
                  >
                    <div className="flex items-start">
                      <div className={`w-6 h-6 rounded-full border-2 mr-4 mt-0.5 flex-shrink-0 flex items-center justify-center ${
                        selectedAnswer === index
                          ? 'border-pulse-500 bg-pulse-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswer === index && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">Option {String.fromCharCode(65 + index)}</div>
                        <div className="text-gray-700 leading-relaxed">{option}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confidence Level */}
          {(selectedAnswer !== null || freeTextAnswer.trim()) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How confident are you in this answer?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => onConfidenceSelect(level)}
                      className={`px-4 py-2 rounded text-sm transition-colors ${
                        confidenceLevel === level
                          ? 'bg-pulse-500 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {level === 1 ? 'Low' : level === 5 ? 'High' : level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <Button 
            onClick={onSubmitAnswer}
            disabled={(scenario.type === 'roleplay' ? !freeTextAnswer.trim() : selectedAnswer === null)}
            className="w-full bg-pulse-500 hover:bg-pulse-600 text-lg py-3"
          >
            Submit Answer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioDisplay;
