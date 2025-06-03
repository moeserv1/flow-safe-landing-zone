
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Camera, MapPin, Calendar, Users, Heart, Settings } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface PrivacySettings {
  show_age: boolean;
  show_location: boolean;
  allow_friend_requests: boolean;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    location: '',
    interests: [] as string[],
    age_search_min: 16,
    age_search_max: 99,
    privacy_settings: {
      show_age: true,
      show_location: false,
      allow_friend_requests: true
    } as PrivacySettings
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    if (data) {
      setProfile({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        bio: data.bio || '',
        location: data.location || '',
        interests: data.interests || [],
        age_search_min: data.age_search_min || 16,
        age_search_max: data.age_search_max || 99,
        privacy_settings: (data.privacy_settings as PrivacySettings) || {
          show_age: true,
          show_location: false,
          allow_friend_requests: true
        }
      });
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        full_name: `${profile.first_name} ${profile.last_name}`,
        bio: profile.bio,
        location: profile.location,
        interests: profile.interests,
        age_search_min: profile.age_search_min,
        age_search_max: profile.age_search_max,
        privacy_settings: profile.privacy_settings
      })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully!"
      });
    }
    
    setLoading(false);
  };

  const addInterest = (interest: string) => {
    if (interest && !profile.interests.includes(interest)) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  const removeInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const userAge = user.user_metadata?.date_of_birth 
    ? calculateAge(user.user_metadata.date_of_birth) 
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24 mx-auto">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="text-2xl">
                        {profile.first_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      size="sm" 
                      className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-1">
                    {profile.first_name} {profile.last_name}
                  </h2>
                  
                  {userAge && profile.privacy_settings.show_age && (
                    <p className="text-gray-600 mb-2">Age: {userAge}</p>
                  )}
                  
                  {profile.location && profile.privacy_settings.show_location && (
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  
                  {profile.bio && (
                    <p className="text-gray-700 text-sm mb-4">{profile.bio}</p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Member since {new Date(user.created_at || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interests */}
              {profile.interests.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Interests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Profile Settings */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={updateProfile} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profile.first_name}
                          onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profile.last_name}
                          onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="City, Country"
                      />
                    </div>

                    {/* Age Search Preferences */}
                    <div>
                      <Label>Age Search Range</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <Label htmlFor="ageMin" className="text-sm">Minimum Age</Label>
                          <Input
                            id="ageMin"
                            type="number"
                            min="16"
                            max="99"
                            value={profile.age_search_min}
                            onChange={(e) => setProfile(prev => ({ 
                              ...prev, 
                              age_search_min: parseInt(e.target.value) || 16 
                            }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="ageMax" className="text-sm">Maximum Age</Label>
                          <Input
                            id="ageMax"
                            type="number"
                            min="16"
                            max="99"
                            value={profile.age_search_max}
                            onChange={(e) => setProfile(prev => ({ 
                              ...prev, 
                              age_search_max: parseInt(e.target.value) || 99 
                            }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Privacy Settings</Label>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="showAge">Show my age on profile</Label>
                          <p className="text-sm text-gray-600">Other users will see your age</p>
                        </div>
                        <Switch
                          id="showAge"
                          checked={profile.privacy_settings.show_age}
                          onCheckedChange={(checked) => 
                            setProfile(prev => ({
                              ...prev,
                              privacy_settings: { ...prev.privacy_settings, show_age: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="showLocation">Show my location</Label>
                          <p className="text-sm text-gray-600">Display your location on your profile</p>
                        </div>
                        <Switch
                          id="showLocation"
                          checked={profile.privacy_settings.show_location}
                          onCheckedChange={(checked) => 
                            setProfile(prev => ({
                              ...prev,
                              privacy_settings: { ...prev.privacy_settings, show_location: checked }
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="allowFriendRequests">Allow friend requests</Label>
                          <p className="text-sm text-gray-600">Others can send you friend requests</p>
                        </div>
                        <Switch
                          id="allowFriendRequests"
                          checked={profile.privacy_settings.allow_friend_requests}
                          onCheckedChange={(checked) => 
                            setProfile(prev => ({
                              ...prev,
                              privacy_settings: { ...prev.privacy_settings, allow_friend_requests: checked }
                            }))
                          }
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
