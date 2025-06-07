
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRealtime } from '@/hooks/useRealtime';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Video, RadioIcon, Users, MessageCircle, Send } from 'lucide-react';

interface LiveStreamProps {
  streamId?: string;
  isViewer?: boolean;
}

const LiveStream = ({ streamId, isViewer = false }: LiveStreamProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isStreaming, setIsStreaming] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [viewerCount, setViewerCount] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [currentStreamId, setCurrentStreamId] = useState<string | null>(streamId || null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { data: streams } = useRealtime('live_streams');
  const { data: chatMessages } = useRealtime('live_chat_messages', 
    currentStreamId ? { column: 'stream_id', value: currentStreamId } : undefined
  );

  useEffect(() => {
    if (streamId) {
      joinStream();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [streamId]);

  const startStream = async () => {
    if (!user || !title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a stream title",
        variant: "destructive"
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const { data: streamData, error } = await supabase
        .from('live_streams')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim(),
          status: 'live',
          viewer_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentStreamId(streamData.id);
      setIsStreaming(true);
      
      toast({
        title: "Live!",
        description: "Your stream is now live"
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to start stream: " + error.message,
        variant: "destructive"
      });
    }
  };

  const stopStream = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (currentStreamId) {
      await supabase
        .from('live_streams')
        .update({ status: 'offline' })
        .eq('id', currentStreamId);
    }

    setIsStreaming(false);
    setCurrentStreamId(null);
    
    toast({
      title: "Stream Ended",
      description: "Your live stream has ended"
    });
  };

  const joinStream = async () => {
    if (currentStreamId) {
      await supabase
        .from('live_streams')
        .update({ viewer_count: viewerCount + 1 })
        .eq('id', currentStreamId);
      
      setViewerCount(prev => prev + 1);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !currentStreamId) return;

    try {
      const { error } = await supabase
        .from('live_chat_messages')
        .insert({
          stream_id: currentStreamId,
          user_id: user.id,
          message: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!user && !isViewer) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Please sign in to start streaming</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Streams List */}
      {!isStreaming && !isViewer && (
        <Card>
          <CardHeader>
            <CardTitle>Live Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {streams.filter((stream: any) => stream.status === 'live').map((stream: any) => (
                <Card key={stream.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setCurrentStreamId(stream.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-red-500 text-white">
                        <RadioIcon className="h-3 w-3 mr-1" />
                        LIVE
                      </Badge>
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{stream.viewer_count || 0}</span>
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-sm">{stream.title}</h3>
                    {stream.description && (
                      <p className="text-xs text-gray-500 mt-1">{stream.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted={!isViewer}
                  className="w-full aspect-video"
                />
                
                {isStreaming && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white">
                      <RadioIcon className="h-3 w-3 mr-1" />
                      LIVE
                    </Badge>
                  </div>
                )}
                
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{viewerCount}</span>
                  </Badge>
                </div>
              </div>
              
              {!isViewer && (
                <div className="p-4 border-t">
                  {!isStreaming ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="stream-title">Stream Title</Label>
                        <Input
                          id="stream-title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter your stream title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stream-description">Description</Label>
                        <Input
                          id="stream-description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Enter stream description"
                        />
                      </div>
                      <Button onClick={startStream} className="w-full">
                        <Video className="h-4 w-4 mr-2" />
                        Go Live
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-semibold">{title}</h3>
                      <Button onClick={stopStream} variant="destructive" className="w-full">
                        End Stream
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-96">
              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {chatMessages.map((msg: any) => (
                  <div key={msg.id} className="text-sm">
                    <span className="font-medium text-blue-600">
                      {msg.profiles?.full_name || 'Anonymous'}: 
                    </span>
                    <span className="ml-1">{msg.message}</span>
                  </div>
                ))}
              </div>
              
              {user && currentStreamId && (
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
