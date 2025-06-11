
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Download, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResumeParser = ({ user }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResumes, setParsedResumes] = useState([]);
  const { toast } = useToast();

  const handleFileUpload = async (event) => {
    const fileList = event.target.files;
    if (!fileList) return;
    
    const files = Array.from(fileList) as File[];
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const mockParsedData = files.map((file, index) => ({
        id: `resume_${index}`,
        fileName: file.name,
        candidate: {
          name: `Candidate ${index + 1}`,
          email: `candidate${index + 1}@email.com`,
          phone: `+1 (555) 000-000${index}`,
          location: ["New York, NY", "San Francisco, CA", "Austin, TX"][index % 3]
        },
        experience: {
          years: Math.floor(Math.random() * 10) + 2,
          currentRole: ["Senior Developer", "Product Manager", "Data Scientist"][index % 3],
          previousRoles: Math.floor(Math.random() * 5) + 1
        },
        skills: [
          ["Python", "React", "AWS", "Machine Learning"],
          ["Product Strategy", "Agile", "Analytics", "Leadership"],
          ["Python", "TensorFlow", "SQL", "Statistics"]
        ][index % 3],
        education: {
          degree: ["MS Computer Science", "MBA", "BS Data Science"][index % 3],
          university: ["Stanford", "MIT", "Berkeley"][index % 3]
        },
        matchScore: Math.floor(Math.random() * 30) + 70,
        summary: "Experienced professional with strong technical background and proven track record of delivering results.",
        availability: ["Immediately", "2 weeks notice", "1 month notice"][index % 3]
      }));

      setParsedResumes(mockParsedData);
      setIsProcessing(false);
      
      toast({
        title: "Resumes Processed",
        description: `Successfully parsed ${files.length} resume(s) using AI.`
      });
    }, 3000);
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
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.zip"
              onChange={handleFileUpload}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload">
              <Button className="bg-pulse-500 hover:bg-pulse-600" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  "Choose Files"
                )}
              </Button>
            </label>
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
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
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
                      <Badge className="bg-green-100 text-green-800">
                        {resume.matchScore}% match
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Contact</h4>
                        <p className="text-sm text-gray-600">{resume.candidate.email}</p>
                        <p className="text-sm text-gray-600">{resume.candidate.location}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Experience</h4>
                        <p className="text-sm text-gray-600">
                          {resume.experience.years} years • {resume.experience.previousRoles} roles
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Top Skills</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {resume.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Education</h4>
                        <p className="text-sm text-gray-600">
                          {resume.education.degree} - {resume.education.university}
                        </p>
                      </div>

                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-green-600">🟢 {resume.availability}</span>
                          <Button size="sm" className="bg-pulse-500 hover:bg-pulse-600">
                            Add to Pipeline
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
