
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Zap, Users, Brain, BarChart3, Target, Play } from "lucide-react";

interface SimulatorTabProps {
  onStartSimulator: () => void;
}

const SimulatorTab = ({ onStartSimulator }: SimulatorTabProps) => {
  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-50">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Video className="w-7 h-7 text-purple-600" />
          Interactive Interview Simulator
        </CardTitle>
        <CardDescription>
          Practice with AI-powered candidate personas in realistic interview scenarios
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Experience Real Interview Scenarios</h3>
            <p className="text-gray-600">
              Our AI-powered simulator creates realistic interview scenarios with different candidate personalities. 
              Practice handling nervous, overconfident, or difficult candidates in a safe environment.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium">4 Candidate Types</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <Brain className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-medium">AI Responses</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Real-time Analytics</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Instant Feedback</div>
            </div>
          </div>
          <Button 
            onClick={onStartSimulator}
            className="bg-purple-500 hover:bg-purple-600 text-lg px-8 py-3"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Live Simulation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulatorTab;
