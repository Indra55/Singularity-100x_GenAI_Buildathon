import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Download, Brain, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { resumeService } from "@/services/resumeService";
import { talentPoolService } from "@/services/talentPoolService";

const ResumeParser = ({ user }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResumes, setParsedResumes] = useState([]);
  const [isAddingToTalentPool, setIsAddingToTalentPool] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;
    
    const files = Array.from(fileList) as File[];
    setIsProcessing(true);

    try {
      let response;
      if (files.length === 1 && files[0].name.endsWith('.zip')) {
        response = await resumeService.parseZipResume(files[0]);
      } else if (files.length === 1) {
        response = await resumeService.parseSingleResume(files[0]);
      } else {
        response = await resumeService.parseMultipleResumes(files);
      }
      
      console.log('Raw Response:', response);
      
      // Handle both single and multiple resume responses
      const processedData = Array.isArray(response) ? response : [response];
      
      // Transform the data to match our display format
      const formattedData = processedData.map((resume, index) => {
        // Get the actual data from the response
        const resumeData = resume.data || resume;
        console.log('Processing resume data:', resumeData);

        // Split skills string into array
        const skillsArray = resumeData.skills ? resumeData.skills.split(',').map(s => s.trim()) : [];
        
        // Extract education details
        const educationParts = resumeData.education ? resumeData.education.split(',') : [];
        const degree = educationParts[0] || 'N/A';
        const university = educationParts.slice(1).join(',').trim() || 'N/A';

        return {
          id: `resume_${Date.now()}_${index}`, // Add timestamp to ensure unique IDs
          fileName: resumeData.originalFileName || files[index]?.name || `Resume ${index + 1}`,
          candidate: {
            name: resumeData.name || 'N/A',
            email: resumeData.email || 'N/A',
            phone: resumeData.phone || 'N/A',
            location: resumeData.location || 'N/A',
            linkedin: resumeData.linkedin_url || 'N/A',
            portfolio: resumeData.portfolio_url || 'N/A'
          },
          experience: {
            years: resumeData.years_of_experience || 0,
            currentRole: resumeData.title || 'N/A',
            previousRoles: resumeData.past_companies ? resumeData.past_companies.split(',').map(c => c.trim()) : []
          },
          skills: skillsArray,
          education: {
            degree: degree,
            university: university
          },
          summary: resumeData.resume_summary || 'No summary available',
          workPreference: resumeData.work_preference || 'Not specified',
          status: resumeData.status || 'Not specified'
        };
      });

      console.log('Formatted Data:', formattedData);
      
      // Append new resumes to existing ones
      setParsedResumes(prevResumes => [...prevResumes, ...formattedData]);
      
      toast({
        title: "Resumes Processed",
        description: `Successfully parsed ${files.length} resume(s) using AI.`
      });
    } catch (error) {
      console.error('Error processing resumes:', error);
      toast({
        title: "Error",
        description: "Failed to process resumes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearAll = () => {
    setParsedResumes([]);
    toast({
      title: "Cleared",
      description: "All parsed resumes have been cleared."
    });
  };

  const handleAddToTalentPool = async (resume) => {
    try {
      setIsAddingToTalentPool(true);
      const candidate = {
        name: resume.candidate.name,
        email: resume.candidate.email,
        phone: resume.candidate.phone,
        location: resume.candidate.location,
        linkedin: resume.candidate.linkedin,
        portfolio: resume.candidate.portfolio,
        experience: resume.experience,
        skills: resume.skills,
        education: resume.education,
        summary: resume.summary,
        workPreference: resume.workPreference,
        status: 'New',
        source: 'Resume Parser',
        originalResume: resume.fileName
      };

      await talentPoolService.addCandidate(candidate);
      toast({
        title: "Success",
        description: "Candidate added to talent pool successfully!"
      });
    } catch (error) {
      console.error('Error adding to talent pool:', error);
      toast({
        title: "Error",
        description: "Failed to add candidate to talent pool",
        variant: "destructive"
      });
    } finally {
      setIsAddingToTalentPool(false);
    }
  };

  const handleAddAllToTalentPool = async () => {
    try {
      setIsAddingToTalentPool(true);
      const candidates = parsedResumes.map(resume => ({
        name: resume.candidate.name,
        email: resume.candidate.email,
        phone: resume.candidate.phone,
        location: resume.candidate.location,
        linkedin: resume.candidate.linkedin,
        portfolio: resume.candidate.portfolio,
        experience: resume.experience,
        skills: resume.skills,
        education: resume.education,
        summary: resume.summary,
        workPreference: resume.workPreference,
        status: 'New',
        source: 'Resume Parser',
        originalResume: resume.fileName
      }));

      await talentPoolService.addCandidates(candidates);
      toast({
        title: "Success",
        description: `${candidates.length} candidates added to talent pool successfully!`
      });
    } catch (error) {
      console.error('Error adding to talent pool:', error);
      toast({
        title: "Error",
        description: "Failed to add candidates to talent pool",
        variant: "destructive"
      });
    } finally {
      setIsAddingToTalentPool(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-pulse-500" />
            AI Resume Parser
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pulse-300 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Resumes</h3>
            <p className="text-gray-600 mb-4">
              Upload single files or ZIP archives. Our AI will extract key information automatically.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.zip"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button 
              onClick={handleButtonClick}
              className="bg-pulse-500 hover:bg-pulse-600" 
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                "Choose Files"
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: PDF, DOC, DOCX, ZIP
            </p>
          </div>

          {isProcessing && (
            <div className="mt-6 p-4 bg-pulse-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pulse-500"></div>
                <span className="text-pulse-700">AI is analyzing resumes and extracting key information...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {parsedResumes.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Parsed Results ({parsedResumes.length})</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleAddAllToTalentPool}
                  disabled={isAddingToTalentPool}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Add All to Talent Pool
                </Button>
                <Button variant="outline" onClick={handleClearAll}>
                  Clear All
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parsedResumes.map((resume) => (
                <Card key={resume.id} className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-pulse-500" />
                        <div>
                          <h3 className="font-semibold">{resume.candidate.name}</h3>
                          <p className="text-sm text-gray-600">{resume.experience.currentRole}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Contact</h4>
                        <p className="text-sm text-gray-600">{resume.candidate.email}</p>
                        <p className="text-sm text-gray-600">{resume.candidate.phone}</p>
                        {resume.candidate.linkedin !== 'N/A' && (
                          <p className="text-sm text-gray-600">
                            <a href={resume.candidate.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              LinkedIn Profile
                            </a>
                          </p>
                        )}
                        {resume.candidate.portfolio !== 'N/A' && (
                          <p className="text-sm text-gray-600">
                            <a href={resume.candidate.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              Portfolio
                            </a>
                          </p>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Experience</h4>
                        <p className="text-sm text-gray-600">
                          {resume.experience.years} years of experience
                        </p>
                        {resume.experience.previousRoles.length > 0 && (
                          <p className="text-sm text-gray-600">
                            Previous companies: {resume.experience.previousRoles.join(', ')}
                          </p>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Skills</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {resume.skills.slice(0, 8).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {resume.skills.length > 8 && (
                            <Badge variant="secondary" className="text-xs">
                              +{resume.skills.length - 8} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Education</h4>
                        <p className="text-sm text-gray-600">
                          {resume.education.degree}
                        </p>
                        <p className="text-sm text-gray-600">
                          {resume.education.university}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Summary</h4>
                        <p className="text-sm text-gray-600">{resume.summary}</p>
                      </div>

                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">
                            {resume.workPreference !== 'Not specified' && `Work Preference: ${resume.workPreference}`}
                          </span>
                          <Button 
                            size="sm" 
                            className="bg-pulse-500 hover:bg-pulse-600"
                            onClick={() => handleAddToTalentPool(resume)}
                            disabled={isAddingToTalentPool}
                          >
                            {isAddingToTalentPool ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                Adding...
                              </>
                            ) : (
                              "Add to Talent Pool"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResumeParser;
