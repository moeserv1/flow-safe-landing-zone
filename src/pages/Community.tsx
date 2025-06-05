import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CreateSocialPost from "@/components/CreateSocialPost";
import SocialPostCard from "@/components/SocialPostCard";
import AdSenseAd from "@/components/AdSenseAd";
import CommunityChat from "@/components/CommunityChat";
import FriendsList from "@/components/FriendsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle, TrendingUp, Users, Eye, Calendar, Share2, Briefcase, BookOpen, Upload, RadioIcon, Sparkles, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Community = () => {
  const { user } = useAuth();
  const [recentPosts, setRecentPosts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalPosts: 0,
    activeToday: 0
  });

  useEffect(() => {
    fetchRecentContent();
    fetchStats();
  }, []);

  const fetchRecentContent = async () => {
    // Fetch recent social posts
    const { data: socialPosts } = await supabase
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
      .limit(3);

    if (socialPosts) {
      setRecentPosts(socialPosts);
    }

    // Fetch recent blog posts
    const { data: blogs } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(3);

    if (blogs) {
      setBlogPosts(blogs);
    }

    // Fetch recent uploads
    try {
      const { data: videos } = await supabase
        .from('videos')
        .select(`
          *,
          user:user_id (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      if (videos) {
        setRecentUploads(videos);
      }
    } catch (error) {
      console.error('Error fetching uploads:', error);
    }
  };

  const fetchStats = async () => {
    // Get total members
    const { count: members } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get total posts
    const { count: posts } = await supabase
      .from('social_posts')
      .select('*', { count: 'exact', head: true });

    // Get active users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: activeUsers } = await supabase
      .from('user_presence')
      .select('*', { count: 'exact', head: true })
      .gte('updated_at', today.toISOString());

    setStats({
      totalMembers: members || 0,
      totalPosts: posts || 0,
      activeToday: activeUsers || 0
    });
  };

  const refreshPosts = () => {
    fetchRecentContent();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 mr-2" />
              <h1 className="text-4xl md:text-6xl font-bold">LifeFlow Community</h1>
              <Sparkles className="h-8 w-8 ml-2" />
            </div>
            <p className="text-xl md:text-2xl mb-6 opacity-90">
              Where hearts connect, creativity flows, and communities thrive
            </p>
            <div className="flex items-center justify-center space-x-2 text-lg">
              <Heart className="h-6 w-6 text-red-300" />
              <span>Share • Connect • Create • Inspire</span>
              <Heart className="h-6 w-6 text-red-300" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {stats.totalMembers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 font-medium">Community Members</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {stats.totalPosts.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 font-medium">Posts Shared</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stats.activeToday.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 font-medium">Active Today</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Tabs defaultValue="feed" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-md rounded-full p-1 shadow-lg">
                  <TabsTrigger value="feed" className="rounded-full font-medium">
                    <Heart className="h-4 w-4 mr-2" />
                    Feed
                  </TabsTrigger>
                  <TabsTrigger value="uploads" className="rounded-full font-medium">
                    <Upload className="h-4 w-4 mr-2" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="live" className="rounded-full font-medium">
                    <RadioIcon className="h-4 w-4 mr-2" />
                    Live
                  </TabsTrigger>
                  <TabsTrigger value="blog" className="rounded-full font-medium">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Stories
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="feed" className="space-y-6">
                  {user ? (
                    <div className="space-y-6">
                      <CreateSocialPost onPostCreated={refreshPosts} />
                      
                      {recentPosts.length > 0 ? (
                        <div className="space-y-6">
                          {recentPosts.slice(0, 3).map((post) => (
                            <SocialPostCard key={post.id} post={post} />
                          ))}
                          <div className="text-center">
                            <Link to="/social">
                              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full px-8">
                                <Star className="h-4 w-4 mr-2" />
                                Discover More Posts
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                          <CardContent className="p-12 text-center">
                            <div className="bg-gradient-to-r from-blue-400 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Share2 className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Start the Conversation</h3>
                            <p className="text-gray-600 mb-4">Be the first to share something amazing with our community!</p>
                            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full">
                              <Sparkles className="h-4 w-4 mr-2" />
                              Create Your First Post
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="p-12 text-center">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Join LifeFlow Today</h3>
                        <p className="text-gray-600 mb-6">Connect with amazing people and share your journey</p>
                        <Link to="/auth">
                          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full px-8">
                            <Heart className="h-4 w-4 mr-2" />
                            Start Your Journey
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="uploads" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recentUploads.map((upload: any) => (
                      <Card key={upload.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="aspect-video bg-gray-200 relative">
                          {upload.thumbnail_url ? (
                            <img 
                              src={upload.thumbnail_url} 
                              alt={upload.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Upload className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold line-clamp-2">{upload.title}</h3>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                              {upload.user?.avatar_url ? (
                                <img 
                                  src={upload.user.avatar_url} 
                                  alt={upload.user.full_name}
                                  className="w-6 h-6 rounded-full"
                                />
                              ) : (
                                <span className="text-xs">{upload.user?.full_name?.charAt(0) || 'U'}</span>
                              )}
                            </div>
                            <span className="text-sm text-gray-600">{upload.user?.full_name}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="text-center">
                    <Link to="/uploads">
                      <Button>View All Uploads</Button>
                    </Link>
                  </div>
                </TabsContent>

                <TabsContent value="live" className="space-y-6">
                  <Card>
                    <CardContent className="p-8 text-center">
                      <RadioIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Live Streams</h3>
                      <p className="text-gray-600 mb-4">Connect in real-time with creators and community members</p>
                      <Link to="/live">
                        <Button>
                          <RadioIcon className="h-4 w-4 mr-2" />
                          Explore Live Streams
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="blog" className="space-y-6">
                  {blogPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {blogPosts.slice(0, 2).map((post) => (
                        <Card key={post.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-0">
                            {post.featured_image_url && (
                              <img 
                                src={post.featured_image_url} 
                                alt={post.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                            )}
                            <div className="p-6">
                              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
                              {post.excerpt && (
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                              )}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {post.view_count || 0}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(post.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                {post.tags && post.tags.length > 0 && (
                                  <Badge variant="secondary">{post.tags[0]}</Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
                        <p className="text-gray-600">Check back later for interesting articles and insights</p>
                      </CardContent>
                    </Card>
                  )}
                  <div className="text-center">
                    <Link to="/blog">
                      <Button variant="outline">View All Articles</Button>
                    </Link>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Friends & Online Users */}
              {user && <FriendsList />}
              
              {/* AdSense Ad */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <AdSenseAd 
                  adSlot="1234567890"
                  adFormat="rectangle"
                  style={{ minHeight: '250px' }}
                />
              </div>

              {/* Community Guidelines */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-purple-700 flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Community Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    LifeFlow is a place where hearts connect. Let's keep it positive and inspiring.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    <li className="flex items-center"><Heart className="h-3 w-3 mr-2 text-red-400" /> Be kind and respectful</li>
                    <li className="flex items-center"><Share2 className="h-3 w-3 mr-2 text-blue-400" /> Share authentic content</li>
                    <li className="flex items-center"><Users className="h-3 w-3 mr-2 text-green-400" /> Respect privacy</li>
                    <li className="flex items-center"><Sparkles className="h-3 w-3 mr-2 text-purple-400" /> Spread positivity</li>
                  </ul>
                  <Link to="/community-guidelines">
                    <Button variant="outline" size="sm" className="w-full rounded-full border-purple-200 text-purple-600 hover:bg-purple-50">
                      Read Full Guidelines
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Quick Access */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-blue-700 flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Quick Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/jobs" className="block">
                    <Button variant="ghost" className="w-full justify-start rounded-full hover:bg-orange-50 text-orange-600">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Career Opportunities
                    </Button>
                  </Link>
                  <Link to="/uploads" className="block">
                    <Button variant="ghost" className="w-full justify-start rounded-full hover:bg-blue-50 text-blue-600">
                      <Upload className="h-4 w-4 mr-2" />
                      Share Content
                    </Button>
                  </Link>
                  <Link to="/live" className="block">
                    <Button variant="ghost" className="w-full justify-start rounded-full hover:bg-red-50 text-red-600">
                      <RadioIcon className="h-4 w-4 mr-2" />
                      Live Streams
                    </Button>
                  </Link>
                  <Link to="/blog" className="block">
                    <Button variant="ghost" className="w-full justify-start rounded-full hover:bg-green-50 text-green-600">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Stories & Articles
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <FeaturesSection />
      {user && <CommunityChat />}
      <Footer />
    </div>
  );
};

export default Community;
