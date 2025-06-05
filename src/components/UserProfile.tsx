
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  MapPin, 
  Calendar, 
  Link as LinkIcon, 
  Settings,
  Heart,
  MessageCircle,
  Users,
  Video,
  Image
} from 'lucide-react';

interface UserProfileProps {
  userId?: string;
}

const UserProfile = ({ userId }: UserProfileProps) => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    posts: 0,
    videos: 0
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const targetUserId = userId || currentUser?.id;
  const isOwnProfile = targetUserId === currentUser?.id;

  useEffect(() => {
    if (targetUserId) {
      fetchUserProfile();
      fetchUserContent();
      fetchUserStats();
      if (!isOwnProfile) {
        checkFollowStatus();
      }
    }
  }, [targetUserId]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserContent = async () => {
    try {
      // Fetch user's posts
      const { data: postsData, error: postsError } = await supabase
        .from('social_posts')
        .select('*')
        .eq('author_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(12);

      if (postsError) throw postsError;
      setPosts(postsData || []);

      // Fetch user's videos
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(12);

      if (videosError) throw videosError;
      setVideos(videosData || []);
    } catch (error: any) {
      console.error('Error fetching content:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Get followers count
      const { count: followersCount } = await supabase
        .from('friendships')
        .select('*', { count: 'exact', head: true })
        .eq('addressee_id', targetUserId)
        .eq('status', 'accepted');

      // Get following count
      const { count: followingCount } = await supabase
        .from('friendships')
        .select('*', { count: 'exact', head: true })
        .eq('requester_id', targetUserId)
        .eq('status', 'accepted');

      setStats({
        followers: followersCount || 0,
        following: followingCount || 0,
        posts: posts.length,
        videos: videos.length
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select('*')
        .eq('requester_id', currentUser?.id)
        .eq('addressee_id', targetUserId)
        .single();

      if (!error && data) {
        setIsFollowing(data.status === 'accepted');
      }
    } catch (error: any) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) return;

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('friendships')
          .delete()
          .eq('requester_id', currentUser.id)
          .eq('addressee_id', targetUserId);

        if (error) throw error;
        setIsFollowing(false);
        setStats(prev => ({ ...prev, followers: prev.followers - 1 }));
        toast({ title: "Unfollowed successfully" });
      } else {
        // Follow
        const { error } = await supabase
          .from('friendships')
          .insert({
            requester_id: currentUser.id,
            addressee_id: targetUserId,
            status: 'accepted'
          });

        if (error) throw error;
        setIsFollowing(true);
        setStats(prev => ({ ...prev, followers: prev.followers + 1 }));
        toast({ title: "Following successfully" });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-20 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 md:w-16 md:h-16 text-white" />
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    {profile?.full_name || 'User Profile'}
                  </h1>
                  {profile?.username && (
                    <p className="text-gray-600 mb-2">@{profile.username}</p>
                  )}
                  {profile?.bio && (
                    <p className="text-gray-700 mb-4 max-w-md">{profile.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {profile?.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(profile?.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <Button variant="outline" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleFollowToggle}
                      variant={isFollowing ? "outline" : "default"}
                      className="flex items-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-6 pt-6 border-t">
                <div className="text-center">
                  <div className="text-xl font-bold">{stats.posts}</div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{stats.videos}</div>
                  <div className="text-sm text-gray-600">Videos</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{stats.followers}</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{stats.following}</div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Videos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <p className="text-sm mb-3 line-clamp-3">{post.content}</p>
                  {post.media_url && (
                    <div className="mb-3">
                      {post.media_type === 'image' ? (
                        <img 
                          src={post.media_url} 
                          alt="Post media"
                          className="w-full h-32 object-cover rounded"
                        />
                      ) : post.media_type === 'video' ? (
                        <video 
                          src={post.media_url}
                          className="w-full h-32 object-cover rounded"
                          controls={false}
                        />
                      ) : null}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {post.likes_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {post.comments_count || 0}
                      </span>
                    </div>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {posts.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No posts yet</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  {video.thumbnail_url ? (
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : "0:00"}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-2 mb-2">{video.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{video.views_count || 0} views</span>
                    <span>{new Date(video.created_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {videos.length === 0 && (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No videos yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
