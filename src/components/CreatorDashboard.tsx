
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Users, 
  Eye, 
  TrendingUp, 
  PlayCircle, 
  Star,
  Award,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreatorStats {
  followers: number;
  watchHours: number;
  totalEarnings: number;
  monthlyViews: number;
  eligibilityMet: boolean;
  programStatus: string;
}

const CreatorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<CreatorStats>({
    followers: 0,
    watchHours: 0,
    totalEarnings: 0,
    monthlyViews: 0,
    eligibilityMet: false,
    programStatus: 'not_applied'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCreatorStats();
    }
  }, [user]);

  const fetchCreatorStats = async () => {
    if (!user) return;

    try {
      // Fetch creator program status
      const { data: program } = await supabase
        .from('creator_programs')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch earnings
      const { data: earnings } = await supabase
        .from('creator_earnings')
        .select('amount')
        .eq('user_id', user.id);

      // Fetch follower count
      const { data: followers } = await supabase
        .from('friendships')
        .select('id')
        .eq('addressee_id', user.id)
        .eq('status', 'accepted');

      // Fetch content analytics
      const { data: analytics } = await supabase
        .from('content_analytics')
        .select('views_count, watch_time_minutes')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const totalEarnings = earnings?.reduce((sum, earning) => sum + Number(earning.amount), 0) || 0;
      const followerCount = followers?.length || 0;
      const totalViews = analytics?.reduce((sum, a) => sum + (a.views_count || 0), 0) || 0;
      const totalWatchHours = analytics?.reduce((sum, a) => sum + (a.watch_time_minutes || 0), 0) / 60 || 0;

      setStats({
        followers: followerCount,
        watchHours: Math.floor(totalWatchHours),
        totalEarnings,
        monthlyViews: totalViews,
        eligibilityMet: program?.eligibility_met || false,
        programStatus: program?.status || 'not_applied'
      });
    } catch (error) {
      console.error('Error fetching creator stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyToCreatorProgram = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('creator_programs')
        .upsert({
          user_id: user.id,
          program_type: 'content_creator',
          status: 'pending',
          followers_count: stats.followers,
          watch_hours: stats.watchHours
        });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your creator program application has been submitted for review."
      });

      setStats(prev => ({ ...prev, programStatus: 'pending' }));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const eligibilityProgress = Math.min(
    ((stats.followers / 1000) + (stats.watchHours / 4000)) / 2 * 100,
    100
  );

  if (loading) {
    return <div className="p-6">Loading creator dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Creator Dashboard</h1>
        <Badge variant={stats.eligibilityMet ? "default" : "secondary"}>
          {stats.eligibilityMet ? "Eligible" : "Building Audience"}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.followers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {1000 - stats.followers > 0 ? `${1000 - stats.followers} needed for eligibility` : "Requirement met!"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Watch Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.watchHours.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {4000 - stats.watchHours > 0 ? `${4000 - stats.watchHours} needed for eligibility` : "Requirement met!"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="monetization">Monetization</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="program">Creator Program</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Creator Program Eligibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Eligibility</span>
                  <span>{Math.round(eligibilityProgress)}%</span>
                </div>
                <Progress value={eligibilityProgress} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${stats.followers >= 1000 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span>1,000+ Followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${stats.watchHours >= 4000 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span>4,000+ Watch Hours</span>
                </div>
              </div>

              {stats.eligibilityMet && stats.programStatus === 'not_applied' && (
                <Button onClick={applyToCreatorProgram} className="w-full">
                  <Award className="h-4 w-4 mr-2" />
                  Apply to Creator Program
                </Button>
              )}

              {stats.programStatus === 'pending' && (
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-yellow-800">Application Under Review</div>
                  <div className="text-sm text-yellow-600">We'll notify you once your application is processed.</div>
                </div>
              )}

              {stats.programStatus === 'approved' && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-green-800 font-medium">Welcome to the Creator Program!</div>
                  <div className="text-sm text-green-600">You can now monetize your content.</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monetization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monetization Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Ad Revenue</h3>
                  <p className="text-sm text-muted-foreground mb-4">Earn money from ads displayed on your content</p>
                  <Button variant="outline" disabled={stats.programStatus !== 'approved'}>
                    Enable Ads
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Channel Memberships</h3>
                  <p className="text-sm text-muted-foreground mb-4">Offer exclusive perks to your supporters</p>
                  <Button variant="outline" disabled={stats.programStatus !== 'approved'}>
                    Set Up Memberships
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Tips & Donations</h3>
                  <p className="text-sm text-muted-foreground mb-4">Receive direct support from your audience</p>
                  <Button variant="outline">
                    Enable Tips
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Affiliate Marketing</h3>
                  <p className="text-sm text-muted-foreground mb-4">Earn commissions from product recommendations</p>
                  <Button variant="outline">
                    Get Started
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                <p>Detailed analytics will appear here once you start creating content</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="program" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Creator Program Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Revenue Sharing</h4>
                    <p className="text-sm text-muted-foreground">Earn up to 70% revenue share from ads on your content</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Community Features</h4>
                    <p className="text-sm text-muted-foreground">Access to exclusive creator tools and community spaces</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <PlayCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Priority Support</h4>
                    <p className="text-sm text-muted-foreground">Get dedicated support for your content creation journey</p>
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

export default CreatorDashboard;
