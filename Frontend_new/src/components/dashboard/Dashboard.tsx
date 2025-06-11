
import React, { useState } from "react";
import Navbar from "@/components/dashboard/DashboardNavbar";
import Sidebar from "@/components/dashboard/Sidebar";
import ChatInterface from "@/components/dashboard/ChatInterface";
import CandidateList from "@/components/dashboard/CandidateList";
import ResumeParser from "@/components/dashboard/ResumeParser";
import OutreachCenter from "@/components/dashboard/OutreachCenter";
import Analytics from "@/components/dashboard/Analytics";
import AIInterview from "@/components/dashboard/AIInterview";

const Dashboard = ({ user }) => {
  const [activeView, setActiveView] = useState('search');
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidates(prev => {
      const isSelected = prev.some(c => c.id === candidate.id);
      if (isSelected) {
        return prev.filter(c => c.id !== candidate.id);
      } else {
        return [...prev, candidate];
      }
    });
  };

  const renderContent = () => {
    switch (activeView) {
      case 'search':
        return (
          <ChatInterface 
            user={user}
            onCandidateSelect={handleCandidateSelect}
            selectedCandidates={selectedCandidates}
          />
        );
      case 'candidates':
        return (
          <CandidateList 
            candidates={[]}
            onCandidateSelect={handleCandidateSelect}
            selectedCandidates={selectedCandidates}
          />
        );
      case 'parser':
        return <ResumeParser user={user} />;
      case 'interview':
        return <AIInterview user={user} />;
      case 'outreach':
        return (
          <OutreachCenter 
            selectedCandidates={selectedCandidates}
            onCandidateRemove={(id) => setSelectedCandidates(prev => prev.filter(c => c.id !== id))}
          />
        );
      case 'analytics':
        return <Analytics user={user} />;
      default:
        return (
          <ChatInterface 
            user={user} 
            onCandidateSelect={handleCandidateSelect}
            selectedCandidates={selectedCandidates}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} selectedCount={selectedCandidates.length} />
      <div className="flex">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
