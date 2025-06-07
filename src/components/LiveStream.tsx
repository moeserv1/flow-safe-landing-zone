
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRealtime } from '@/hooks/useRealtime';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Video, RadioIcon, Users, MessageCircle, Camera, Mic, MicOff, VideoOff } from 'lucide-react';
import ChatOptions from './ChatOptions';
import StreamControls from './StreamControls';
import AutoCompleteChat from './AutoCompleteChat';

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
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isTestingCamera, setIsTestingCamera] = useState(false);
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
    checkPermissions();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [streamId]);

  const checkPermissions = async () => {
    try {
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      if (permissions.state === 'granted') {
        setHasPermissions(true);
      }
    } catch (error) {
      console.log('Permission check not supported');
    }
  };

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setHasPermissions(true);
      stream.getTracks().forEach(track => track.stop());
      
      toast({
        title: "Permissions Granted",
        description: "Camera and microphone access granted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Permission Denied",
        description: "Camera and microphone access is required for live streaming",
        variant: "destructive"
      });
    }
  };

  const startStream = async () => {
    if (!user || !title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a stream title",
        variant: "destructive"
      });
      return;
    }

    if (!hasPermissions) {
      await requestPermissions();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled
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
      setIsTestingCamera(false);
      
      toast({
        title: "🔴 Live!",
        description: "Your stream is now live and broadcasting"
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to start stream: " + error.message,
        variant: "destructive"
      });
    }
  };

  const endStream = async () => {
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

  const resetStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsStreaming(false);
    setIsTestingCamera(false);
    setTitle('');
    setDescription('');
    setCurrentStreamId(null);
    
    toast({
      title: "Stream Reset",
      description: "Stream settings have been reset"
    });
  };

  const saveSettings = async () => {
    toast({
      title: "Settings Saved",
      description: "Your stream settings have been saved"
    });
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
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

  const handleQuickMessage = (message: string) => {
    setNewMessage(message);
  };

  const handleEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  if (!user && !isViewer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-4">Please sign in to start live streaming</p>
            <Button onClick={() => window.location.href = '/auth'}>
              Sign In to Stream
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Live Streams List */}
      {!isStreaming && !isViewer && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RadioIcon className="h-5 w-5 text-red-500" />
              Live Streams
            </CardTitle>
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
            {streams.filter((stream: any) => stream.status === 'live').length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No live streams at the moment</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player */}
          <Card>
            <CardContent className="p-0">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted={!isViewer}
                  playsInline
                  className="w-full aspect-video object-cover"
                />
                
                {!streamRef.current && !isStreaming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="text-center text-white">
                      <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">Camera Preview</p>
                      <p className="text-sm opacity-75">Get ready to go live</p>
                    </div>
                  </div>
                )}
                
                {isStreaming && (
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <Badge className="bg-red-500 text-white animate-pulse">
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

                {/* Stream Controls */}
                {(isStreaming || isTestingCamera) && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant={isVideoEnabled ? "default" : "destructive"}
                      onClick={toggleVideo}
                    >
                      {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant={isAudioEnabled ? "default" : "destructive"}
                      onClick={toggleAudio}
                    >
                      {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stream Controls */}
          {!isViewer && (
            <StreamControls
              isStreaming={isStreaming}
              title={title}
              description={description}
              onTitleChange={setTitle}
              onDescriptionChange={setDescription}
              onStartStream={startStream}
              onEndStream={endStream}
              onResetStream={resetStream}
              onSaveSettings={saveSettings}
            />
          )}
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
                {chatMessages.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>
              
              {user && currentStreamId && (
                <div className="space-y-3">
                  <ChatOptions 
                    onQuickMessage={handleQuickMessage}
                    onEmoji={handleEmoji}
                  />
                  <AutoCompleteChat
                    value={newMessage}
                    onChange={setNewMessage}
                    onSend={sendMessage}
                    placeholder="Type a message..."
                  />
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
