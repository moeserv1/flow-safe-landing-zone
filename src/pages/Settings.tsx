
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    bio: '',
    location: '',
    avatar_url: '',
    interests: [] as string[],
    privacy_settings: {
      show_age: true,
      show_location: false,
      allow_friend_requests: true,
      show_online_status: true,
      allow_messages: true
    }
  });

  const [notifications, setNotifications] = useState({
    email_posts: true,
    email_comments: true,
    email_friends: true,
    push_posts: true,
    push_comments: true,
    push_messages: true
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
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          username: data.username || '',
          bio: data.bio || '',
          location: data.location || '',
          avatar_url: data.avatar_url || '',
          interests: data.interests || [],
          privacy_settings: data.privacy_settings || {
            show_age: true,
            show_location: false,
            allow_friend_requests: true,
            show_online_status: true,
            allow_messages: true
          }
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load profile settings",
        variant: "destructive"
      });
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Profile updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Account Settings
            </h1>
            <p className="text-xl text-gray-600">
              Manage your LifeFlow profile and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/70 backdrop-blur-md rounded-full p-1">
              <TabsTrigger value="profile" className="rounded-full">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="privacy" className="rounded-full">
                <Shield className="h-4 w-4 mr-2" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="notifications" className="rounded-full">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance" className="rounded-full">
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="account" className="rounded-full">
                <SettingsIcon className="h-4 w-4 mr-2" />
                Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="text-lg">
                        {profile.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline">Change Photo</Button>
                      <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 2MB</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profile.full_name}
                        onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profile.username}
                        onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="@username"
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

                  <div>
                    <Label>Interests</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeInterest(interest)}>
                          {interest} ×
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Add interest and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addInterest(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="mt-2"
                    />
                  </div>

                  <Button onClick={updateProfile} disabled={loading} className="w-full">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Age on Profile</Label>
                        <p className="text-sm text-gray-500">Let others see your age</p>
                      </div>
                      <Switch
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
                        <Label>Show Location</Label>
                        <p className="text-sm text-gray-500">Display your location publicly</p>
                      </div>
                      <Switch
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
                        <Label>Allow Friend Requests</Label>
                        <p className="text-sm text-gray-500">Let others send you friend requests</p>
                      </div>
                      <Switch
                        checked={profile.privacy_settings.allow_friend_requests}
                        onCheckedChange={(checked) => 
                          setProfile(prev => ({
                            ...prev,
                            privacy_settings: { ...prev.privacy_settings, allow_friend_requests: checked }
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Online Status</Label>
                        <p className="text-sm text-gray-500">Let friends see when you're online</p>
                      </div>
                      <Switch
                        checked={profile.privacy_settings.show_online_status}
                        onCheckedChange={(checked) => 
                          setProfile(prev => ({
                            ...prev,
                            privacy_settings: { ...prev.privacy_settings, show_online_status: checked }
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Allow Messages</Label>
                        <p className="text-sm text-gray-500">Allow others to send you private messages</p>
                      </div>
                      <Switch
                        checked={profile.privacy_settings.allow_messages}
                        onCheckedChange={(checked) => 
                          setProfile(prev => ({
                            ...prev,
                            privacy_settings: { ...prev.privacy_settings, allow_messages: checked }
                          }))
                        }
                      />
                    </div>
                  </div>

                  <Button onClick={updateProfile} disabled={loading} className="w-full">
                    {loading ? 'Saving...' : 'Save Privacy Settings'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Email Notifications</h4>
                    <div className="space-y-3 pl-4">
                      <div className="flex items-center justify-between">
                        <Label>New Posts from Friends</Label>
                        <Switch
                          checked={notifications.email_posts}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email_posts: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Comments on Your Posts</Label>
                        <Switch
                          checked={notifications.email_comments}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email_comments: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Friend Requests</Label>
                        <Switch
                          checked={notifications.email_friends}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email_friends: checked }))}
                        />
                      </div>
                    </div>

                    <h4 className="font-medium pt-4">Push Notifications</h4>
                    <div className="space-y-3 pl-4">
                      <div className="flex items-center justify-between">
                        <Label>New Posts</Label>
                        <Switch
                          checked={notifications.push_posts}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push_posts: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Comments</Label>
                        <Switch
                          checked={notifications.push_comments}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push_comments: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Messages</Label>
                        <Switch
                          checked={notifications.push_messages}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push_messages: checked }))}
                        />
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">Save Notification Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Appearance & Display</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Theme and display customization options coming soon!</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Account Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input value={user.email || ''} disabled />
                    <p className="text-sm text-gray-500">Contact support to change your email</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">Change Password</Button>
                    <Button variant="outline" className="w-full">Download My Data</Button>
                    <Button variant="destructive" className="w-full">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Settings;
