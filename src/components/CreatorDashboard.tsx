
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  Users, 
  Eye, 
  TrendingUp, 
  Video, 
  Heart,
  MessageCircle,
  Calendar,
  Award
} from 'lucide-react';

const CreatorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    followers: 0,
    totalViews: 0,
    totalVideos: 0,
    totalLikes: 0,
    engagement: 0
  });
  const [recentContent, setRecentContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user's videos for stats
      const { data: videos, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user?.id);

      if (videosError) throw videosError;

      // Fetch social posts for additional content
      const { data: posts, error: postsError } = await supabase
        .from('social_posts')
        .select('*')
        .eq('author_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (postsError) throw postsError;

      // Calculate stats from existing data
      const totalViews = videos?.reduce((sum, video) => sum + (video.views_count || 0), 0) || 0;
      const totalLikes = videos?.reduce((sum, video) => sum + (video.likes_count || 0), 0) || 0;
      const totalVideos = videos?.length || 0;

      // Simulate earnings based on views (simplified model)
      const earnings = Math.floor(totalViews * 0.001); // $0.001 per view

      // Get follower count from friendships
      const { count: followerCount } = await supabase
        .from('friendships')
        .select('*', { count: 'exact', head: true })
        .eq('addressee_id', user?.id)
        .eq('status', 'accepted');

      setStats({
        totalEarnings: earnings,
        followers: followerCount || 0,
        totalViews,
        totalVideos,
        totalLikes,
        engagement: totalViews > 0 ? Math.round((totalLikes / totalViews) * 100) : 0
      });

      setRecentContent(posts || []);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Creator Program Status */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Creator Program Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                To join the Creator Program, you need:
              </p>
              <ul className="text-sm space-y-1">
                <li className={`flex items-center gap-2 ${stats.followers >= 1000 ? 'text-green-600' : 'text-gray-600'}`}>
                  <span className={`w-2 h-2 rounded-full ${stats.followers >= 1000 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  1,000+ followers ({stats.followers}/1,000)
                </li>
                <li className={`flex items-center gap-2 ${stats.totalViews >= 240000 ? 'text-green-600' : 'text-gray-600'}`}>
                  <span className={`w-2 h-2 rounded-full ${stats.totalViews >= 240000 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  4,000+ watch hours ({Math.floor(stats.totalViews / 60)} hours)
                </li>
              </ul>
            </div>
            <Badge variant={stats.followers >= 1000 && stats.totalViews >= 240000 ? "default" : "secondary"}>
              {stats.followers >= 1000 && stats.totalViews >= 240000 ? "Eligible" : "Not Eligible"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">${stats.totalEarnings}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Followers</p>
                <p className="text-2xl font-bold">{stats.followers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement</p>
                <p className="text-2xl font-bold">{stats.engagement}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Videos</span>
                </div>
                <span className="font-semibold">{stats.totalVideos}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Total Likes</span>
                </div>
                <span className="font-semibold">{stats.totalLikes}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Posts</span>
                </div>
                <span className="font-semibold">{recentContent.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentContent.length > 0 ? (
                recentContent.slice(0, 3).map((content, index) => (
                  <div key={content.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">{content.content}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {new Date(content.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monetization Options */}
      <Card>
        <CardHeader>
          <CardTitle>Monetization Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Ad Revenue</h4>
              <p className="text-sm text-gray-600 mb-3">Earn from ads displayed on your content</p>
              <Button size="sm" variant="outline" className="w-full">Enable Ads</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Memberships</h4>
              <p className="text-sm text-gray-600 mb-3">Offer exclusive content to members</p>
              <Button size="sm" variant="outline" className="w-full">Set Up</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Tips & Donations</h4>
              <p className="text-sm text-gray-600 mb-3">Let fans support you directly</p>
              <Button size="sm" variant="outline" className="w-full">Enable Tips</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Affiliate Marketing</h4>
              <p className="text-sm text-gray-600 mb-3">Earn from product recommendations</p>
              <Button size="sm" variant="outline" className="w-full">Join Program</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorDashboard;
