
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  Users,
  Clock,
  Lightbulb
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, FunnelChart, Funnel, Cell } from "recharts";

const PipelineAnalytics = ({ user, stats, conversionRates }) => {
  const [timeRange, setTimeRange] = useState("30d");

  // Mock data for pipeline analytics
  const pipelineFlow = [
    { name: "Sourced", value: 1000, fill: "#8884d8" },
    { name: "Contacted", value: 650, fill: "#83a6ed" },
    { name: "Responded", value: 420, fill: "#8dd1e1" },
    { name: "Interviewed", value: 280, fill: "#82ca9d" },
    { name: "Offered", value: 180, fill: "#ffc658" },
    { name: "Hired", value: 150, fill: "#ff7300" }
  ];

  const timelineData = [
    { week: "Week 1", sourced: 65, contacted: 45, responded: 28, interviewed: 18, hired: 12 },
    { week: "Week 2", sourced: 78, contacted: 52, responded: 35, interviewed: 22, hired: 15 },
    { week: "Week 3", sourced: 85, contacted: 60, responded: 40, interviewed: 26, hired: 18 },
    { week: "Week 4", sourced: 92, contacted: 68, responded: 45, interviewed: 30, hired: 22 }
  ];

  const bottlenecks = [
    {
      stage: "Response Rate",
      issue: "65% of contacted candidates don't respond",
      impact: "High",
      suggestion: "Personalize outreach messages and optimize send timing",
      priority: "urgent"
    },
    {
      stage: "Interview to Offer",
      issue: "36% drop-off rate after interviews",
      impact: "Medium", 
      suggestion: "Implement faster decision-making process and candidate feedback",
      priority: "medium"
    }
  ];

  const aiInsights = [
    {
      type: "prediction",
      title: "Pipeline Velocity Increase",
      description: "Based on current trends, expect 15% faster hiring next month",
      confidence: 87
    },
    {
      type: "optimization",
      title: "Best Contact Time",
      description: "Tuesday-Thursday, 10-11 AM shows 34% higher response rates",
      confidence: 92
    },
    {
      type: "warning",
      title: "Candidate Pool Risk",
      description: "Senior engineer pipeline may run low in 2 weeks",
      confidence: 78
    }
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Intelligent Pipeline Analytics</h2>
        <div className="flex gap-2">
          {["7d", "30d", "90d"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? "bg-pulse-500 hover:bg-pulse-600" : ""}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Pipeline Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-pulse-500" />
            Pipeline Conversion Funnel
            <Badge className="bg-green-100 text-green-800 ml-2">
              Real-time
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineFlow} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value) => [value, "Candidates"]} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Overall Conversion</p>
              <p className="text-2xl font-bold text-green-600">15%</p>
              <p className="text-xs text-green-600">+2.3% vs last month</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Avg Stage Time</p>
              <p className="text-2xl font-bold">3.2 days</p>
              <p className="text-xs text-green-600">-0.5 days improved</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Drop-off Rate</p>
              <p className="text-2xl font-bold text-orange-600">35%</p>
              <p className="text-xs text-orange-600">Needs attention</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-pulse-500" />
            Pipeline Activity Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sourced" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="contacted" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="responded" stroke="#ffc658" strokeWidth={2} />
                <Line type="monotone" dataKey="interviewed" stroke="#ff7300" strokeWidth={2} />
                <Line type="monotone" dataKey="hired" stroke="#ff0000" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bottleneck Detection */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Detected Bottlenecks & AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bottlenecks.map((bottleneck, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      {bottleneck.stage}
                      <Badge 
                        className={
                          bottleneck.priority === "urgent" 
                            ? "bg-red-100 text-red-800" 
                            : "bg-orange-100 text-orange-800"
                        }
                      >
                        {bottleneck.impact} Impact
                      </Badge>
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{bottleneck.issue}</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-pulse-500 hover:bg-pulse-600"
                  >
                    Apply Fix
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <p className="text-sm"><strong>AI Suggestion:</strong> {bottleneck.suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-pulse-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-pulse-500" />
            AI Pipeline Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  {insight.type === "prediction" && <TrendingUp className="w-4 h-4 text-green-500" />}
                  {insight.type === "optimization" && <CheckCircle className="w-4 h-4 text-blue-500" />}
                  {insight.type === "warning" && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                  <h4 className="font-medium">{insight.title}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <Badge className="bg-gray-100 text-gray-800">
                    {insight.confidence}% confidence
                  </Badge>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineAnalytics;
