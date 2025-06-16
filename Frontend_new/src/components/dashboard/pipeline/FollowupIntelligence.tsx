
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Clock,
  Brain,
  Send,
  Calendar,
  Bell,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Zap
} from "lucide-react";

const FollowupIntelligence = ({ user, stats }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [customMessage, setCustomMessage] = useState("");

  // Mock follow-up data
  const followupQueue = [
    {
      id: "1",
      candidateName: "Sarah Chen",
      role: "Senior AI Engineer",
      company: "OpenAI",
      avatar: "SC",
      lastContact: "3 days ago",
      suggestedTime: "Today, 2:00 PM",
      priority: "high",
      aiSuggestion: "Follow up on technical discussion about LangChain implementation. Reference her recent blog post on AI agents.",
      responsePattern: "Usually responds within 2-4 hours on weekdays",
      engagementScore: 92,
      nextAction: "technical_followup"
    },
    {
      id: "2", 
      candidateName: "Alex Rodriguez",
      role: "ML Research Scientist",
      company: "DeepMind", 
      avatar: "AR",
      lastContact: "1 week ago",
      suggestedTime: "Tomorrow, 10:00 AM",
      priority: "medium",
      aiSuggestion: "Share relevant research papers and mention the computer vision project opportunity. Keep technical and research-focused.",
      responsePattern: "Prefers detailed technical discussions, responds slowly but thoughtfully",
      engagementScore: 78,
      nextAction: "research_share"
    },
    {
      id: "3",
      candidateName: "Maya Patel", 
      role: "AI Product Manager",
      company: "Anthropic",
      avatar: "MP",
      lastContact: "5 days ago",
      suggestedTime: "Friday, 11:00 AM", 
      priority: "high",
      aiSuggestion: "Follow up on product strategy discussion. Mention the recent AI ethics initiative and leadership opportunities.",
      responsePattern: "Very responsive, prefers concise but strategic conversations",
      engagementScore: 89,
      nextAction: "strategy_discussion"
    }
  ];

  const automatedActions = [
    {
      id: "1",
      type: "auto_followup",
      candidateName: "David Kim",
      action: "Sent personalized follow-up email",
      time: "2 hours ago",
      result: "Opened (waiting for response)",
      success: true
    },
    {
      id: "2", 
      type: "stage_update",
      candidateName: "Lisa Wang",
      action: "Moved to 'Interview Scheduled' based on calendar response", 
      time: "4 hours ago",
      result: "Pipeline updated automatically",
      success: true
    },
    {
      id: "3",
      type: "reminder",
      candidateName: "John Smith",
      action: "Reminder sent to hiring manager",
      time: "6 hours ago", 
      result: "Feedback provided, candidate scored",
      success: true
    }
  ];

  const messageTemplates = [
    {
      type: "technical_followup",
      title: "Technical Discussion Follow-up",
      template: "Hi {{name}}, I wanted to follow up on our discussion about {{technical_topic}}. Based on your experience with {{skill}}, I think you'd find our {{project}} particularly interesting. Would you be available for a quick 15-minute call this week?"
    },
    {
      type: "research_share", 
      title: "Research Opportunity",
      template: "Hi {{name}}, I came across this {{research_paper}} and thought you might find it relevant given your work on {{research_area}}. We have a similar project starting that could benefit from your expertise. Are you open to learning more?"
    },
    {
      type: "strategy_discussion",
      title: "Strategic Role Discussion", 
      template: "Hi {{name}}, Following up on our conversation about product strategy. I'd love to discuss how your experience with {{product_area}} could shape our {{initiative}}. Could we schedule a brief call to explore this further?"
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800"; 
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Automated Follow-up Intelligence</h2>
        <Badge className="bg-pulse-500 text-white px-4 py-2">
          <Zap className="w-4 h-4 mr-2" />
          AI-Automated
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Follow-ups</p>
                <h3 className="text-2xl font-bold mt-1">{followupQueue.length}</h3>
                <p className="text-xs text-orange-600 mt-1">Due today: 2</p>
              </div>
              <Bell className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Auto Actions Today</p>
                <h3 className="text-2xl font-bold mt-1">12</h3>
                <p className="text-xs text-green-600 mt-1">8 successful</p>
              </div>
              <Zap className="w-8 h-8 text-pulse-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Response Rate</p>
                <h3 className="text-2xl font-bold mt-1">73%</h3>
                <p className="text-xs text-green-600 mt-1">+8% vs manual</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Time Saved</p>
                <h3 className="text-2xl font-bold mt-1">2.3h</h3>
                <p className="text-xs text-blue-600 mt-1">Per day average</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Follow-up Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-pulse-500" />
            Intelligent Follow-up Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {followupQueue.map((item) => (
              <div key={item.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pulse-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {item.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.candidateName}</h3>
                      <p className="text-gray-600">{item.role} at {item.company}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority} priority
                        </Badge>
                        <span className="text-sm text-gray-500">Last contact: {item.lastContact}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-pulse-600">{item.suggestedTime}</p>
                    <p className="text-sm text-gray-500">Optimal time</p>
                  </div>
                </div>

                {/* AI Suggestion */}
                <div className="bg-pulse-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-pulse-500" />
                    <span className="font-medium text-sm">AI Follow-up Suggestion</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {item.engagementScore}% engagement score
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{item.aiSuggestion}</p>
                  <p className="text-xs text-gray-600">
                    <strong>Pattern:</strong> {item.responsePattern}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-pulse-500 hover:bg-pulse-600"
                      onClick={() => setSelectedCandidate(item)}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send AI Message
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule
                    </Button>
                    <Button size="sm" variant="outline">
                      Customize
                    </Button>
                  </div>
                  <Button size="sm" variant="ghost">
                    Skip
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Automated Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-pulse-500" />
            Recent Automated Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {automatedActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    action.success ? "bg-green-100" : "bg-red-100"
                  }`}>
                    {action.success ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{action.candidateName}</p>
                    <p className="text-sm text-gray-600">{action.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{action.time}</p>
                  <p className="text-xs text-gray-600">{action.result}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-pulse-500" />
            AI Message Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {messageTemplates.map((template, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{template.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{template.template}</p>
                <Button size="sm" variant="outline" className="w-full">
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FollowupIntelligence;
