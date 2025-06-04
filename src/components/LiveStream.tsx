
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Video, RadioIcon, Users, MessageCircle } from 'lucide-react';

interface LiveStreamProps {
  streamId?: string;
  isViewer?: boolean;
}

const LiveStream = ({ streamId, isViewer = false }: LiveStreamProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isStreaming, setIsStreaming] = useState(false);
  const [title, setTitle] = useState('');
  const [viewerCount, setViewerCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
        .from('live_streams' as any)
        .insert({
          user_id: user.id,
          title: title.trim(),
          status: 'live',
          viewer_count: 0
        })
        .select()
        .single();

      if (error) throw error;

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

    setIsStreaming(false);
    
    toast({
      title: "Stream Ended",
      description: "Your live stream has ended"
    });
  };

  const joinStream = async () => {
    setViewerCount(prev => prev + 1);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const message = {
      id: Date.now().toString(),
      user_id: user.id,
      user_name: user.user_metadata?.full_name || 'Anonymous',
      message: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
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
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-sm">
                  <span className="font-medium text-blue-600">{msg.user_name}: </span>
                  <span>{msg.message}</span>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage} size="sm">
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveStream;
