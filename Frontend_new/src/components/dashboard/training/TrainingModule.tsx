
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw,
  Star,
  AlertTriangle,
  Brain,
  Clock,
  Target,
  BookOpen,
  Award,
  TrendingUp
} from "lucide-react";

interface TrainingScenario {
  id: string;
  title: string;
  description: string;
  type: 'multiple-choice' | 'scenario' | 'practice';
  question: string;
  options?: string[];
  correctAnswer?: number;
  feedback: {
    correct: string;
    incorrect: string;
  };
  tips?: string[];
}

interface TrainingModuleProps {
  moduleId: string;
  moduleTitle: string;
  scenarios: TrainingScenario[];
  onComplete: (score: number) => void;
  onBack: () => void;
}

const TrainingModule = ({ moduleId, moduleTitle, scenarios, onComplete, onBack }: TrainingModuleProps) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [timeSpent, setTimeSpent] = useState(0);
  const [confidenceLevel, setConfidenceLevel] = useState<number | null>(null);
  const [incorrectAnswers, setIncorrectAnswers] = useState<number[]>([]);

  const scenario = scenarios[currentScenario];
  const progress = ((currentScenario + 1) / scenarios.length) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleConfidenceSelect = (confidence: number) => {
    setConfidenceLevel(confidence);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === scenario.correctAnswer;
    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setIncorrectAnswers(prev => [...prev, currentScenario]);
    }
    
    setShowFeedback(true);
  };

  const handleNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setConfidenceLevel(null);
    } else {
      setIsCompleted(true);
      const finalScore = (score / scenarios.length) * 100;
      onComplete(finalScore);
    }
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setIsCompleted(false);
    setStartTime(new Date());
    setTimeSpent(0);
    setConfidenceLevel(null);
    setIncorrectAnswers([]);
  };

  const handleReviewIncorrect = () => {
    if (incorrectAnswers.length > 0) {
      setCurrentScenario(incorrectAnswers[0]);
      setIsCompleted(false);
      setShowFeedback(false);
      setSelectedAnswer(null);
      setConfidenceLevel(null);
    }
  };

  const getPerformanceInsights = () => {
    const finalScore = (score / scenarios.length) * 100;
    const avgTimePerQuestion = timeSpent / scenarios.length;
    
    let performanceLevel = 'Needs Improvement';
    let performanceColor = 'text-red-600';
    let performanceIcon = AlertTriangle;
    
    if (finalScore >= 90) {
      performanceLevel = 'Expert';
      performanceColor = 'text-green-600';
      performanceIcon = Award;
    } else if (finalScore >= 80) {
      performanceLevel = 'Proficient';
      performanceColor = 'text-blue-600';
      performanceIcon = Target;
    } else if (finalScore >= 70) {
      performanceLevel = 'Competent';
      performanceColor = 'text-yellow-600';
      performanceIcon = TrendingUp;
    }

    return {
      level: performanceLevel,
      color: performanceColor,
      icon: performanceIcon,
      avgTime: avgTimePerQuestion
    };
  };

  if (isCompleted) {
    const finalScore = (score / scenarios.length) * 100;
    const insights = getPerformanceInsights();

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack}>
            ← Back to Training Modules
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Completed in {formatTime(timeSpent)}</span>
          </div>
        </div>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <insights.icon className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl">Training Complete!</CardTitle>
            <CardDescription className="text-lg">{moduleTitle}</CardDescription>
            <div className={`text-xl font-bold ${insights.color} mt-2`}>
              {insights.level} Level
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{finalScore.toFixed(0)}%</div>
                <div className="text-sm text-green-700">Overall Score</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-blue-700">Correct Answers</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{formatTime(Math.round(insights.avgTime))}</div>
                <div className="text-sm text-purple-700">Avg. per Question</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{scenarios.length}</div>
                <div className="text-sm text-orange-700">Total Scenarios</div>
              </div>
            </div>

            {incorrectAnswers.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 text-yellow-600 mr-2" />
                      <span className="font-medium text-yellow-800">
                        Review {incorrectAnswers.length} incorrect answer{incorrectAnswers.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Strengthen your understanding by reviewing missed questions
                    </p>
                  </div>
                  <Button 
                    onClick={handleReviewIncorrect}
                    variant="outline"
                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  >
                    Review
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {finalScore >= 90 && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-4">
                  <div className="flex items-center">
                    <Star className="w-6 h-6 mr-2" />
                    <div>
                      <div className="font-bold">Outstanding Performance!</div>
                      <div className="text-sm">You've mastered this training module</div>
                    </div>
                  </div>
                </div>
              )}

              {finalScore >= 80 && finalScore < 90 && (
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-800">Great job! You're proficient in this area.</span>
                  </div>
                </div>
              )}

              {finalScore < 70 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                    <div className="text-red-800">
                      <div className="font-medium">Consider additional practice</div>
                      <div className="text-sm">Retake this module to improve your skills</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={handleRestart} variant="outline" className="flex items-center">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Training
              </Button>
              <Button onClick={onBack} className="bg-pulse-500 hover:bg-pulse-600">
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          ← Back to Training Modules
        </Button>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeSpent)}</span>
          </div>
          <div>
            Question {currentScenario + 1} of {scenarios.length}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">{moduleTitle}</h1>
            <Badge variant="outline" className="flex items-center gap-1">
              <Brain className="w-3 h-3" />
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <Card className="border-2 border-pulse-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-pulse-700">{scenario.title}</CardTitle>
                <CardDescription className="mt-1">{scenario.description}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-pulse-600">#{currentScenario + 1}</div>
                <div className="text-xs text-gray-500">Scenario</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">?</span>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Interview Scenario</h3>
                  <p className="text-blue-800 leading-relaxed">{scenario.question}</p>
                </div>
              </div>
            </div>

            {!showFeedback && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-lg">Choose the best response:</h4>
                  <div className="text-sm text-gray-500">Select one option</div>
                </div>
                
                <div className="grid gap-3">
                  {scenario.options?.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedAnswer === index
                          ? 'border-pulse-500 bg-pulse-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <div className="flex items-start">
                        <div className={`w-5 h-5 rounded-full border-2 mr-4 mt-0.5 flex-shrink-0 ${
                          selectedAnswer === index
                            ? 'border-pulse-500 bg-pulse-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswer === index && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">Option {String.fromCharCode(65 + index)}</div>
                          <div className="text-gray-700">{option}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedAnswer !== null && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How confident are you in this answer?
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            onClick={() => handleConfidenceSelect(level)}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                              confidenceLevel === level
                                ? 'bg-pulse-500 text-white'
                                : 'bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {level === 1 ? 'Not Sure' : level === 5 ? 'Very Sure' : level}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="w-full bg-pulse-500 hover:bg-pulse-600 text-lg py-3"
                >
                  Submit Answer
                </Button>
              </div>
            )}

            {showFeedback && (
              <div className="space-y-4">
                <div className={`p-5 rounded-lg border-2 ${
                  selectedAnswer === scenario.correctAnswer
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center mb-3">
                    {selectedAnswer === scenario.correctAnswer ? (
                      <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                    ) : (
                      <X className="w-6 h-6 text-red-600 mr-3" />
                    )}
                    <span className={`font-bold text-lg ${
                      selectedAnswer === scenario.correctAnswer ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {selectedAnswer === scenario.correctAnswer ? 'Correct!' : 'Incorrect'}
                    </span>
                    {confidenceLevel && (
                      <Badge variant="outline" className="ml-auto">
                        Confidence: {confidenceLevel}/5
                      </Badge>
                    )}
                  </div>
                  <p className={`leading-relaxed ${
                    selectedAnswer === scenario.correctAnswer ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {selectedAnswer === scenario.correctAnswer 
                      ? scenario.feedback.correct 
                      : scenario.feedback.incorrect
                    }
                  </p>
                  
                  {selectedAnswer !== scenario.correctAnswer && (
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
                  onClick={handleNextScenario}
                  className="w-full bg-pulse-500 hover:bg-pulse-600 text-lg py-3"
                >
                  {currentScenario < scenarios.length - 1 ? (
                    <>
                      Next Scenario 
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    <>
                      Complete Training
                      <CheckCircle className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainingModule;
