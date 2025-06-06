
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CreateSocialPost from '@/components/CreateSocialPost';
import SocialPostCard from '@/components/SocialPostCard';
import AdSenseAd from '@/components/AdSenseAd';
import CommunityChat from '@/components/CommunityChat';
import FriendsChat from '@/components/FriendsChat';
import PostCard from '@/components/PostCard';
import StoryViewer from '@/components/StoryViewer';
import NotificationCenter from '@/components/NotificationCenter';
import FriendsList from '@/components/FriendsChat';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageCircle, Share, TrendingUp, Users, Calendar, Bell, Plus } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const SocialMedia = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    activeUsers: 0
  });

  useEffect(() => {
    if (user) {
      fetchPosts();
      fetchStats();
      fetchStories();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('social_posts')
      .select(`
        *,
        profiles:author_id (
          full_name,
          avatar_url,
          username
        )
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setPosts(data);
    }
  };

  const fetchStories = async () => {
    // Mock stories data - in real app this would come from database
    setStories([]);
  };

  const fetchStats = async () => {
    // Get total posts
    const { count: postsCount } = await supabase
      .from('social_posts')
      .select('*', { count: 'exact', head: true });

    const { data: likesData } = await supabase
      .from('social_posts')
      .select('likes_count');
    
    const totalLikes = likesData?.reduce((sum, post) => sum + (post.likes_count || 0), 0) || 0;

    const { data: commentsData } = await supabase
      .from('social_posts')
      .select('comments_count');
    
    const totalComments = commentsData?.reduce((sum, post) => sum + (post.comments_count || 0), 0) || 0;

    const { count: activeUsers } = await supabase
      .from('social_posts')
      .select('author_id', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    setStats({
      totalPosts: postsCount || 0,
      totalLikes,
      totalComments,
      activeUsers: activeUsers || 0
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Social Media Hub</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect, share, and engage with our vibrant community. Share your thoughts, moments, and experiences.
            </p>
          </div>

          {/* Stories Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 overflow-x-auto pb-4">
              <Button
                variant="outline"
                className="flex-shrink-0 h-20 w-20 rounded-full border-dashed"
              >
                <Plus className="h-6 w-6" />
              </Button>
              {/* Story circles would go here */}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.totalPosts}</div>
                <div className="text-sm text-gray-600">Total Posts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.totalLikes}</div>
                <div className="text-sm text-gray-600">Total Likes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.totalComments}</div>
                <div className="text-sm text-gray-600">Total Comments</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.activeUsers}</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Create Post */}
              <CreateSocialPost onPostCreated={fetchPosts} />

              {/* Posts Feed */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
                
                {posts.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                      <p className="text-gray-600">Be the first to share something with the community!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-full"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                {showNotifications && (
                  <div className="absolute top-12 right-0 z-50">
                    <NotificationCenter />
                  </div>
                )}
              </div>

              {/* AdSense Ad */}
              <AdSenseAd 
                adSlot="1234567890"
                adFormat="rectangle"
                style={{ minHeight: '250px' }}
              />

              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">#Community</span>
                      <span className="text-xs text-gray-500">245 posts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">#LifeFlow</span>
                      <span className="text-xs text-gray-500">189 posts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">#Inspiration</span>
                      <span className="text-xs text-gray-500">156 posts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">#Connection</span>
                      <span className="text-xs text-gray-500">134 posts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle>Community Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Be respectful and kind to all members</li>
                    <li>• No spam, hate speech, or inappropriate content</li>
                    <li>• Respect privacy and intellectual property</li>
                    <li>• Report any violations to moderators</li>
                  </ul>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View Full Guidelines
                  </Button>
                </CardContent>
              </Card>

              {/* Another AdSense Ad */}
              <AdSenseAd 
                adSlot="0987654321"
                adFormat="rectangle"
                style={{ minHeight: '250px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Story Viewer */}
      {showStoryViewer && stories.length > 0 && (
        <StoryViewer
          stories={stories}
          onClose={() => setShowStoryViewer(false)}
        />
      )}

      {/* Chat Components */}
      <CommunityChat />
      <FriendsChat />

      <Footer />
    </div>
  );
};

export default SocialMedia;
