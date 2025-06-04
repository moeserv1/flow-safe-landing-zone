
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AdSenseAd from '@/components/AdSenseAd';
import VideoUpload from '@/components/VideoUpload';
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
        .from('videos' as any)
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
        .from('videos' as any)
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
      .from('videos' as any)
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Videos</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch, share, and create videos with our community.
            </p>
          </div>

          <div className="mx-auto max-w-lg mb-8">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </div>

          <Tabs defaultValue="discover" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
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
                    className="w-full md:w-auto"
                  >
                    Back to All Videos
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {videos.map((video) => (
                    <Card 
                      key={video.id} 
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleVideoSelect(video)}
                    >
                      <div className="aspect-video bg-gray-200 relative">
                        {video.thumbnail_url ? (
                          <img 
                            src={video.thumbnail_url} 
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : "00:00"}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
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
                            <span className="text-xs text-gray-600">{video.user?.full_name}</span>
                          </div>
                          <span className="text-xs text-gray-500">{video.views_count || 0} views</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {videos.length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No videos found</h3>
                      <p className="text-gray-600 mt-2">Be the first to upload a video to our community!</p>
                      <Button className="mt-4" onClick={() => document.getElementById('create-tab')?.click()}>
                        <Upload className="h-4 w-4 mr-2" />
                        Create Video
                      </Button>
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
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-64 aspect-video bg-gray-200 relative flex-shrink-0">
                        {video.thumbnail_url ? (
                          <img 
                            src={video.thumbnail_url} 
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2">
                          <div className="flex items-center bg-red-500 text-white text-xs px-2 py-1 rounded">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4 flex-1">
                        <h3 className="font-semibold text-lg">{video.title}</h3>
                        {video.description && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{video.description}</p>
                        )}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                              {video.user.avatar_url ? (
                                <img 
                                  src={video.user.avatar_url} 
                                  alt={video.user.full_name}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <span className="text-xs">{video.user.full_name?.charAt(0) || 'U'}</span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{video.user.full_name}</p>
                              <p className="text-xs text-gray-500">{new Date(video.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
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
                    <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No trending videos yet</h3>
                    <p className="text-gray-600 mt-2">Videos with high engagement will appear here</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-8" id="create-tab">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <VideoUpload onVideoUploaded={fetchVideos} />
                </div>
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Video Guidelines</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• Keep videos under 10 minutes for better engagement</li>
                          <li>• Use clear titles that describe your content</li>
                          <li>• Add relevant tags to improve discoverability</li>
                          <li>• Ensure you have rights to all content in your videos</li>
                          <li>• Follow community guidelines</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Technical Requirements</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• Maximum file size: 100MB</li>
                          <li>• Recommended resolution: 1080p or 720p</li>
                          <li>• Supported formats: MP4, MOV, AVI</li>
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
