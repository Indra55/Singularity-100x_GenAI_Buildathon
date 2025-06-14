import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Users, 
  FileText, 
  MessageSquare, 
  BarChart3,
  Bookmark,
  Settings,
  HelpCircle,
  Video,
  Briefcase
} from "lucide-react";

const Sidebar = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: 'search', label: 'Candidate Search', icon: Search },
    { id: 'candidates', label: 'All Candidates', icon: Users },
    { id: 'parser', label: 'Resume Parser', icon: FileText },
    { id: 'jd', label: 'JD Maker', icon: Briefcase },
    { id: 'interview', label: 'AI Interview', icon: Video },
    { id: 'outreach', label: 'Outreach Center', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'saved', label: 'Saved Searches', icon: Bookmark },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeView === item.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeView === item.id 
                  ? 'bg-pulse-500 hover:bg-pulse-600 text-white' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
        <nav className="space-y-2">
          {bottomItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start hover:bg-gray-100"
              onClick={() => onViewChange(item.id)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
