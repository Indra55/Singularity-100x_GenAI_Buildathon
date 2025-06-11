
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, FileText, MessageSquare, Shield, Users, Zap } from "lucide-react";

const PlatformOverview = () => {
  const features = [
    {
      icon: Brain,
      title: "PeopleGPT",
      description: "LLM-powered candidate search with natural language queries",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: FileText,
      title: "Resume Intelligence",
      description: "Bulk resume parsing with AI-driven candidate insights",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: MessageSquare,
      title: "Outreach Copilot",
      description: "Automated personalized messaging across multiple channels",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with GDPR compliance",
      gradient: "from-red-500 to-red-600"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share candidates, comment, and collaborate with your team",
      gradient: "from-yellow-500 to-yellow-600"
    },
    {
      icon: Zap,
      title: "Smart Automation",
      description: "Reduce time-to-hire with intelligent workflow automation",
      gradient: "from-pulse-500 to-pulse-600"
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white animate-on-scroll">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-pulse-500 to-pulse-600 bg-clip-text text-transparent">
              Hire Smarter
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform streamlines every step of the recruitment process, 
            from initial candidate discovery to final offer acceptance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="group hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-2 animate-fade-in border-0 bg-white/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-8">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Platform Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in delay-1000">
          <div className="text-center">
            <div className="text-3xl font-bold text-pulse-600 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pulse-600 mb-2">1M+</div>
            <div className="text-gray-600">Candidate Profiles</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pulse-600 mb-2">500+</div>
            <div className="text-gray-600">Companies Trust Us</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pulse-600 mb-2">75%</div>
            <div className="text-gray-600">Faster Hiring</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformOverview;
