
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AdSenseAd from '@/components/AdSenseAd';
import LiveStream from '@/components/LiveStream';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigate, useNavigate } from 'react-router-dom';
import { RadioIcon, Plus, Users, Tag } from 'lucide-react';

const LiveStreams = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeStreams, setActiveStreams] = useState<any[]>([]);
  const [selectedStream, setSelectedStream] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchActiveStreams();
    
    // Set up subscription for real-time updates
    const channel = supabase
      .channel('live_streams_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'live_streams' }, 
        () => {
          fetchActiveStreams();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchActiveStreams = async () => {
    const { data, error } = await supabase
      .from('live_streams')
      .select(`
        *,
        user:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('status', 'live')
      .order('viewer_count', { ascending: false });

    if (!error && data) {
      setActiveStreams(data);
    }
  };

  const handleStreamSelect = (stream: any) => {
    setSelectedStream(stream);
    
    // Update viewer count
    supabase
      .from('live_streams')
      .update({ viewer_count: (stream.viewer_count || 0) + 1 })
      .eq('id', stream.id);
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Live Streams</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect in real-time with creators and community members.
            </p>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="watch" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="watch">Watch Streams</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="create">Go Live</TabsTrigger>
            </TabsList>

            <TabsContent value="watch" className="space-y-8">
              {selectedStream ? (
                <div className="grid grid-cols-1 gap-8">
                  <LiveStream streamId={selectedStream.id} isViewer={true} />
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedStream(null)}
                    className="w-full md:w-auto"
                  >
                    Back to All Streams
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeStreams.map((stream) => (
                    <Card 
                      key={stream.id} 
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleStreamSelect(stream)}
                    >
                      <div className="aspect-video bg-black relative flex items-center justify-center">
                        {stream.thumbnail_url ? (
                          <img 
                            src={stream.thumbnail_url} 
                            alt={stream.title}
                            className="w-full h-full object-cover opacity-80"
                          />
                        ) : (
                          <RadioIcon className="h-12 w-12 text-red-500 animate-pulse" />
                        )}
                        <div className="absolute top-2 left-2">
                          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-md flex items-center">
                            <RadioIcon className="h-3 w-3 mr-1" />
                            LIVE
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded-md flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {stream.viewer_count || 0}
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-1">{stream.title}</h3>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                            {stream.user.avatar_url ? (
                              <img 
                                src={stream.user.avatar_url} 
                                alt={stream.user.full_name}
                                className="w-6 h-6 rounded-full"
                              />
                            ) : (
                              <span className="text-xs">{stream.user.full_name?.charAt(0) || 'U'}</span>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">{stream.user.full_name}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {activeStreams.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <RadioIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No active streams</h3>
                      <p className="text-gray-600 mt-2">Be the first to go live in our community!</p>
                      <Button className="mt-4" onClick={() => document.getElementById('create-tab')?.click()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Start Streaming
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="categories">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {['Gaming', 'Arts', 'Music', 'Chat', 'Education', 'Outdoors', 'Technology', 'Just Chatting'].map((category) => (
                  <Card 
                    key={category} 
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Tag className="h-12 w-12 text-white" />
                    </div>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold">{category}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {Math.floor(Math.random() * 10)} active streams
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="create" id="create-tab">
              {isCreating ? (
                <LiveStream />
              ) : (
                <div className="max-w-xl mx-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">Start Streaming</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center py-8">
                        <RadioIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Ready to go live?</h3>
                        <p className="text-gray-600 mt-2 mb-6">
                          Connect with your audience in real-time by starting a live stream.
                        </p>
                        <Button 
                          className="w-full md:w-auto" 
                          size="lg"
                          onClick={() => setIsCreating(true)}
                        >
                          <RadioIcon className="h-4 w-4 mr-2" />
                          Start Live Stream
                        </Button>
                      </div>
                      
                      <div className="border-t pt-6">
                        <h4 className="font-medium mb-4">Streaming Guidelines</h4>
                        <ul className="text-sm space-y-2 text-gray-600">
                          <li>• Ensure you have a stable internet connection</li>
                          <li>• Use a quiet environment for better audio quality</li>
                          <li>• Respect the community guidelines at all times</li>
                          <li>• For best quality, use a webcam with at least 720p resolution</li>
                          <li>• Consider using a microphone for clear audio</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* AdSense */}
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

export default LiveStreams;
