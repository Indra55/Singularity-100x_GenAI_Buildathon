
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Target, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OnboardingFlow = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    companyName: "",
    companySize: "",
    rolesOfInterest: []
  });
  const { toast } = useToast();

  const companySizes = [
    "1-10 employees",
    "11-50 employees", 
    "51-200 employees",
    "201-1000 employees",
    "1000+ employees"
  ];

  const roles = [
    "AI Engineer",
    "Machine Learning Engineer", 
    "GenAI Expert",
    "Data Scientist",
    "NLP Engineer",
    "Computer Vision Engineer",
    "MLOps Engineer",
    "AI Product Manager",
    "Research Scientist",
    "AI Consultant"
  ];

  const handleInputChange = (field, value) => {
    setOnboardingData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleToggle = (role) => {
    setOnboardingData(prev => ({
      ...prev,
      rolesOfInterest: prev.rolesOfInterest.includes(role)
        ? prev.rolesOfInterest.filter(r => r !== role)
        : [...prev.rolesOfInterest, role]
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    toast({
      title: "Profile setup complete!",
      description: "Welcome to TalentGPT. Let's start finding amazing candidates."
    });
    onComplete(onboardingData);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return onboardingData.companyName.trim().length > 0;
      case 2:
        return onboardingData.companySize.length > 0;
      case 3:
        return onboardingData.rolesOfInterest.length > 0;
      default:
        return false;
    }
  };

  const getStepIcon = (step) => {
    if (step < currentStep) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (step === currentStep) {
      switch (step) {
        case 1: return <Building className="w-5 h-5 text-pulse-500" />;
        case 2: return <Users className="w-5 h-5 text-pulse-500" />;
        case 3: return <Target className="w-5 h-5 text-pulse-500" />;
      }
    }
    return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Let's Set Up Your Profile
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-8 mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              {getStepIcon(step)}
              <span className={`text-xs mt-1 ${step <= currentStep ? 'text-pulse-600 font-medium' : 'text-gray-400'}`}>
                Step {step}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Company Name */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Building className="w-12 h-12 text-pulse-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">What's your company name?</h3>
              <p className="text-gray-600">Help us personalize your experience</p>
            </div>
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                placeholder="Enter your company name"
                value={onboardingData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        )}

        {/* Step 2: Company Size */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Users className="w-12 h-12 text-pulse-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">How big is your team?</h3>
              <p className="text-gray-600">This helps us customize your dashboard</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {companySizes.map((size) => (
                <Card 
                  key={size}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    onboardingData.companySize === size 
                      ? 'ring-2 ring-pulse-500 bg-pulse-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleInputChange('companySize', size)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{size}</span>
                      {onboardingData.companySize === size && (
                        <CheckCircle className="w-5 h-5 text-pulse-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Roles of Interest */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Target className="w-12 h-12 text-pulse-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">What roles are you hiring for?</h3>
              <p className="text-gray-600">Select all that apply - we'll set up smart filters</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Badge
                  key={role}
                  variant={onboardingData.rolesOfInterest.includes(role) ? "default" : "outline"}
                  className={`cursor-pointer transition-all hover:shadow-sm ${
                    onboardingData.rolesOfInterest.includes(role)
                      ? 'bg-pulse-500 hover:bg-pulse-600'
                      : 'hover:bg-pulse-50 hover:border-pulse-300'
                  }`}
                  onClick={() => handleRoleToggle(role)}
                >
                  {role}
                </Badge>
              ))}
            </div>
            {onboardingData.rolesOfInterest.length > 0 && (
              <p className="text-sm text-pulse-600 text-center">
                {onboardingData.rolesOfInterest.length} role{onboardingData.rolesOfInterest.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <Button 
            onClick={nextStep}
            disabled={!canProceed()}
            className="bg-pulse-500 hover:bg-pulse-600"
          >
            {currentStep === 3 ? 'Complete Setup' : 'Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingFlow;
