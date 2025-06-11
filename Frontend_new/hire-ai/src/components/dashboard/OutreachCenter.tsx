
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Mail, 
  Linkedin, 
  Phone, 
  Edit, 
  Send, 
  Copy,
  X,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OutreachCenter = ({ selectedCandidates, onCandidateRemove }) => {
  const [selectedChannel, setSelectedChannel] = useState("linkedin");
  const [messages, setMessages] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const channels = [
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, style: "Professional" },
    { id: "email", name: "Email", icon: Mail, style: "Detailed" },
    { id: "whatsapp", name: "WhatsApp", icon: Phone, style: "Casual" }
  ];

  const generateMessage = async (candidate, channel) => {
    setIsGenerating(true);
    
    // Simulate AI message generation
    setTimeout(() => {
      const templates = {
        linkedin: `Hi ${candidate.name},

I came across your profile and was impressed by your experience as a ${candidate.title} at ${candidate.company}. 

Your background in ${candidate.skills.slice(0, 2).join(' and ')} aligns perfectly with an exciting opportunity I'm working on.

Would you be open to a brief conversation about a ${candidate.title} role with one of our innovative clients?

Best regards,
[Your Name]`,
        
        email: `Subject: Exciting ${candidate.title} Opportunity

Hi ${candidate.name},

I hope this email finds you well. I'm reaching out regarding an exceptional ${candidate.title} opportunity that I believe would be a perfect match for your expertise.

Given your impressive background at ${candidate.company} and your skills in ${candidate.skills.slice(0, 3).join(', ')}, I think this role could be an excellent next step in your career.

The position offers:
• Competitive compensation package
• Cutting-edge technology stack
• Remote-friendly culture
• Opportunity to work on impactful AI projects

Would you be interested in learning more? I'd love to schedule a brief call to discuss the details.

Best regards,
[Your Name]
[Your Title]
[Company Name]
[Phone] | [Email]`,

        whatsapp: `Hey ${candidate.name}! 👋

Hope you're doing well! I've got an exciting ${candidate.title} opportunity that I think you'd love.

Your experience with ${candidate.skills[0]} and ${candidate.skills[1]} is exactly what my client is looking for.

Interested in a quick chat? 🚀`
      };

      setMessages(prev => ({
        ...prev,
        [`${candidate.id}_${channel}`]: templates[channel]
      }));
      
      setIsGenerating(false);
      toast({
        title: "Message Generated",
        description: `AI-powered ${channel} message created for ${candidate.name}`
      });
    }, 2000);
  };

  const sendMessage = (candidate, channel) => {
    toast({
      title: "Message Ready",
      description: `${channel} message for ${candidate.name} is ready to send`
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Message copied successfully"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-pulse-500" />
            Outreach Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedCandidates.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">No candidates selected</h3>
              <p className="text-gray-400">Select candidates from your search results to start outreach</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Outreach Queue ({selectedCandidates.length} candidates)
                </h3>
                <div className="flex gap-2">
                  {channels.map((channel) => (
                    <Button
                      key={channel.id}
                      variant={selectedChannel === channel.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedChannel(channel.id)}
                      className={selectedChannel === channel.id ? "bg-pulse-500 hover:bg-pulse-600" : ""}
                    >
                      <channel.icon className="w-4 h-4 mr-2" />
                      {channel.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {selectedCandidates.map((candidate) => {
                  const messageKey = `${candidate.id}_${selectedChannel}`;
                  const hasMessage = messages[messageKey];

                  return (
                    <Card key={candidate.id} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-pulse-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {candidate.avatar}
                            </div>
                            <div>
                              <h4 className="font-semibold">{candidate.name}</h4>
                              <p className="text-sm text-gray-600">{candidate.title} at {candidate.company}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  {candidate.matchScore}% match
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {channels.find(c => c.id === selectedChannel)?.style} tone
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onCandidateRemove(candidate.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        {!hasMessage ? (
                          <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <Sparkles className="w-8 h-8 text-pulse-500 mx-auto mb-3" />
                            <Button
                              onClick={() => generateMessage(candidate, selectedChannel)}
                              disabled={isGenerating}
                              className="bg-pulse-500 hover:bg-pulse-600"
                            >
                              {isGenerating ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4 mr-2" />
                                  Generate {channels.find(c => c.id === selectedChannel)?.name} Message
                                </>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="relative">
                              <Textarea
                                value={messages[messageKey]}
                                onChange={(e) => setMessages(prev => ({
                                  ...prev,
                                  [messageKey]: e.target.value
                                }))}
                                className="min-h-[200px] pr-10"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => copyToClipboard(messages[messageKey])}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => generateMessage(candidate, selectedChannel)}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Regenerate
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => copyToClipboard(messages[messageKey])}
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy
                                </Button>
                              </div>
                              <Button
                                className="bg-pulse-500 hover:bg-pulse-600"
                                onClick={() => sendMessage(candidate, selectedChannel)}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Send via {channels.find(c => c.id === selectedChannel)?.name}
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OutreachCenter;
