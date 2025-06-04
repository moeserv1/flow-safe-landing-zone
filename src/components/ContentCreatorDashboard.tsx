
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, DollarSign, Eye, Heart, TrendingUp, Video, Users, Calendar } from 'lucide-react';

const ContentCreatorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalVideos: 0,
    subscribers: 0,
    earnings: 0,
    thisMonthViews: 0
  });
  const [recentVideos, setRecentVideos] = useState([]);
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    if (user) {
      fetchCreatorStats();
      fetchRecentVideos();
      fetchEarnings();
    }
  }, [user]);

  const fetchCreatorStats = async () => {
    if (!user) return;

    // Fetch video stats
    const { data: videos } = await supabase
      .from('videos')
      .select('views_count, likes_count, created_at')
      .eq('user_id', user.id);

    if (videos) {
      const totalViews = videos.reduce((sum, v) => sum + (v.views_count || 0), 0);
      const totalLikes = videos.reduce((sum, v) => sum + (v.likes_count || 0), 0);
      const thisMonth = new Date();
      thisMonth.setMonth(thisMonth.getMonth() - 1);
      
      const thisMonthViews = videos
        .filter(v => new Date(v.created_at) > thisMonth)
        .reduce((sum, v) => sum + (v.views_count || 0), 0);

      setStats(prev => ({
        ...prev,
        totalViews,
        totalLikes,
        totalVideos: videos.length,
        thisMonthViews
      }));
    }

    // Fetch subscriber count (from social connections or followers)
    const { count: subscriberCount } = await supabase
      .from('friendships')
      .select('*', { count: 'exact', head: true })
      .eq('addressee_id', user.id)
      .eq('status', 'accepted');

    setStats(prev => ({
      ...prev,
      subscribers: subscriberCount || 0
    }));
  };

  const fetchRecentVideos = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) {
      setRecentVideos(data);
    }
  };

  const fetchEarnings = async () => {
    if (!user) return;

    // Fetch earnings data
    const { data } = await supabase
      .from('creator_earnings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(12);

    if (data) {
      setEarnings(data);
      const totalEarnings = data.reduce((sum, e) => sum + (e.amount || 0), 0);
      setStats(prev => ({ ...prev, earnings: totalEarnings }));
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Please sign in to view your creator dashboard</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.subscribers.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Video className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalVideos}</p>
                <p className="text-sm text-gray-600">Total Videos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">${stats.earnings.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Dashboard */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="monetization">Monetization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Views this month</span>
                    <span className="font-bold">{stats.thisMonthViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avg. views per video</span>
                    <span className="font-bold">
                      {stats.totalVideos > 0 ? Math.round(stats.totalViews / stats.totalVideos).toLocaleString() : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Engagement rate</span>
                    <span className="font-bold">
                      {stats.totalViews > 0 ? ((stats.totalLikes / stats.totalViews) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Creator Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Current Level</span>
                    <Badge variant="secondary">
                      {stats.subscribers < 100 ? 'Beginner' : 
                       stats.subscribers < 1000 ? 'Growing' :
                       stats.subscribers < 10000 ? 'Established' : 'Pro'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {stats.subscribers < 100 ? 'Reach 100 subscribers to unlock more features' :
                     stats.subscribers < 1000 ? 'Reach 1,000 subscribers for monetization' :
                     'Congratulations! You have full access to all creator features'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentVideos.map((video: any) => (
                  <div key={video.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <Video className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{video.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{video.views_count || 0} views</span>
                        <span>{new Date(video.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}

                {recentVideos.length === 0 && (
                  <div className="text-center p-6">
                    <p className="text-gray-600">No videos uploaded yet</p>
                    <Button className="mt-4">Upload Your First Video</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Growth Analytics</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <p className="text-center mt-8 text-gray-500">Interactive analytics charts will appear here as you gather more data</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monetization">
          <Card>
            <CardHeader>
              <CardTitle>Monetization Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Creator Program Status</h3>
                  <div className="mt-2">
                    {stats.subscribers >= 1000 ? (
                      <Badge className="bg-green-500">Eligible</Badge>
                    ) : (
                      <div className="space-y-2">
                        <Badge variant="outline">Not Yet Eligible</Badge>
                        <p className="text-sm text-gray-600">
                          You need {1000 - stats.subscribers} more subscribers to qualify for monetization
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Earnings Methods</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Content engagement</span>
                      <Badge variant={stats.subscribers >= 1000 ? "default" : "outline"}>
                        {stats.subscribers >= 1000 ? "Active" : "Locked"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Tips & donations</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Ad revenue sharing</span>
                      <Badge variant={stats.subscribers >= 5000 ? "default" : "outline"}>
                        {stats.subscribers >= 5000 ? "Active" : "Locked"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentCreatorDashboard;
