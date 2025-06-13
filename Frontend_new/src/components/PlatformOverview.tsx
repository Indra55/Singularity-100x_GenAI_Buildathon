import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, FileText, MessageSquare, Shield, Users, Zap } from "lucide-react";

const PlatformOverview = () => {
  const features = [
    {
      icon: Brain,
      title: "PeopleGPT",
      description: "Advanced LLM-powered candidate discovery with sophisticated natural language processing",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      icon: FileText,
      title: "Resume Intelligence",
      description: "Enterprise-grade resume parsing with comprehensive AI-driven candidate analytics",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: MessageSquare,
      title: "Outreach Copilot",
      description: "Intelligent automated messaging with personalized multi-channel engagement",
      gradient: "from-orange-600 to-red-500"
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Bank-level security infrastructure with comprehensive GDPR compliance",
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless candidate sharing with real-time collaboration and feedback systems",
      gradient: "from-amber-400 to-orange-500"
    },
    {
      icon: Zap,
      title: "Intelligent Automation",
      description: "Sophisticated workflow optimization reducing time-to-hire by up to 80%",
      gradient: "from-orange-500 to-amber-600"
    }
  ];

  return (
    <section id="features" className="py-32 lg:py-40 bg-gradient-to-b from-orange-50/20 via-white to-amber-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-orange-200/40 to-amber-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-amber-200/40 to-orange-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container relative z-10 px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-20 lg:mb-28">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-8 lg:mb-12 leading-tight tracking-tight">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent font-medium">
              Hire Smarter
            </span>
          </h2>
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
            Our AI-powered platform streamlines every step of the recruitment process, 
            from initial candidate discovery to final offer acceptance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-24 lg:mb-32">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="group hover:shadow-2xl hover:shadow-orange-200/20 transition-all duration-700 hover:-translate-y-3 border-0 bg-white/80 backdrop-blur-lg rounded-3xl lg:rounded-4xl overflow-hidden"
              style={{ 
                animationDelay: `${index * 200}ms`,
                transform: `translateY(${index % 2 === 0 ? '0' : '20px'})` 
              }}
            >
              <CardContent className="p-8 lg:p-10">
                <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 lg:mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                  <feature.icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-base lg:text-lg text-gray-600 leading-relaxed font-light">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Platform Stats */}
        <div className="relative">
          {/* Stats Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-orange-500/5 rounded-3xl lg:rounded-4xl backdrop-blur-sm"></div>
          
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 py-16 lg:py-20 px-8 lg:px-12">
            {[
              { value: "99.9%", label: "Platform Uptime", description: "Enterprise reliability" },
              { value: "50M+", label: "Candidate Profiles", description: "Global talent pool" },
              { value: "2,500+", label: "Companies Trust Us", description: "Industry leaders" },
              { value: "80%", label: "Faster Hiring", description: "Proven efficiency" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 lg:mb-6 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl lg:rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl xl:text-5xl font-light text-orange-600 mb-2 lg:mb-3 group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-base lg:text-lg font-medium text-gray-900 mb-1 lg:mb-2">
                  {stat.label}
                </div>
                <div className="text-sm lg:text-base text-gray-500 font-light">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Platform Highlights */}
        <div className="mt-24 lg:mt-32 text-center">
          <div className="inline-flex items-center gap-6 lg:gap-8 px-8 lg:px-12 py-4 lg:py-6 bg-white/90 backdrop-blur-md rounded-2xl lg:rounded-3xl shadow-xl border border-white/60">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm lg:text-base text-gray-600 font-medium">Live Platform Status</span>
            </div>
            <div className="w-px h-6 bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-orange-500" />
              <span className="text-sm lg:text-base text-gray-600 font-medium">SOC 2 Certified</span>
            </div>
            <div className="w-px h-6 bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-orange-500" />
              <span className="text-sm lg:text-base text-gray-600 font-medium">99.9% SLA Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformOverview;