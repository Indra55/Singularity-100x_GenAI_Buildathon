import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Sparkles, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const JDMaker = ({ user }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedJD, setGeneratedJD] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    job_title: "",
    department: "",
    company_overview: "",
    responsibilities: "",
    required_skills: "",
    preferred_skills: "",
    work_type: "",
    location: "",
    employment_type: "",
    seniority_level: "",
    salary_range: "",
    perks: "",
    tone: "Professional"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateJD = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(
        "http://localhost:4100/jd/generate_jd",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setGeneratedJD(response.data.data);
        toast({
          title: "Success",
          description: "Job description generated successfully"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to generate job description",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedJD);
    toast({
      title: "Copied",
      description: "Job description copied to clipboard"
    });
  };

  const downloadJD = () => {
    const blob = new Blob([generatedJD], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.job_title.replace(/\s+/g, '_')}_JD.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-pulse-500" />
            Job Description Maker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Job Title</label>
                <Input
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Department</label>
                <Input
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="e.g., Engineering"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Company Overview</label>
                <Textarea
                  name="company_overview"
                  value={formData.company_overview}
                  onChange={handleInputChange}
                  placeholder="Brief description of your company..."
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Responsibilities</label>
                <Textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleInputChange}
                  placeholder="List key responsibilities..."
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Required Skills</label>
                <Textarea
                  name="required_skills"
                  value={formData.required_skills}
                  onChange={handleInputChange}
                  placeholder="List required skills..."
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Preferred Skills</label>
                <Textarea
                  name="preferred_skills"
                  value={formData.preferred_skills}
                  onChange={handleInputChange}
                  placeholder="List preferred skills..."
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Work Type</label>
                <Select
                  value={formData.work_type}
                  onValueChange={(value) => handleSelectChange("work_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select work type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., New York, NY"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Employment Type</label>
                <Select
                  value={formData.employment_type}
                  onValueChange={(value) => handleSelectChange("employment_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Seniority Level</label>
                <Select
                  value={formData.seniority_level}
                  onValueChange={(value) => handleSelectChange("seniority_level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select seniority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Salary Range</label>
                <Input
                  name="salary_range"
                  value={formData.salary_range}
                  onChange={handleInputChange}
                  placeholder="e.g., $80,000 - $120,000"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Perks & Benefits</label>
                <Textarea
                  name="perks"
                  value={formData.perks}
                  onChange={handleInputChange}
                  placeholder="List perks and benefits..."
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Tone</label>
                <Select
                  value={formData.tone}
                  onValueChange={(value) => handleSelectChange("tone", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Casual">Casual</SelectItem>
                    <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="Formal">Formal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={generateJD}
              disabled={isGenerating}
              className="w-full bg-pulse-500 hover:bg-pulse-600"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Job Description
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedJD && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Job Description</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" onClick={downloadJD}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none dark:prose-invert">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => (
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2" {...props} />
                  ),
                  h2: ({node, ...props}) => (
                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4" {...props} />
                  ),
                  h3: ({node, ...props}) => (
                    <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3" {...props} />
                  ),
                  p: ({node, ...props}) => (
                    <p className="text-gray-600 leading-relaxed mb-4" {...props} />
                  ),
                  ul: ({node, ...props}) => (
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600" {...props} />
                  ),
                  ol: ({node, ...props}) => (
                    <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-600" {...props} />
                  ),
                  li: ({node, ...props}) => (
                    <li className="mb-1" {...props} />
                  ),
                  strong: ({node, ...props}) => (
                    <strong className="font-semibold text-gray-900" {...props} />
                  ),
                  em: ({node, ...props}) => (
                    <em className="italic text-gray-700" {...props} />
                  ),
                  code: ({node, inline, ...props}) => 
                    inline ? (
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800" {...props} />
                    ) : (
                      <code className="block bg-gray-100 p-4 rounded-lg text-sm font-mono text-gray-800 overflow-x-auto" {...props} />
                    ),
                  pre: ({node, ...props}) => (
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto" {...props} />
                  ),
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700" {...props} />
                  ),
                  hr: ({node, ...props}) => (
                    <hr className="my-6 border-gray-200" {...props} />
                  ),
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200" {...props} />
                    </div>
                  ),
                  thead: ({node, ...props}) => (
                    <thead className="bg-gray-50" {...props} />
                  ),
                  tbody: ({node, ...props}) => (
                    <tbody className="bg-white divide-y divide-gray-200" {...props} />
                  ),
                  tr: ({node, ...props}) => (
                    <tr className="hover:bg-gray-50" {...props} />
                  ),
                  th: ({node, ...props}) => (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
                  ),
                  td: ({node, ...props}) => (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" {...props} />
                  ),
                }}
              >
                {generatedJD}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JDMaker; 