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
import axios, { AxiosError } from "axios";
import { Candidate } from "@/services/candidateService";

interface OutreachCenterProps {
  selectedCandidates: Candidate[];
  onCandidateRemove: (id: string) => void;
  userId: string;
}

interface Channel {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  style: string;
}

const OutreachCenter: React.FC<OutreachCenterProps> = ({ 
  selectedCandidates = [], 
  onCandidateRemove, 
  userId 
}) => {
  const [selectedChannel, setSelectedChannel] = useState<string>("linkedin");
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const { toast } = useToast();

  const channels: Channel[] = [
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, style: "Professional" },
    { id: "email", name: "Email", icon: Mail, style: "Detailed" },
    { id: "whatsapp", name: "WhatsApp", icon: Phone, style: "Casual" }
  ] as const;

  const generateMessage = async (candidate: Candidate) => {
    setIsGenerating(true);
    try {
      const res = await axios.post<Array<{ message: string }>>(
        "http://localhost:4100/outreach/generate-outreach",
        {
          userId,
          candidateIds: [candidate.id]
        }
      );

      const msg = res.data[0]?.message || "";

      setMessages(prev => ({
        ...prev,
        [candidate.id]: msg
      }));

      toast({
        title: "Message Generated",
        description: `Generated message for ${candidate.name}`
      });
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      toast({
        title: "Error generating message",
        description: err.response?.data?.error || err.message,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const sendOutreach = async (candidate: Candidate) => {
    const message = messages[candidate.id];
    if (!message) return;

    setIsSending(true);
    try {
      const payload = {
        userId,
        candidateMessages: [
          {
            candidateId: candidate.id,
            message: message
          }
        ]
      };

      console.log('Sending outreach payload:', JSON.stringify(payload, null, 2));
      
      const res = await axios.post<{ results?: Array<{ success: boolean; error?: string }>; success?: boolean; error?: string }>(
        "http://localhost:4100/outreach/send-outreach-emails", 
        payload
      );
      
      console.log('Outreach response:', res.data);

      const result = res.data.results?.[0] || res.data;

      if (result?.success) {
        toast({
          title: "Outreach Sent",
          description: `Email sent to ${candidate.name}`
        });
      } else {
        throw new Error(result?.error || "Unknown error");
      }
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Error sending outreach",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = (text: string): void => {
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
              <p className="text-gray-400">Select candidates to start outreach</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Outreach Queue ({selectedCandidates.length})
                </h3>
                <div className="flex gap-2">
                  {channels.map((channel) => (
                    <Button
                      key={channel.id}
                      variant={selectedChannel === channel.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedChannel(channel.id)}
                    >
                      <channel.icon className="w-4 h-4 mr-2" />
                      {channel.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {selectedCandidates.map((candidate) => {
                  const message = messages[candidate.id];

                  return (
                    <Card key={candidate.id} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-pulse-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {candidate.avatar || candidate.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-semibold">{candidate.name}</h4>
                              <p className="text-sm text-gray-600">
                                {candidate.title} at {candidate.company}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  {(candidate.match_score || candidate.matchScore || 0)}% match
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

                        {!message ? (
                          <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <Sparkles className="w-8 h-8 text-pulse-500 mx-auto mb-3" />
                            <Button
                              onClick={() => generateMessage(candidate)}
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
                                  Generate Message
                                </>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="relative">
                              <Textarea
                                value={message}
                                onChange={(e) =>
                                  setMessages(prev => ({
                                    ...prev,
                                    [candidate.id]: e.target.value
                                  }))
                                }
                                className="min-h-[200px] pr-10"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => copyToClipboard(message)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => generateMessage(candidate)}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Regenerate
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => copyToClipboard(message)}
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy
                                </Button>
                              </div>
                              <Button
                                className="bg-pulse-500 hover:bg-pulse-600"
                                onClick={() => sendOutreach(candidate)}
                                disabled={isSending}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                {isSending ? "Sending..." : "Send Outreach"}
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
