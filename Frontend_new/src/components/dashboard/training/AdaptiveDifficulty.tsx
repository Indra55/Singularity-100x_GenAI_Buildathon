import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Lightbulb,
  Gauge
} from "lucide-react";

interface PerformanceMetrics {
  accuracy: number;
  speed: number;
  consistency: number;
  improvement: number;
}

interface DifficultyRecommendation {
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  confidence: number;
  reasoning: string[];
  suggestedModules: string[];
}

interface AdaptiveDifficultyProps {
  currentPerformance: PerformanceMetrics;
  moduleHistory: any[];
  onDifficultyChange: (level: string) => void;
}

const AdaptiveDifficulty = ({ currentPerformance, moduleHistory, onDifficultyChange }: AdaptiveDifficultyProps) => {
  const [recommendation, setRecommendation] = useState<DifficultyRecommendation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    analyzePerformance();
  }, [currentPerformance, moduleHistory]);

  const analyzePerformance = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const newRecommendation = generateRecommendation();
      setRecommendation(newRecommendation);
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateRecommendation = (): DifficultyRecommendation => {
    const { accuracy, speed, consistency, improvement } = currentPerformance;
    
    // AI-like decision logic
    let level: 'beginner' | 'intermediate' | 'advanced' | 'expert' = 'intermediate';
    let confidence = 0;
    const reasoning: string[] = [];
    const suggestedModules: string[] = [];

    // Determine level based on performance metrics
    if (accuracy >= 90 && speed >= 85 && consistency >= 80) {
      level = 'expert';
      confidence = 95;
      reasoning.push('Exceptional accuracy and speed across all modules');
      reasoning.push('Consistent high performance indicates mastery');
      suggestedModules.push('advanced-negotiation', 'executive-assessment', 'crisis-management');
    } else if (accuracy >= 80 && speed >= 70 && consistency >= 70) {
      level = 'advanced';
      confidence = 85;
      reasoning.push('Strong performance with room for optimization');
      reasoning.push('Ready for complex scenario challenges');
      suggestedModules.push('difficult-candidate', 'bias-detection', 'cultural-assessment');
    } else if (accuracy >= 70 && speed >= 60) {
      level = 'intermediate';
      confidence = 78;
      reasoning.push('Solid foundation with improving consistency');
      reasoning.push('Benefit from structured practice scenarios');
      suggestedModules.push('question-mastery', 'time-management', 'communication-skills');
    } else {
      level = 'beginner';
      confidence = 82;
      reasoning.push('Building foundational skills systematically');
      reasoning.push('Focus on core interviewing principles');
      suggestedModules.push('basic-questioning', 'interview-structure', 'note-taking');
    }

    // Adjust based on improvement trend
    if (improvement > 15) {
      reasoning.push('Rapid improvement suggests readiness for higher challenges');
      confidence += 10;
    } else if (improvement < 5) {
      reasoning.push('Steady progress indicates current level is appropriate');
    }

    return {
      level,
      confidence: Math.min(confidence, 100),
      reasoning,
      suggestedModules
    };
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'advanced': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'expert': return 'bg-gradient-to-r from-orange-400 to-red-500 text-white border-none';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'accuracy': return Target;
      case 'speed': return Zap;
      case 'consistency': return BarChart3;
      case 'improvement': return TrendingUp;
      default: return Gauge;
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 80) return 'text-blue-600';
    if (value >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-indigo-600" />
          AI-Powered Difficulty Adaptation
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(currentPerformance).map(([key, value]) => {
            const Icon = getMetricIcon(key);
            return (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium capitalize">{key}</span>
                  </div>
                  <span className={`font-bold ${getMetricColor(value)}`}>{value}%</span>
                </div>
                <Progress value={value} className="h-2" />
              </div>
            );
          })}
        </div>

        {/* AI Analysis */}
        {isAnalyzing ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="text-blue-800 font-medium">AI analyzing your performance patterns...</span>
            </div>
          </div>
        ) : recommendation && (
          <div className="space-y-4">
            {/* Recommendation */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-green-900 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  AI Recommendation
                </h4>
                <Badge className={getDifficultyColor(recommendation.level)}>
                  {recommendation.level} Level
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-medium">
                    {recommendation.confidence}% confidence in recommendation
                  </span>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-medium text-green-900">Reasoning:</span>
                  <ul className="space-y-1">
                    {recommendation.reasoning.map((reason, index) => (
                      <li key={index} className="text-sm text-green-800 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Suggested Modules */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Recommended Next Modules
              </h4>
              <div className="flex flex-wrap gap-2">
                {recommendation.suggestedModules.map((module, index) => (
                  <Badge key={index} variant="outline" className="bg-white border-purple-300 text-purple-800">
                    {module.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <Button 
              onClick={() => onDifficultyChange(recommendation.level)}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              <Brain className="w-4 h-4 mr-2" />
              Adapt to {recommendation.level} Level
            </Button>
          </div>
        )}

        {/* Performance Trend */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Trend Analysis
          </h4>
          <div className="text-sm text-gray-700 space-y-1">
            <p>• Last 5 modules: Average score improved by {currentPerformance.improvement}%</p>
            <p>• Consistency rating: {currentPerformance.consistency >= 80 ? 'Excellent' : currentPerformance.consistency >= 70 ? 'Good' : 'Needs Work'}</p>
            <p>• Response time: {currentPerformance.speed >= 80 ? 'Fast' : currentPerformance.speed >= 60 ? 'Moderate' : 'Slow'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdaptiveDifficulty;
