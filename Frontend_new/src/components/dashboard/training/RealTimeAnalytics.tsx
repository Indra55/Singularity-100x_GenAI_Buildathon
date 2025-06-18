
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown,
  Target, 
  Brain, 
  Clock, 
  Award, 
  Zap,
  BarChart3,
  Users,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Star,
  Flame,
  Eye,
  Activity
} from "lucide-react";

interface PerformanceMetric {
  name: string;
  current: number;
  previous: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  category: 'skill' | 'behavior' | 'outcome';
}

interface RealTimeAnalyticsProps {
  isLive?: boolean;
}

const RealTimeAnalytics = ({ isLive = true }: RealTimeAnalyticsProps) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    {
      name: 'Question Quality',
      current: 87,
      previous: 82,
      target: 90,
      trend: 'up',
      category: 'skill'
    },
    {
      name: 'Bias Detection',
      current: 73,
      previous: 78,
      target: 85,
      trend: 'down',
      category: 'skill'
    },
    {
      name: 'Response Time',
      current: 92,
      previous: 89,
      target: 95,
      trend: 'up',
      category: 'behavior'
    },
    {
      name: 'Candidate Engagement',
      current: 94,
      previous: 91,
      target: 95,
      trend: 'up',
      category: 'outcome'
    }
  ]);

  const [liveInsights, setLiveInsights] = useState([
    "Your questioning technique improved by 12% this session",
    "Strong performance in technical assessment scenarios",
    "Consider practicing salary negotiation discussions"
  ]);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        previous: metric.current,
        current: Math.max(0, Math.min(100, metric.current + (Math.random() - 0.5) * 4))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'skill': return 'from-blue-500 to-purple-600';
      case 'behavior': return 'from-green-500 to-teal-600';
      case 'outcome': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const overallScore = Math.round(metrics.reduce((acc, metric) => acc + metric.current, 0) / metrics.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
        {/* Live Status Header - Mobile Optimized */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Eye className="w-6 h-6 text-green-600" />
                  {isLive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-800">
                    Real-Time Performance Analytics
                  </h2>
                  <p className="text-sm lg:text-base text-green-700">
                    {isLive ? 'Live monitoring active' : 'Historical view'}
                  </p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">{overallScore}%</div>
                <div className="text-sm lg:text-base text-green-700">Overall Performance</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics Grid - Mobile First */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {metrics.map((metric, index) => (
            <Card key={metric.name} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base lg:text-lg">{metric.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-sm ${
                        metric.trend === 'up' ? 'text-green-600' : 
                        metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.current > metric.previous ? '+' : ''}
                        {(metric.current - metric.previous).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl lg:text-2xl font-bold text-gray-900">
                      {metric.current.toFixed(0)}%
                    </div>
                    <Badge className={`text-xs bg-gradient-to-r ${getCategoryColor(metric.category)} text-white border-0`}>
                      {metric.category}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs lg:text-sm text-gray-600">
                    <span>Progress to Target</span>
                    <span>{metric.target}% target</span>
                  </div>
                  <div className="relative">
                    <Progress value={metric.current} className="h-2 lg:h-3" />
                    <div 
                      className="absolute top-0 h-2 lg:h-3 w-0.5 bg-red-500 opacity-60"
                      style={{ left: `${metric.target}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Insights - Mobile Responsive */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                <span className="text-lg lg:text-xl">Live AI Insights</span>
              </div>
              {isLive && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 animate-pulse w-fit">
                  LIVE
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">
              Real-time analysis of your performance patterns and improvement opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 space-y-3 lg:space-y-4">
            {liveInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 lg:p-4 bg-white/60 rounded-lg border border-purple-200/50">
                <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm lg:text-base text-purple-800 font-medium break-words">{insight}</p>
                  <p className="text-xs lg:text-sm text-purple-600 mt-1">
                    Updated {Math.floor(Math.random() * 60)} seconds ago
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Detailed Performance Breakdown - Mobile First */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
              <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-pulse-600" />
              Performance Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              {/* Skills Analysis */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-base lg:text-lg">
                  <Target className="w-4 h-4 text-blue-600" />
                  Skills Analysis
                </h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Question Formulation</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Active Listening</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Evaluation Skills</span>
                      <span className="font-medium">79%</span>
                    </div>
                    <Progress value={79} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Behavioral Patterns */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-base lg:text-lg">
                  <Users className="w-4 h-4 text-green-600" />
                  Behavioral Patterns
                </h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Interview Flow</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Time Management</span>
                      <span className="font-medium">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Adaptability</span>
                      <span className="font-medium">83%</span>
                    </div>
                    <Progress value={83} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Outcome Quality */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-base lg:text-lg">
                  <Award className="w-4 h-4 text-orange-600" />
                  Outcome Quality
                </h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Decision Accuracy</span>
                      <span className="font-medium">91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Candidate Experience</span>
                      <span className="font-medium">96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Process Compliance</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeAnalytics;
