import React, { useState, KeyboardEvent, MouseEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Briefcase, MapPin, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

export interface OnboardingData {
  companyName: string;
  sector: string;
  companySize: string;
  officeLocations: string[];
  keyDepartments: string[];
}

interface OnboardingFlowProps {
  isOpen: boolean;
  onComplete: (data: OnboardingData) => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ isOpen, onComplete }): JSX.Element => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customDepartment, setCustomDepartment] = useState("");
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    companyName: "",
    sector: "",
    companySize: "",
    officeLocations: [],
    keyDepartments: []
  });
  const { toast } = useToast();

  const companySizes = [
    "1-10 employees",
    "11-50 employees", 
    "51-200 employees",
    "201-1000 employees",
    "1000+ employees"
  ];

  const sectors = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Other"
  ];

  const departments = [
    "Engineering",
    "Product",
    "Sales",
    "Marketing",
    "Operations",
    "Finance",
    "HR",
    "Legal",
    "Research",
    "Customer Support"
  ];

  const handleInputChange = (field: string, value: string) => {
    setOnboardingData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: string, item: string) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleLocationKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      handleArrayToggle('officeLocations', e.currentTarget.value);
      e.currentTarget.value = '';
    }
  };

  const handleLocationAdd = (e: MouseEvent<HTMLButtonElement>) => {
    const input = document.getElementById('location') as HTMLInputElement;
    if (input.value) {
      handleArrayToggle('officeLocations', input.value);
      input.value = '';
    }
  };

  const handleCustomDepartmentKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      handleArrayToggle('keyDepartments', e.currentTarget.value);
      e.currentTarget.value = '';
    }
  };

  const handleCustomDepartmentAdd = (e: MouseEvent<HTMLButtonElement>) => {
    if (customDepartment) {
      handleArrayToggle('keyDepartments', customDepartment);
      setCustomDepartment('');
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    const userId = localStorage.getItem("userId");
  
    if (!userId) {
      toast({
        title: "User ID missing!",
        description: "Please sign in again.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      // Fix: Use correct endpoint that matches your backend route
      await api.post(`/users/onboarding/${userId}`, onboardingData);
      toast({
        title: "Profile setup complete!",
        description: "Welcome aboard. Let's get started!",
      });
      onComplete(onboardingData);
    } catch (error) {
      console.error("Failed to submit onboarding:", error);
      toast({
        title: "Something went wrong",
        description: "We couldn't save your profile. Try again.",
        variant: "destructive",
      });
    }
  };
  

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return onboardingData.companyName.trim().length > 0;
      case 2:
        return onboardingData.sector !== "";
      case 3:
        return onboardingData.companySize !== "";
      case 4:
        return onboardingData.officeLocations.length > 0;
      case 5:
        return onboardingData.keyDepartments.length > 0;
      default:
        return false;
    }
  };

  const getStepIcon = (step: number) => {
    if (step < currentStep) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (step === currentStep) {
      switch (step) {
        case 1: return <Building className="w-5 h-5 text-pulse-500" />;
        case 2: return <Briefcase className="w-5 h-5 text-pulse-500" />;
        case 3: return <Users className="w-5 h-5 text-pulse-500" />;
        case 4: return <MapPin className="w-5 h-5 text-pulse-500" />;
        case 5: return <Users className="w-5 h-5 text-pulse-500" />;
      }
    }
    return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Let's Set Up Your Profile
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          {[1, 2, 3, 4, 5].map((step) => (
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

        {/* Step 2: Sector */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Briefcase className="w-12 h-12 text-pulse-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">What's your company's sector?</h3>
              <p className="text-gray-600">Select the industry you operate in</p>
            </div>
            <div>
              <Label>Select your sector</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {sectors.map((sector) => (
                  <Badge
                    key={sector}
                    variant={onboardingData.sector === sector ? "default" : "outline"}
                    className={`cursor-pointer transition-all hover:shadow-sm ${
                      onboardingData.sector === sector
                        ? 'bg-pulse-500 hover:bg-pulse-600'
                        : 'hover:bg-pulse-50 hover:border-pulse-300'
                    }`}
                    onClick={() => handleInputChange('sector', sector)}
                  >
                    {sector}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Company Size */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Users className="w-12 h-12 text-pulse-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">How large is your company?</h3>
              <p className="text-gray-600">Select your company size</p>
            </div>
            <div>
              <Label>Company size</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
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
                    <CardContent className="p-3">
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
          </div>
        )}

        {/* Step 4: Office Locations */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-pulse-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Where are your offices located?</h3>
              <p className="text-gray-600">Add your office locations</p>
            </div>
            <div>
              <Label htmlFor="location">Add Location</Label>
              <div className="flex space-x-2">
                <Input
                  id="location"
                  placeholder="Enter a location"
                  onKeyPress={handleLocationKeyPress}
                />
                <Button onClick={handleLocationAdd}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {onboardingData.officeLocations.map((location) => (
                  <Badge
                    key={location}
                    variant="default"
                    className="bg-pulse-500"
                  >
                    {location}
                    <button 
                      className="ml-1" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArrayToggle('officeLocations', location);
                      }}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Key Departments */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Users className="w-12 h-12 text-pulse-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Select your key departments</h3>
              <p className="text-gray-600">Choose or add custom departments</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {onboardingData.keyDepartments.map((dept) => (
                <Badge
                  key={dept}
                  variant="default"
                  className="bg-pulse-500"
                >
                  {dept}
                  <button 
                    className="ml-1" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArrayToggle('keyDepartments', dept);
                    }}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {departments.filter(dept => !onboardingData.keyDepartments.includes(dept)).map((dept) => (
                <Badge
                  key={dept}
                  variant="outline"
                  className="cursor-pointer transition-all hover:shadow-sm hover:bg-pulse-50 hover:border-pulse-300"
                  onClick={() => handleArrayToggle('keyDepartments', dept)}
                >
                  {dept}
                </Badge>
              ))}
            </div>
            <div>
              <Label htmlFor="custom-department">Add Custom Department</Label>
              <div className="flex space-x-2">
                <Input
                  id="custom-department"
                  placeholder="Enter department name"
                  value={customDepartment}
                  onChange={(e) => setCustomDepartment(e.target.value)}
                  onKeyPress={handleCustomDepartmentKeyPress}
                />
                <Button onClick={handleCustomDepartmentAdd}>
                  Add
                </Button>
              </div>
            </div>
            {onboardingData.keyDepartments.length > 0 && (
              <p className="text-sm text-pulse-600 text-center">
                {onboardingData.keyDepartments.length} department{onboardingData.keyDepartments.length !== 1 ? 's' : ''} selected
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
            {currentStep === 5 ? 'Complete Setup' : 'Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingFlow;