
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
import { Heart, MessageCircle, TrendingUp, Users, Eye, Calendar, Share2, Briefcase, BookOpen, Video, RadioIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Community = () => {
  const { user } = useAuth();
  const [recentPosts, setRecentPosts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
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

    // Fetch recent videos
    try {
      const { data: videos } = await supabase
        .from('videos' as any)
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
        setRecentVideos(videos);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalMembers}</div>
              <div className="text-sm text-gray-600">Community Members</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Share2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalPosts}</div>
              <div className="text-sm text-gray-600">Posts Shared</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.activeToday}</div>
              <div className="text-sm text-gray-600">Active Today</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="feed" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="feed">Social Feed</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="live">Live</TabsTrigger>
                <TabsTrigger value="blog">Blog</TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="space-y-6">
                {user ? (
                  <div className="space-y-6">
                    <CreateSocialPost onPostCreated={refreshPosts} />
                    
                    {recentPosts.length > 0 ? (
                      <div className="space-y-6">
                        {recentPosts.slice(0, 2).map((post) => (
                          <SocialPostCard key={post.id} post={post} />
                        ))}
                        <div className="text-center">
                          <Link to="/social">
                            <Button variant="outline">See More Posts</Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                          <p className="text-gray-600">Be the first to share something with the community!</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Join Our Community</h3>
                      <p className="text-gray-600 mb-4">Connect with like-minded people and share your experiences</p>
                      <Link to="/auth">
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-700">
                          Sign Up Now
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="videos" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentVideos.map((video: any) => (
                    <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="aspect-video bg-gray-200 relative">
                        {video.thumbnail_url ? (
                          <img 
                            src={video.thumbnail_url} 
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                            {video.user?.avatar_url ? (
                              <img 
                                src={video.user.avatar_url} 
                                alt={video.user.full_name}
                                className="w-6 h-6 rounded-full"
                              />
                            ) : (
                              <span className="text-xs">{video.user?.full_name?.charAt(0) || 'U'}</span>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">{video.user?.full_name}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="text-center">
                  <Link to="/videos">
                    <Button>View All Videos</Button>
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
            <AdSenseAd 
              adSlot="1234567890"
              adFormat="rectangle"
              style={{ minHeight: '250px' }}
            />

            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  LifeFlow is a place where hearts connect. Please follow our guidelines to maintain a positive environment.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li>• Be respectful and kind</li>
                  <li>• No spam or inappropriate content</li>
                  <li>• Respect others' privacy</li>
                  <li>• Report any violations</li>
                </ul>
                <Link to="/community-guidelines">
                  <Button variant="outline" size="sm" className="w-full">
                    Read Full Guidelines
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/jobs" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Job Opportunities
                  </Button>
                </Link>
                <Link to="/videos" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <Video className="h-4 w-4 mr-2" />
                    Videos & Content
                  </Button>
                </Link>
                <Link to="/live" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <RadioIcon className="h-4 w-4 mr-2" />
                    Live Streams
                  </Button>
                </Link>
                <Link to="/blog" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Blog & Articles
                  </Button>
                </Link>
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

      <FeaturesSection />

      {user && <CommunityChat />}

      <Footer />
    </div>
  );
};

export default Community;
