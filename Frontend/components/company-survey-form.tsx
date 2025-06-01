"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building, Users, MapPin, Briefcase, ArrowRight, CheckCircle, Plus, X, Tag, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-context"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Industry sectors list
const INDUSTRY_SECTORS = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Media & Entertainment",
  "Transportation",
  "Energy",
  "Real Estate",
  "Hospitality",
  "Agriculture",
  "Construction",
  "Telecommunications",
  "Consulting",
  "Legal Services",
  "Non-profit",
  "Other"
]

// Common departments list
const COMMON_DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Customer Support",
  "Human Resources",
  "Finance",
  "Operations",
  "Research & Development",
  "Legal",
  "IT"
]

export default function CompanySurveyForm() {
  const { user, updateCompanyInfo } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  
  // Form state
  const [companyName, setCompanyName] = useState("")
  const [industrySector, setIndustrySector] = useState("")
  const [companySize, setCompanySize] = useState<number>(50)
  const [officeLocations, setOfficeLocations] = useState<string[]>([])
  const [keyDepartments, setKeyDepartments] = useState<string[]>([])
  
  // Input refs for locations and departments
  const locationInputRef = useRef<HTMLInputElement>(null)
  const departmentInputRef = useRef<HTMLInputElement>(null)
  
  // New location/department input state
  const [newLocation, setNewLocation] = useState("")
  const [newDepartment, setNewDepartment] = useState("")
  const [showCustomDepartment, setShowCustomDepartment] = useState(false)
  
  // Check if user has already completed onboarding
  useEffect(() => {
    if (user?.onboardingComplete) {
      setIsComplete(true)
    }
  }, [user])

  // Add a location
  const addLocation = () => {
    if (newLocation.trim() && !officeLocations.includes(newLocation.trim())) {
      setOfficeLocations([...officeLocations, newLocation.trim()])
      setNewLocation("")
      if (locationInputRef.current) {
        locationInputRef.current.focus()
      }
    }
  }

  // Remove a location
  const removeLocation = (location: string) => {
    setOfficeLocations(officeLocations.filter(loc => loc !== location))
  }

  // Add a department
  const addDepartment = (department: string = newDepartment) => {
    if (department.trim() && !keyDepartments.includes(department.trim())) {
      setKeyDepartments([...keyDepartments, department.trim()])
      setNewDepartment("")
      setShowCustomDepartment(false)
    }
  }

  // Remove a department
  const removeDepartment = (department: string) => {
    setKeyDepartments(keyDepartments.filter(dept => dept !== department))
  }

  // Format company size for display
  const formatCompanySize = (size: number) => {
    if (size < 10) return "< 10 employees"
    if (size < 50) return "10-50 employees"
    if (size < 100) return "50-100 employees"
    if (size < 250) return "100-250 employees"
    if (size < 500) return "250-500 employees"
    if (size < 1000) return "500-1000 employees"
    return "1000+ employees"
  }

  // Get actual company size value for API
  const getCompanySizeValue = () => {
    if (companySize < 10) return 5
    if (companySize < 50) return 25
    if (companySize < 100) return 75
    if (companySize < 250) return 175
    if (companySize < 500) return 375
    if (companySize < 1000) return 750
    return 1500
  }

  const steps = [
    {
      title: "Company Name",
      description: "What's the name of your company?",
      icon: <Building className="w-6 h-6 text-violet-400" />,
      component: (
        <div className="space-y-4">
          <Input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter your company name"
            className="bg-gray-800/50 border-gray-700 text-white"
            required
          />
          <div className="text-xs text-gray-400 mt-2">
            This helps us personalize your experience and recommendations.
          </div>
        </div>
      ),
    },
    {
      title: "Industry / Sector",
      description: "What industry or sector does your company operate in?",
      icon: <Briefcase className="w-6 h-6 text-violet-400" />,
      component: (
        <div className="space-y-4">
          <Select value={industrySector} onValueChange={setIndustrySector}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white h-10">
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent 
              className="bg-gray-800 border-gray-700 text-white max-h-[300px] overflow-y-auto" 
              position="popper"
              sideOffset={5}
              align="center"
              avoidCollisions={false}
            >
              <div className="grid grid-cols-1 gap-1 p-1">
                {INDUSTRY_SECTORS.map((sector) => (
                  <SelectItem 
                    key={sector} 
                    value={sector}
                    className="rounded hover:bg-violet-500/20 focus:bg-violet-500/20 cursor-pointer h-9"
                  >
                    {sector}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
          <div className="text-xs text-gray-400 mt-2">
            We'll tailor our candidate recommendations based on your industry.
          </div>
        </div>
      ),
    },
    {
      title: "Company Size",
      description: "How many employees work at your company?",
      icon: <Users className="w-6 h-6 text-violet-400" />,
      component: (
        <div className="space-y-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Fewer</span>
              <span className="text-sm font-medium">{formatCompanySize(companySize)}</span>
              <span className="text-sm text-gray-400">More</span>
            </div>
            <Slider
              value={[companySize]}
              min={1}
              max={1000}
              step={1}
              onValueChange={(values) => setCompanySize(values[0])}
              className="py-4"
            />
          </div>
          <div className="flex justify-between">
            <div className="w-8 h-1 bg-violet-500/30 rounded-full"></div>
            <div className="w-8 h-1 bg-violet-500/50 rounded-full"></div>
            <div className="w-8 h-1 bg-violet-500/70 rounded-full"></div>
            <div className="w-8 h-1 bg-violet-500/90 rounded-full"></div>
            <div className="w-8 h-1 bg-violet-500 rounded-full"></div>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Company size helps us understand your hiring needs better.
          </div>
        </div>
      ),
    },
    {
      title: "Office Locations",
      description: "Where are your offices located?",
      icon: <MapPin className="w-6 h-6 text-violet-400" />,
      component: (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              ref={locationInputRef}
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addLocation()}
              placeholder="Add a location (e.g., New York, Remote)"
              className="bg-gray-800/50 border-gray-700 text-white flex-1"
            />
            <Button 
              onClick={addLocation}
              variant="outline"
              size="icon"
              className="border-violet-500/50 text-violet-400 hover:bg-violet-500/20"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {officeLocations.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {officeLocations.map((location, index) => (
                <div 
                  key={index}
                  className="group flex items-center bg-violet-500/20 text-violet-300 text-sm rounded-full pl-3 pr-2 py-1 border border-violet-500/30"
                >
                  <MapPin className="w-3 h-3 mr-1 text-violet-400" />
                  <span>{location}</span>
                  <button
                    onClick={() => removeLocation(location)}
                    className="ml-2 text-violet-300 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic mt-2">No locations added yet</div>
          )}
          
          <div className="text-xs text-gray-400 mt-2">
            This helps us identify candidates in your preferred locations.
          </div>
        </div>
      ),
    },
    {
      title: "Key Departments",
      description: "What are the key departments or teams in your company?",
      icon: <Briefcase className="w-6 h-6 text-violet-400" />,
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {COMMON_DEPARTMENTS.slice(0, 8).map((dept) => (
              <Button
                key={dept}
                variant="outline"
                size="sm"
                onClick={() => addDepartment(dept)}
                className={`justify-start border-gray-700 ${keyDepartments.includes(dept) ? 'bg-violet-500/30 text-violet-200 border-violet-500/50' : 'text-gray-300 hover:bg-gray-800'}`}
              >
                {keyDepartments.includes(dept) ? (
                  <Check className="w-3 h-3 mr-2 text-violet-400" />
                ) : (
                  <Plus className="w-3 h-3 mr-2" />
                )}
                {dept}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            {showCustomDepartment ? (
              <div className="flex items-center space-x-2 w-full">
                <Input
                  ref={departmentInputRef}
                  type="text"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addDepartment()}
                  placeholder="Enter custom department"
                  className="bg-gray-800/50 border-gray-700 text-white flex-1"
                  autoFocus
                />
                <Button 
                  onClick={() => addDepartment()}
                  variant="outline"
                  size="icon"
                  className="border-violet-500/50 text-violet-400 hover:bg-violet-500/20"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setShowCustomDepartment(true)}
                variant="outline"
                className="w-full border-dashed border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Department
              </Button>
            )}
          </div>
          
          {keyDepartments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {keyDepartments.map((department, index) => (
                <div 
                  key={index}
                  className="group flex items-center bg-violet-500/20 text-violet-300 text-sm rounded-full pl-3 pr-2 py-1 border border-violet-500/30"
                >
                  <Tag className="w-3 h-3 mr-1 text-violet-400" />
                  <span>{department}</span>
                  <button
                    onClick={() => removeDepartment(department)}
                    className="ml-2 text-violet-300 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-xs text-gray-400 mt-2">
            We'll prioritize candidates with experience in these departments.
          </div>
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Format the data
      const surveyData = {
        companyName,
        industrySector,
        companySize: getCompanySizeValue(),
        officeLocations,
        keyDepartments
      }
      
      await updateCompanyInfo(surveyData)
      setIsComplete(true)
    } catch (error) {
      console.error('Error submitting company survey:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isComplete) {
    return (
      <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[150px] animate-pulse delay-500" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md text-center"
        >
          <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-gray-400 mb-6">
            Your company information has been saved successfully.
          </p>
          <Button
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white py-3 rounded-lg shadow-lg shadow-violet-500/25"
            onClick={() => window.location.href = "/"}
          >
            Continue to Dashboard
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[150px] animate-pulse delay-500" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-xl"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Company Profile</h2>
            <p className="text-gray-400">
              Help us understand your company better to provide tailored recommendations
            </p>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 mx-1 rounded-full ${
                    index <= currentStep ? "bg-violet-500" : "bg-gray-700"
                  }`}
                />
              ))}
            </div>
            <div className="text-right text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-violet-500/20 rounded-full flex items-center justify-center mr-4">
                  {steps[currentStep].icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{steps[currentStep].title}</h3>
                  <p className="text-gray-400 text-sm">{steps[currentStep].description}</p>
                </div>
              </div>
              <div className="mt-4">{steps[currentStep].component}</div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || isSubmitting}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  {currentStep === steps.length - 1 ? "Submit" : "Next"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
