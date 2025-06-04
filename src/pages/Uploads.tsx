
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
import { Navigate } from 'react-router-dom';
import { Upload, TrendingUp, Users, Search, Calendar, Image, Video } from 'lucide-react';

const Uploads = () => {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<any[]>([]);
  const [trendingUploads, setTrendingUploads] = useState<any[]>([]);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUploads();
    fetchTrendingUploads();
  }, []);

  const fetchUploads = async () => {
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
        setUploads(data);
      }
    } catch (error) {
      console.error('Error fetching uploads:', error);
    }
  };

  const fetchTrendingUploads = async () => {
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
        setTrendingUploads(data);
      }
    } catch (error) {
      console.error('Error fetching trending uploads:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleContentSelect = (content: any) => {
    setSelectedContent(content);
    
    supabase
      .from('videos')
      .update({ views_count: (content.views_count || 0) + 1 })
      .eq('id', content.id)
      .then(() => {
        fetchUploads();
        fetchTrendingUploads();
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">LifeFlow Uploads</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Share your content and connect with the LifeFlow community.
            </p>
          </div>

          <div className="mx-auto max-w-lg mb-8">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search uploads..."
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
              <TabsTrigger value="create">Upload</TabsTrigger>
              <TabsTrigger value="dashboard">Creator Hub</TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-8">
              {selectedContent ? (
                <div className="grid grid-cols-1 gap-8">
                  <VideoPlayer 
                    video={selectedContent} 
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedContent(null)}
                    className="w-full md:w-auto"
                  >
                    Back to All Uploads
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {uploads.map((upload) => (
                    <Card 
                      key={upload.id} 
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleContentSelect(upload)}
                    >
                      <div className="aspect-video bg-gray-200 relative">
                        {upload.thumbnail_url ? (
                          <img 
                            src={upload.thumbnail_url} 
                            alt={upload.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {upload.duration ? `${Math.floor(upload.duration / 60)}:${(upload.duration % 60).toString().padStart(2, '0')}` : "00:00"}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-2">{upload.title}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
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
                            <span className="text-xs text-gray-600">{upload.user?.full_name}</span>
                          </div>
                          <span className="text-xs text-gray-500">{upload.views_count || 0} views</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {uploads.length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <Upload className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No uploads found</h3>
                      <p className="text-gray-600 mt-2">Be the first to share content with LifeFlow!</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="trending" className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                {trendingUploads.map((upload) => (
                  <Card 
                    key={upload.id} 
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleContentSelect(upload)}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-64 aspect-video bg-gray-200 relative flex-shrink-0">
                        {upload.thumbnail_url ? (
                          <img 
                            src={upload.thumbnail_url} 
                            alt={upload.title}
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
                        <h3 className="font-semibold text-lg">{upload.title}</h3>
                        {upload.description && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{upload.description}</p>
                        )}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                              {upload.user?.avatar_url ? (
                                <img 
                                  src={upload.user.avatar_url} 
                                  alt={upload.user.full_name}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <span className="text-xs">{upload.user?.full_name?.charAt(0) || 'U'}</span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{upload.user?.full_name}</p>
                              <p className="text-xs text-gray-500">{new Date(upload.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {upload.views_count || 0}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}

                {trendingUploads.length === 0 && (
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No trending uploads yet</h3>
                    <p className="text-gray-600 mt-2">Popular content will appear here</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ContentUpload onContentUploaded={fetchUploads} />
                </div>
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Content Guidelines</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• Keep content appropriate for all audiences</li>
                          <li>• Use clear titles that describe your content</li>
                          <li>• Ensure you own all rights to your content</li>
                          <li>• Follow LifeFlow community guidelines</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Technical Requirements</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• Maximum file size: 100MB</li>
                          <li>• Supported formats: MP4, MOV, AVI, JPG, PNG</li>
                          <li>• Recommended resolution: 1080p or higher</li>
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

export default Uploads;
