
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AdSenseAd from '@/components/AdSenseAd';
import ContentUpload from '@/components/VideoUpload';
import VideoPlayer from '@/components/VideoPlayer';
import ContentCreatorDashboard from '@/components/ContentCreatorDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Navigate, useNavigate } from 'react-router-dom';
import { Video, Upload, TrendingUp, Users, Search, Calendar } from 'lucide-react';

const Videos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<any[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVideos();
    fetchTrendingVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          user:user_id (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setVideos(data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const fetchTrendingVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          user:user_id (
            full_name,
            avatar_url
          )
        `)
        .order('views_count', { ascending: false })
        .limit(5);

      if (!error && data) {
        setTrendingVideos(data);
      }
    } catch (error) {
      console.error('Error fetching trending videos:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleVideoSelect = (video: any) => {
    setSelectedVideo(video);
    
    supabase
      .from('videos')
      .update({ views_count: (video.views_count || 0) + 1 })
      .eq('id', video.id)
      .then(() => {
        fetchVideos();
        fetchTrendingVideos();
      });
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              LifeFlow Videos
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Share your creativity and connect with our vibrant community through video content.
            </p>
          </div>

          <div className="mx-auto max-w-lg mb-8">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Discover amazing videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-2 border-blue-200 focus:border-purple-400 rounded-full"
              />
              <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full px-6">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </div>

          <Tabs defaultValue="discover" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/70 backdrop-blur-md rounded-full p-1">
              <TabsTrigger value="discover" className="rounded-full">Discover</TabsTrigger>
              <TabsTrigger value="trending" className="rounded-full">Trending</TabsTrigger>
              <TabsTrigger value="create" className="rounded-full">Create</TabsTrigger>
              <TabsTrigger value="dashboard" className="rounded-full">Dashboard</TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-8">
              {selectedVideo ? (
                <div className="grid grid-cols-1 gap-8">
                  <VideoPlayer 
                    video={selectedVideo} 
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedVideo(null)}
                    className="w-full md:w-auto rounded-full border-2 border-blue-200 hover:bg-blue-50"
                  >
                    Back to All Videos
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {videos.map((video) => (
                    <Card 
                      key={video.id} 
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:scale-105"
                      onClick={() => handleVideoSelect(video)}
                    >
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative">
                        {video.thumbnail_url ? (
                          <img 
                            src={video.thumbnail_url} 
                            alt={video.title}
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="h-12 w-12 text-blue-400" />
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                          {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : "00:00"}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-2 text-gray-800">{video.title}</h3>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                              {video.user?.avatar_url ? (
                                <img 
                                  src={video.user.avatar_url} 
                                  alt={video.user.full_name}
                                  className="w-6 h-6 rounded-full"
                                />
                              ) : (
                                <span className="text-xs text-white font-bold">{video.user?.full_name?.charAt(0) || 'U'}</span>
                              )}
                            </div>
                            <span className="text-xs text-gray-600 font-medium">{video.user?.full_name}</span>
                          </div>
                          <span className="text-xs text-purple-600 font-semibold">{video.views_count || 0} views</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {videos.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                        <Video className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No videos discovered yet</h3>
                        <p className="text-gray-600 mb-4">Be the first creator to share amazing content with LifeFlow!</p>
                        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full px-6">
                          <Upload className="h-4 w-4 mr-2" />
                          Start Creating
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="trending" className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                {trendingVideos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-64 aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative flex-shrink-0">
                        {video.thumbnail_url ? (
                          <img 
                            src={video.thumbnail_url} 
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="h-12 w-12 text-blue-400" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2">
                          <div className="flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6 flex-1">
                        <h3 className="font-semibold text-xl text-gray-800 mb-2">{video.title}</h3>
                        {video.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{video.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                              {video.user?.avatar_url ? (
                                <img 
                                  src={video.user.avatar_url} 
                                  alt={video.user.full_name}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <span className="text-xs text-white font-bold">{video.user?.full_name?.charAt(0) || 'U'}</span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{video.user?.full_name}</p>
                              <p className="text-xs text-gray-500">{new Date(video.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-purple-600 font-semibold">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {video.views_count || 0}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}

                {trendingVideos.length === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                      <TrendingUp className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No trending content yet</h3>
                      <p className="text-gray-600">Popular videos will appear here as the community grows</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-8" id="create-tab">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ContentUpload onContentUploaded={fetchVideos} />
                </div>
                <div>
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-purple-700">Creator Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-700">Content Standards</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• Share authentic, original content</li>
                          <li>• Keep videos engaging and community-friendly</li>
                          <li>• Use clear titles and descriptions</li>
                          <li>• Respect copyright and intellectual property</li>
                          <li>• Follow LifeFlow community standards</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-700">Technical Guidelines</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• Maximum file size: 100MB</li>
                          <li>• Recommended: 1080p or 720p resolution</li>
                          <li>• Supported: MP4, MOV, AVI formats</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dashboard">
              <ContentCreatorDashboard />
            </TabsContent>
          </Tabs>

          <div className="mt-12">
            <AdSenseAd 
              adSlot="1234567890"
              adFormat="auto"
              style={{ display: 'block' }}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Videos;
