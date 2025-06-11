
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  User, 
  Brain, 
  BarChart3,
  FileText,
  Plus,
  Download
} from "lucide-react";

const InterviewResults = ({ interviewData, onNewInterview }) => {
  const { candidate, jobPosition, interviewType, responses, totalDuration, completionRate } = interviewData;
  
  // Mock AI analysis results
  const analysisResults = {
    overallScore: 78,
    technicalScore: 82,
    communicationScore: 75,
    confidenceScore: 80,
    relevanceScore: 76,
    strengths: [
      "Strong technical knowledge and experience",
      "Clear and articulate communication style",
      "Good problem-solving approach",
      "Relevant industry experience"
    ],
    improvements: [
      "Could provide more specific examples",
      "Opportunity to demonstrate leadership experience",
      "Could elaborate on recent projects"
    ],
    recommendation: "Strong candidate with solid technical foundation. Recommend for next interview round.",
    keyInsights: [
      "Demonstrates strong React and Node.js expertise",
      "Shows systematic approach to debugging",
      "Good understanding of collaborative development",
      "Stays current with technology trends"
    ]
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Interview Results</h2>
          <p className="text-gray-600">AI analysis and candidate evaluation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={onNewInterview} className="bg-pulse-500 hover:bg-pulse-600">
            <Plus className="w-4 h-4 mr-2" />
            New Interview
          </Button>
        </div>
      </div>

      {/* Interview Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Interview Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Candidate</p>
              <p className="font-semibold">{candidate.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Position</p>
              <p className="font-semibold">{jobPosition}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Interview Type</p>
              <p className="font-semibold">{interviewType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-semibold">{formatDuration(totalDuration)}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                {responses.length} Questions Answered
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                <Clock className="w-3 h-3 mr-1" />
                {Math.round(completionRate)}% Complete
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Analysis Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Overall Score */}
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-pulse-500 mb-2">{analysisResults.overallScore}%</div>
            <p className="text-gray-600">Overall Interview Score</p>
          </div>

          {/* Detailed Scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-blue-600">{analysisResults.technicalScore}%</div>
              <p className="text-sm text-gray-600">Technical Skills</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-green-600">{analysisResults.communicationScore}%</div>
              <p className="text-sm text-gray-600">Communication</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-purple-600">{analysisResults.confidenceScore}%</div>
              <p className="text-sm text-gray-600">Confidence</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-orange-600">{analysisResults.relevanceScore}%</div>
              <p className="text-sm text-gray-600">Relevance</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Key Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysisResults.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-orange-700">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysisResults.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-4 h-4 border-2 border-orange-500 rounded mt-0.5 flex-shrink-0"></div>
                  <span className="text-sm">{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            AI Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-pulse-50 p-4 rounded-lg">
            <p className="text-pulse-700 font-medium">{analysisResults.recommendation}</p>
          </div>
          
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Key Insights:</h4>
            <ul className="space-y-1">
              {analysisResults.keyInsights.map((insight, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-pulse-500 rounded-full mt-2 flex-shrink-0"></span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Interview Responses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Interview Responses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {responses.map((response, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">Question {response.questionIndex + 1}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {formatDuration(response.responseTime)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{response.question}</p>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p className="font-medium mb-1">Transcribed Response:</p>
                  <p className="text-gray-700">{response.transcription}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewResults;
