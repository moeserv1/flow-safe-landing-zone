
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
import { Video, RadioIcon, Users, MessageCircle, Send, Camera, Mic, MicOff, VideoOff, Settings } from 'lucide-react';

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
  const [devices, setDevices] = useState<{ video: MediaDeviceInfo[], audio: MediaDeviceInfo[] }>({ video: [], audio: [] });
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
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

    // Check for media permissions on component mount
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
        await getAvailableDevices();
      }
    } catch (error) {
      console.log('Permission check not supported');
    }
  };

  const getAvailableDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceList.filter(device => device.kind === 'videoinput');
      const audioDevices = deviceList.filter(device => device.kind === 'audioinput');
      
      setDevices({ video: videoDevices, audio: audioDevices });
      
      if (videoDevices.length > 0 && !selectedVideoDevice) {
        setSelectedVideoDevice(videoDevices[0].deviceId);
      }
      if (audioDevices.length > 0 && !selectedAudioDevice) {
        setSelectedAudioDevice(audioDevices[0].deviceId);
      }
    } catch (error) {
      console.error('Error getting devices:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      const constraints = {
        video: true,
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setHasPermissions(true);
      
      // Stop the test stream
      stream.getTracks().forEach(track => track.stop());
      
      await getAvailableDevices();
      
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
      console.error('Permission error:', error);
    }
  };

  const testCamera = async () => {
    if (!hasPermissions) {
      await requestPermissions();
      return;
    }

    try {
      setIsTestingCamera(true);
      
      const constraints = {
        video: selectedVideoDevice ? { deviceId: selectedVideoDevice } : true,
        audio: selectedAudioDevice ? { deviceId: selectedAudioDevice } : true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      toast({
        title: "Camera Test",
        description: "Camera is working! You can now start streaming."
      });
    } catch (error: any) {
      toast({
        title: "Camera Error",
        description: "Failed to access camera: " + error.message,
        variant: "destructive"
      });
    }
  };

  const stopCameraTest = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsTestingCamera(false);
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
      const constraints = {
        video: isVideoEnabled ? (selectedVideoDevice ? { deviceId: selectedVideoDevice } : true) : false,
        audio: isAudioEnabled ? (selectedAudioDevice ? { deviceId: selectedAudioDevice } : true) : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
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
        <div className="lg:col-span-2">
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
                      <p className="text-sm opacity-75">Test your camera before going live</p>
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
              
              {!isViewer && (
                <div className="p-4 border-t space-y-4">
                  {!hasPermissions && (
                    <div className="text-center py-4 bg-yellow-50 rounded-lg">
                      <Camera className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                      <p className="text-sm text-yellow-800 mb-3">Camera and microphone access required</p>
                      <Button onClick={requestPermissions} variant="outline">
                        Grant Permissions
                      </Button>
                    </div>
                  )}

                  {hasPermissions && devices.video.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="video-device">Camera</Label>
                        <select
                          id="video-device"
                          value={selectedVideoDevice}
                          onChange={(e) => setSelectedVideoDevice(e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          {devices.video.map((device) => (
                            <option key={device.deviceId} value={device.deviceId}>
                              {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="audio-device">Microphone</Label>
                        <select
                          id="audio-device"
                          value={selectedAudioDevice}
                          onChange={(e) => setSelectedAudioDevice(e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          {devices.audio.map((device) => (
                            <option key={device.deviceId} value={device.deviceId}>
                              {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {!isStreaming && !isTestingCamera && hasPermissions && (
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
                      <div className="flex gap-2">
                        <Button onClick={testCamera} variant="outline" className="flex-1">
                          <Camera className="h-4 w-4 mr-2" />
                          Test Camera
                        </Button>
                        <Button onClick={startStream} className="flex-1" disabled={!title.trim()}>
                          <RadioIcon className="h-4 w-4 mr-2" />
                          Go Live
                        </Button>
                      </div>
                    </div>
                  )}

                  {isTestingCamera && !isStreaming && (
                    <div className="space-y-4">
                      <p className="text-center text-sm text-gray-600">Camera test active</p>
                      <div className="flex gap-2">
                        <Button onClick={stopCameraTest} variant="outline" className="flex-1">
                          Stop Test
                        </Button>
                        <Button onClick={startStream} className="flex-1" disabled={!title.trim()}>
                          <RadioIcon className="h-4 w-4 mr-2" />
                          Go Live
                        </Button>
                      </div>
                    </div>
                  )}

                  {isStreaming && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="font-semibold text-lg">{title}</h3>
                        <p className="text-sm text-gray-600">{description}</p>
                      </div>
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
                {chatMessages.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
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
