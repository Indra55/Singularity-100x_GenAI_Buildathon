import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import { 
  Bell, 
  Search, 
  Settings, 
  LogOut, 
  Mail, 
  User, 
  Building, 
  MapPin, 
  Users
} from "lucide-react";

// UI Components - Dropdown
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// UI Components - Dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DashboardNavbarProps {
  user?: any; // Temporarily using any to avoid type issues
  selectedCount: number;
}

interface UserProfile {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  sector?: string;
  company_size?: string;
  officelocations?: string[];
  keydepartments?: string[];
  created_at: string;
  updated_at: string;
  onboarding_complete: boolean;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ user, selectedCount }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const { logout, user: authUser } = useAuth();
  const navigate = useNavigate();

  // Use authUser from context if user prop is not provided
  const currentUser = user || authUser || {};

  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log('Fetching profile data...');
      const response = await api.get('/users/myprofile');
      console.log('Complete Profile API response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        config: response.config
      });
      
      // Check if response.data exists and has the expected structure
      if (response.data && typeof response.data === 'object') {
        // Check if data is nested under 'user' or is the user object directly
        const userData = response.data.user || response.data;
        console.log('Extracted user data:', userData);
        
        // Log all keys in the user data
        if (userData) {
          console.log('Available user data keys:', Object.keys(userData));
          console.log('User data values:', userData);
        }
        
        if (userData) {
          setProfile(userData);
        } else {
          console.log('No user data found in response');
        }
      } else {
        console.log('Unexpected response format:', response);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    setShowProfile(true);
    fetchProfile();
  };

  const handleSignOut = async () => {
    try {
      await logout();
      // Navigate to the root path after successful logout
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, still navigate to login
      navigate('/');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="TalentGPT" className="h-8" />
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Global search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {selectedCount > 0 && (
            <Badge variant="default" className="bg-pulse-500">
              {selectedCount} selected
            </Badge>
          )}
          
          <Button variant="ghost" size="sm">
            <Bell className="w-5 h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-pulse-500 text-white">
                    {(currentUser?.username || currentUser?.email?.[0] || 'U').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 p-2" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {currentUser?.username || currentUser?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Inbox</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          
          {loading ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          ) : profile ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>
                    {profile.first_name?.[0]}{profile.last_name?.[0] || profile.username?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">
                    {profile.first_name || profile.username}
                    {profile.last_name && ` ${profile.last_name}`}
                  </h2>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Username:</span>
                      <span>{profile.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Member Since:</span>
                      <span>{new Date(profile.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>

                {profile.company_name && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Company</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p>{profile.company_name}</p>
                      </div>
                      {profile.sector && (
                        <div>
                          <p className="text-sm text-muted-foreground">Sector</p>
                          <p>{profile.sector}</p>
                        </div>
                      )}
                      {profile.company_size && (
                        <div>
                          <p className="text-sm text-muted-foreground">Size</p>
                          <p>{profile.company_size}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {profile.officelocations && profile.officelocations.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Office Locations</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {profile.officelocations.map((location, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{location}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {profile.keydepartments && profile.keydepartments.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Key Departments</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.keydepartments.map((dept, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {dept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Failed to load profile information</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={fetchProfile}
              >
                Retry
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default DashboardNavbar;
