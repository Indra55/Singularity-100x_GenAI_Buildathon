import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building, Mail, User, Briefcase, MapPin, Users } from 'lucide-react';
import api from '@/lib/api';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name?: string;
  sector?: string;
  company_size?: string;
  office_locations?: string[];
  key_departments?: string[];
  created_at: string;
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        if (response.data) {
          setProfile(response.data);
        } else {
          setError('No profile data found');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" alt={`${profile?.first_name} ${profile?.last_name}`} />
                <AvatarFallback>
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {profile?.first_name} {profile?.last_name}
                </CardTitle>
                <CardDescription>{profile?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            {profile?.company_name && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <Building className="mr-2 h-5 w-5" /> Company Information
                </h3>
                <div className="grid gap-2 pl-7">
                  <div className="flex items-center">
                    <span className="font-medium w-32">Company:</span>
                    <span>{profile.company_name}</span>
                  </div>
                  {profile.sector && (
                    <div className="flex items-center">
                      <span className="font-medium w-32">Sector:</span>
                      <span>{profile.sector}</span>
                    </div>
                  )}
                  {profile.company_size && (
                    <div className="flex items-center">
                      <span className="font-medium w-32">Company Size:</span>
                      <span>{profile.company_size}</span>
                    </div>
                  )}
                  {profile.office_locations?.length > 0 && (
                    <div className="flex items-start">
                      <span className="font-medium w-32 flex-shrink-0 flex items-start">
                        <MapPin className="h-4 w-4 mr-1 mt-1" />
                        Locations:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {profile.office_locations.map((location, i) => (
                          <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {location}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {profile.key_departments?.length > 0 && (
                    <div className="flex items-start">
                      <span className="font-medium w-32 flex-shrink-0 flex items-start">
                        <Users className="h-4 w-4 mr-1 mt-1" />
                        Departments:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {profile.key_departments.map((dept, i) => (
                          <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {dept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-500">{profile?.email}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-gray-500">•••••••••••</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
