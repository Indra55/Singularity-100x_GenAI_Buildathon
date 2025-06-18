import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  Users,
  FileText,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Info,
  Zap,
  DollarSign,
  Clock,
  Award,
  BarChart3,
  Target,
  Brain,
  Sparkles
} from "lucide-react";
import InterviewScheduler from "./pipeline/InterviewScheduler";
import CandidateFlow from "./pipeline/CandidateFlow";
import OfferManagement from "./pipeline/OfferManagement";
import PipelineAnalytics from "./pipeline/PipelineAnalytics";
import { useToast } from "@/hooks/use-toast";
import { type User } from "@/contexts/AuthContext";

interface PipelineIntelligenceProps {
  user: User;
}

const PipelineIntelligence: React.FC<PipelineIntelligenceProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState("scheduler");
  const [scheduledCandidates, setScheduledCandidates] = useState([]);
  const { toast } = useToast();

  const handleScheduleComplete = (interviews) => {
    setScheduledCandidates(prev => [...prev, ...interviews]);
    toast({
      title: "🎯 AI-Powered Scheduling Complete!",
      description: `Successfully scheduled ${interviews.length} interviews with optimal time slots.`,
    });
    setActiveTab("flow");
  };

  const handleCandidatesUpdate = (updatedCandidates) => {
    setScheduledCandidates(updatedCandidates);
  };

  const handleOfferUpdate = (updatedCandidates) => {
    setScheduledCandidates(updatedCandidates);
    toast({
      title: "💼 Smart Offer Management",
      description: "Candidate offer status updated with AI recommendations.",
    });
  };

  // Calculate enhanced stats with predictions - fix circular reference
  const totalScheduled = scheduledCandidates.length;
  const inProgress = scheduledCandidates.filter(c => 
    c.stage !== "hired" && c.stage !== "rejected"
  ).length;
  const hired = scheduledCandidates.filter(c => c.stage === "hired").length;
  const rejected = scheduledCandidates.filter(c => c.stage === "rejected").length;
  const offersOut = scheduledCandidates.filter(c => c.offerSent && !c.offerAccepted).length;
  const avgScore = scheduledCandidates.length > 0 
    ? Math.round(scheduledCandidates.reduce((sum, c) => sum + c.score, 0) / scheduledCandidates.length)
    : 0;
  const conversionRate = totalScheduled > 0 
    ? Math.round((hired / totalScheduled) * 100)
    : 0;

  const stats = {
    totalScheduled,
    inProgress,
    hired,
    rejected,
    offersOut,
    avgScore,
    conversionRate
  };

  const conversionRates = {
    responseRate: 68,
    interviewToOffer: 74,
    offerAcceptance: 87,
    overallConversion: 15
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with AI Branding */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="relative">
              <Brain className="w-8 h-8 text-pulse-500" />
              <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            AI-Powered Hiring Intelligence
            <Badge className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-3 py-1 ml-2 animate-pulse">
              <Zap className="w-4 h-4 mr-1" />
              Next-Gen Pipeline
            </Badge>
          </h1>
          <p className="text-gray-600 mt-2">
            Revolutionary AI-driven candidate management with predictive analytics, automation, and intelligent insights
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            +{conversionRates.overallConversion}% Efficiency
          </Badge>
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2">
            <Target className="w-4 h-4 mr-2" />
            97% Accuracy
          </Badge>
        </div>
      </div>

      {/* Enhanced Quick Stats with Predictions */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pulse-500/10 to-purple-500/10"></div>
          <CardContent className="p-4 relative">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-pulse-600">{stats.totalScheduled}</h3>
              <p className="text-sm text-gray-500">Total Pipeline</p>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+23%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10"></div>
          <CardContent className="p-4 relative">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-600">{stats.inProgress}</h3>
              <p className="text-sm text-gray-500">Active</p>
              <div className="flex items-center justify-center mt-1">
                <Clock className="w-3 h-3 text-blue-500 mr-1" />
                <span className="text-xs text-blue-600">2.3d avg</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10"></div>
          <CardContent className="p-4 relative">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-orange-600">{stats.offersOut}</h3>
              <p className="text-sm text-gray-500">Offers Out</p>
              <div className="flex items-center justify-center mt-1">
                <DollarSign className="w-3 h-3 text-orange-500 mr-1" />
                <span className="text-xs text-orange-600">{conversionRates.offerAcceptance}% rate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"></div>
          <CardContent className="p-4 relative">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-600">{stats.hired}</h3>
              <p className="text-sm text-gray-500">Hired</p>
              <div className="flex items-center justify-center mt-1">
                <Award className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">Quality: A+</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
          <CardContent className="p-4 relative">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-purple-600">{stats.avgScore}</h3>
              <p className="text-sm text-gray-500">AI Score</p>
              <div className="flex items-center justify-center mt-1">
                <Brain className="w-3 h-3 text-purple-500 mr-1" />
                <span className="text-xs text-purple-600">AI Match</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-teal-500/10"></div>
          <CardContent className="p-4 relative">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-cyan-600">{conversionRates.overallConversion}%</h3>
              <p className="text-sm text-gray-500">Conversion</p>
              <div className="flex items-center justify-center mt-1">
                <Target className="w-3 h-3 text-cyan-500 mr-1" />
                <span className="text-xs text-cyan-600">+2.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Alert */}
      {scheduledCandidates.length === 0 && (
        <Alert className="border-pulse-200 bg-gradient-to-r from-pulse-50 to-purple-50">
          <div className="flex items-center">
            <Brain className="h-4 w-4 text-pulse-500 mr-2" />
            <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
          </div>
          <AlertDescription className="flex items-center justify-between">
            <div>
              <span className="font-medium text-pulse-700">🚀 Ready to Launch:</span> Activate your AI-powered pipeline and experience next-generation candidate management with predictive analytics.
            </div>
            <Button 
              size="sm" 
              onClick={() => setActiveTab("scheduler")}
              className="bg-gradient-to-r from-pulse-500 to-purple-600 hover:from-pulse-600 hover:to-purple-700 ml-4"
            >
              <Zap className="w-4 h-4 mr-2" />
              Launch AI Pipeline
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Enhanced Pipeline Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 p-1 bg-gradient-to-r from-gray-100 to-gray-50">
          <TabsTrigger value="scheduler" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pulse-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <Calendar className="w-4 h-4" />
            Smart Scheduler
          </TabsTrigger>
          <TabsTrigger value="flow" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white">
            <Users className="w-4 h-4" />
            AI Flow Manager
            {stats.inProgress > 0 && (
              <Badge className="bg-orange-500 text-white text-xs px-1 py-0.5 ml-1 animate-pulse">{stats.inProgress}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="offers" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
            <FileText className="w-4 h-4" />
            Smart Offers
            {stats.offersOut > 0 && (
              <Badge className="bg-purple-500 text-white text-xs px-1 py-0.5 ml-1 animate-pulse">{stats.offersOut}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4" />
            AI Analytics
            <Sparkles className="w-3 h-3 ml-1 animate-pulse" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduler">
          <InterviewScheduler onScheduleComplete={handleScheduleComplete} />
        </TabsContent>

        <TabsContent value="flow">
          <CandidateFlow 
            scheduledCandidates={scheduledCandidates}
            onUpdateCandidates={handleCandidatesUpdate}
          />
        </TabsContent>

        <TabsContent value="offers">
          <OfferManagement 
            candidates={scheduledCandidates}
            onOfferUpdate={handleOfferUpdate}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <PipelineAnalytics 
            user={user}
            stats={stats}
            conversionRates={conversionRates}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PipelineIntelligence;
