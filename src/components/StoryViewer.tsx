
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface Story {
  id: string;
  user_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  duration: number;
  created_at: string;
  expires_at: string;
  view_count: number;
  profiles: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex?: number;
  onClose: () => void;
}

const StoryViewer = ({ stories, initialIndex = 0, onClose }: StoryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentStory = stories[currentIndex];
  const duration = currentStory?.duration || 5000;

  useEffect(() => {
    if (isPaused || !currentStory) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, duration, isPaused, stories.length, onClose, currentStory]);

  const goToNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <Card className="w-full max-w-md h-full max-h-[600px] bg-black border-0 relative overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4">
          <div className="flex gap-1 mb-4">
            {stories.map((_, index) => (
              <Progress
                key={index}
                value={
                  index < currentIndex ? 100 : 
                  index === currentIndex ? progress : 0
                }
                className="h-1 flex-1"
              />
            ))}
          </div>
          
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8 ring-2 ring-white">
                <AvatarImage src={currentStory.profiles.avatar_url} />
                <AvatarFallback>
                  {currentStory.profiles.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {currentStory.profiles.full_name || currentStory.profiles.username}
                </p>
                <div className="flex items-center space-x-1 text-xs text-gray-300">
                  <Eye className="h-3 w-3" />
                  <span>{currentStory.view_count}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-0 h-full flex items-center justify-center">
          <div 
            className="w-full h-full relative cursor-pointer"
            onClick={() => setIsPaused(!isPaused)}
          >
            {currentStory.media_type === 'image' ? (
              <img
                src={currentStory.media_url}
                alt="Story"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={currentStory.media_url}
                autoPlay
                muted
                className="w-full h-full object-cover"
                onEnded={goToNext}
              />
            )}
            
            {/* Navigation Areas */}
            <div className="absolute inset-0 flex">
              <div 
                className="w-1/2 h-full cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
              />
              <div 
                className="w-1/2 h-full cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              />
            </div>
          </div>
        </CardContent>

        {/* Navigation Buttons */}
        {currentIndex > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        
        {currentIndex < stories.length - 1 && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
      </Card>
    </div>
  );
};

export default StoryViewer;
