import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain,
  Clock,
  User,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Star,
  MessageSquare,
  Play,
  Pause,
  Volume2,
  VolumeX
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Candidate {
  id: string;
  name: string;
  email: string;
  resume: string;
  skills: string[];
}

interface InterviewData {
  candidate: Candidate;
  jobPosition: string;
  interviewType: string;
  scheduledTime: Date;
}

interface InterviewResponse {
  questionIndex: number;
  question: string;
  videoUrl: string;
  transcription: string;
  rating: number;
  notes: string;
  timestamp: Date;
}

const InterviewSession = ({ interviewData, onComplete, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [responses, setResponses] = useState<InterviewResponse[]>([]);
  const [currentRating, setCurrentRating] = useState(0);
  const [currentNotes, setCurrentNotes] = useState("");
  const [sessionStartTime] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // Generate interview questions based on job position and type
  useEffect(() => {
    const generateQuestions = () => {
      const baseQuestions = {
        "Technical Interview": [
          "Can you walk me through your experience with the technologies listed in this job description?",
          "Describe a challenging technical problem you've solved recently.",
          "How do you approach debugging when you encounter an issue?",
          "What's your experience with version control and collaborative development?",
          "How do you stay updated with new technologies and best practices?"
        ],
        "Behavioral Interview": [
          "Tell me about yourself and your career journey.",
          "Describe a time when you had to work under pressure to meet a deadline.",
          "How do you handle conflicts with team members?",
          "Give me an example of a time you took initiative on a project.",
          "What motivates you in your work?"
        ],
        "System Design Interview": [
          "How would you design a scalable web application architecture?",
          "Explain how you would handle database optimization for large datasets.",
          "Describe your approach to ensuring application security.",
          "How would you implement caching in a distributed system?",
          "What factors do you consider when choosing between different technologies?"
        ]
      };

      const selectedQuestions = baseQuestions[interviewData.interviewType] || baseQuestions["Technical Interview"];
      setInterviewQuestions(selectedQuestions);
    };

    generateQuestions();
  }, [interviewData]);

  // Mock function to simulate getting video responses
  const getMockVideoResponse = (index: number) => {
    const mockResponses = {
      "Technical Interview": [
        {
          videoUrl: `https://example.com/interviews/${interviewData.candidate.id}/response_${index}.mp4`,
          transcription: "I have extensive experience with React, Node.js, and TypeScript. In my previous role at TechCorp, I led the development of a real-time collaboration platform using these technologies. We implemented features like live document editing, real-time notifications, and WebSocket integration. I'm particularly proud of optimizing the application's performance, reducing load times by 40% through code splitting and implementing efficient caching strategies."
        },
        {
          videoUrl: `https://example.com/interviews/${interviewData.candidate.id}/response_${index}.mp4`,
          transcription: "Recently, I encountered a critical performance issue in our e-commerce platform where the checkout process was timing out during peak hours. I analyzed the system and found that the database queries weren't properly indexed. I implemented query optimization, added caching layers, and restructured the database schema. This reduced the checkout time from 15 seconds to under 2 seconds and increased our conversion rate by 25%."
        },
        {
          videoUrl: `https://example.com/interviews/${interviewData.candidate.id}/response_${index}.mp4`,
          transcription: "My debugging approach is systematic. First, I try to reproduce the issue in a controlled environment. I use browser dev tools for frontend issues, logging for backend problems, and APM tools for performance issues. I believe in writing comprehensive unit tests and implementing proper error handling. For production issues, I rely on structured logging and monitoring tools to quickly identify the root cause."
        },
        {
          videoUrl: `https://example.com/interviews/${interviewData.candidate.id}/response_${index}.mp4`,
          transcription: "I've been using Git for version control throughout my career. I'm comfortable with Git Flow workflow and have experience with GitHub, GitLab, and Bitbucket. I believe in writing meaningful commit messages and maintaining a clean commit history. I've also set up CI/CD pipelines and automated testing workflows. I regularly conduct code reviews and have mentored junior developers on Git best practices."
        },
        {
          videoUrl: `https://example.com/interviews/${interviewData.candidate.id}/response_${index}.mp4`,
          transcription: "I stay updated through multiple channels. I follow tech blogs like CSS-Tricks and Dev.to, participate in developer communities on Discord and Stack Overflow, and attend conferences like ReactConf and NodeConf. I contribute to open-source projects and maintain a personal blog where I share my learnings. I also take online courses on platforms like Frontend Masters and Pluralsight to deepen my knowledge."
        }
      ],
      "Behavioral Interview": [
        {
          videoUrl: `https://example.com/interviews/${interviewData.candidate.id}/response_${index}.mp4`,
          transcription: "I started my career as a junior developer at a startup, where I quickly learned the importance of taking ownership. Within a year, I was leading a team of three developers. I then moved to a larger company where I worked on enterprise applications. I've always been passionate about creating user-friendly applications and solving complex problems. My career goal is to become a technical lead and mentor other developers."
        },
        {
          videoUrl: `https://example.com/interviews/${interviewData.candidate.id}/response_${index}.mp4`,
          transcription: "Last quarter, we had a critical project with a tight deadline. The client needed a new feature implemented within two weeks. I broke down the work into smaller tasks, prioritized them, and created a detailed timeline. I communicated clearly with the team and stakeholders, and we worked extra hours when needed. We delivered the feature on time, and the client was extremely satisfied with the quality of our work."
        },
        {
          videoUrl: `https://example.com/interviews/${interviewData.candidate.id}/response_${index}.mp4`,
          transcription: "I believe in addressing conflicts directly and professionally. Recently, there was a disagreement about the architecture of a new feature. Instead of letting it escalate, I organized a meeting where everyone could present their viewpoints. We discussed the pros and cons of each approach and reached a consensus that combined the best elements of both proposals. This not only resolved the conflict but also led to a better solution."
        },
        {
          videoUrl: `https://example.com/interviews/${interviewData.candidate.id}/response_${index}.mp4`,
          transcription: "I noticed that our team's code review process was inefficient, often causing delays. I took the initiative to create a standardized code review checklist and implemented automated testing in our CI pipeline. I also organized weekly knowledge-sharing sessions. These changes reduced our deployment time by 30% and improved code quality significantly. The team adopted these practices across other projects as well."
        },
        {
          videoUrl: `https://example.com/interviews/${interviewData.candidate.id}/response_${index}.mp4`,
          transcription: "I'm motivated by creating impactful solutions and continuous learning. I enjoy the challenge of solving complex problems and seeing my work make a difference in users' lives. I'm also passionate about mentoring others and sharing knowledge. The tech industry's constant evolution keeps me engaged, as there's always something new to learn and apply to create better solutions."
        }
      ],
      "System Design Interview": [
        {
          videoUrl: `https://example.com/interviews/${interviewData.candidate.id}/response_${index}.mp4`,
          transcription: "For a scalable web application, I would implement a microservices architecture. The frontend would be a React SPA with server-side rendering for SEO. The backend would be split into domain-specific services, each with its own database. I'd use a message queue like RabbitMQ for async communication and Redis for caching. The system would be containerized with Docker and orchestrated with Kubernetes for easy scaling."
        },
        {
          videoUrl: `https://example.com/interviews/${interviewData.candidate.id}/response_${index}.mp4`,
          transcription: "For database optimization, I would implement several strategies. First, proper indexing based on query patterns. Then, database sharding for horizontal scaling. I'd use read replicas for read-heavy operations and implement connection pooling. For large datasets, I'd consider using a time-series database for analytics and a document database for flexible schemas. Regular maintenance and monitoring would be crucial."
        },
        {
          videoUrl: `https://example.com/interviews/${interviewData.candidate.id}/response_${index}.mp4`,
          transcription: "Security is a top priority. I would implement HTTPS everywhere, use JWT for authentication, and implement rate limiting. I'd use prepared statements to prevent SQL injection and implement input validation. For sensitive data, I'd use encryption at rest and in transit. Regular security audits and penetration testing would be part of the development lifecycle. I'd also implement proper logging and monitoring for security events."
        },
        {
          videoUrl: `https://example.com/interviews/${interviewData.candidate.id}/response_${index}.mp4`,
          transcription: "For caching in a distributed system, I would use a multi-level caching strategy. At the application level, I'd implement in-memory caching with Redis. For CDN caching, I'd use CloudFront or similar services. I'd implement cache invalidation strategies and use cache headers appropriately. For database caching, I'd use query result caching and implement cache warming for frequently accessed data."
        },
        {
          videoUrl: `https://example.com/interviews/${interviewData.candidate.id}/response_${index}.mp4`,
          transcription: "When choosing technologies, I consider several factors. First, the project requirements and constraints. Then, the team's expertise and learning curve. I evaluate the technology's maturity, community support, and documentation. Performance characteristics and scalability are crucial. I also consider maintenance costs and long-term sustainability. Finally, I look at integration capabilities with existing systems."
        }
      ]
    };

    const selectedResponses = mockResponses[interviewData.interviewType] || mockResponses["Technical Interview"];
    return selectedResponses[index] || selectedResponses[0];
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const saveResponse = () => {
    const mockResponse = getMockVideoResponse(currentQuestionIndex);
    const response: InterviewResponse = {
      questionIndex: currentQuestionIndex,
      question: interviewQuestions[currentQuestionIndex],
      videoUrl: mockResponse.videoUrl,
      transcription: mockResponse.transcription,
      rating: currentRating || 0,
      notes: currentNotes,
      timestamp: new Date()
    };

    setResponses(prev => [...prev, response]);
    setCurrentRating(0);
    setCurrentNotes("");
    setIsPlaying(false);

    if (currentQuestionIndex < interviewQuestions.length - 1) {
      nextQuestion();
    } else {
      completeInterview();
    }

    toast({
      title: "Response Saved",
      description: "Your evaluation has been recorded.",
      duration: 1000, // 1 second
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const completeInterview = () => {
    const interviewResults = {
      responses,
      totalDuration: Number(new Date()) - Number(sessionStartTime),
      questionsAnswered: responses.length,
      completionRate: (responses.length / interviewQuestions.length) * 100,
      averageRating: responses.reduce((acc, curr) => acc + curr.rating, 0) / responses.length
    };
    
    onComplete(interviewResults);
    toast({
      title: "Interview Completed",
      description: "Thank you for completing the interview review.",
      duration: 1000, // 1 second
    });
  };

  const currentQuestion = interviewQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / interviewQuestions.length) * 100;
  const mockResponse = getMockVideoResponse(currentQuestionIndex);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Setup
        </Button>
        <div className="text-center">
          <h2 className="text-xl font-bold">Interview Review</h2>
          <p className="text-gray-600">{interviewData.candidate.name} • {interviewData.jobPosition}</p>
        </div>
        <Badge variant="secondary">
          <Clock className="w-4 h-4 mr-1" />
          {Math.floor((Number(new Date()) - Number(sessionStartTime)) / 60000)}min
        </Badge>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {interviewQuestions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Interview Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-pulse-50 p-4 rounded-lg">
            <p className="text-lg font-medium text-pulse-700">{currentQuestion}</p>
          </div>
        </CardContent>
      </Card>

      {/* Video Response */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Candidate's Response
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Video Player */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              src={mockResponse.videoUrl}
              className="w-full h-full object-cover"
              onEnded={() => setIsPlaying(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white/80"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white/80"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Transcription */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Transcription</h4>
            <p className="text-gray-700">{mockResponse.transcription}</p>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={currentRating >= rating ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentRating(rating)}
                >
                  <Star className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <Textarea
            placeholder="Add your notes about the response..."
            value={currentNotes}
            onChange={(e) => setCurrentNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
        >
          Previous Question
        </Button>
        
        {currentQuestionIndex < interviewQuestions.length - 1 ? (
          <Button 
            onClick={() => {
              saveResponse();
            }}
            className="bg-pulse-500 hover:bg-pulse-600"
          >
            Save & Next Question
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={() => {
              saveResponse();
            }}
            className="bg-green-500 hover:bg-green-600"
          >
            Complete Interview
            <CheckCircle className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default InterviewSession;
