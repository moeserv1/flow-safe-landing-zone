
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface YouTubeShortPlayerProps {
  videoUrl: string;
  startTime: number;
  endTime: number;
  onTimeUpdate?: (start: number, end: number) => void;
  editable?: boolean;
}

const YouTubeShortPlayer = ({ 
  videoUrl, 
  startTime, 
  endTime, 
  onTimeUpdate,
  editable = false 
}: YouTubeShortPlayerProps) => {
  const [localStartTime, setLocalStartTime] = useState(startTime);
  const [localEndTime, setLocalEndTime] = useState(endTime);
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(videoUrl);
  
  if (!videoId) {
    return (
      <Card className="w-full">
        <CardContent className="p-4 text-center text-gray-500">
          Invalid YouTube URL
        </CardContent>
      </Card>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${localStartTime}&end=${localEndTime}&autoplay=0&rel=0&modestbranding=1`;

  const handleTimeUpdate = () => {
    if (onTimeUpdate) {
      onTimeUpdate(localStartTime, localEndTime);
    }
  };

  const handleReset = () => {
    setLocalStartTime(startTime);
    setLocalEndTime(endTime);
  };

  return (
    <Card className="w-full max-w-lg">
      <CardContent className="p-4 space-y-4">
        <div className="aspect-video rounded-lg overflow-hidden">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        
        {editable && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="start-time" className="text-xs">Start (seconds)</Label>
                <Input
                  id="start-time"
                  type="number"
                  min="0"
                  max="3600"
                  value={localStartTime}
                  onChange={(e) => setLocalStartTime(parseInt(e.target.value) || 0)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="end-time" className="text-xs">End (seconds)</Label>
                <Input
                  id="end-time"
                  type="number"
                  min="1"
                  max="3600"
                  value={localEndTime}
                  onChange={(e) => setLocalEndTime(parseInt(e.target.value) || 60)}
                  className="h-8"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" onClick={handleTimeUpdate} className="flex-1">
                Update Clip
              </Button>
              <Button size="sm" variant="outline" onClick={handleReset}>
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-500 text-center">
          Clip: {localStartTime}s - {localEndTime}s ({localEndTime - localStartTime}s duration)
        </div>
      </CardContent>
    </Card>
  );
};

export default YouTubeShortPlayer;
