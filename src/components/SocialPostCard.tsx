
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Youtube, MoreHorizontal, Play } from 'lucide-react';
import YouTubeShortPlayer from './YouTubeShortPlayer';
import { formatDistanceToNow } from 'date-fns';

interface SocialPostCardProps {
  post: {
    id: string;
    content: string;
    media_url?: string;
    media_type?: string;
    youtube_url?: string;
    youtube_start_time?: number;
    youtube_end_time?: number;
    tags?: string[];
    likes_count: number;
    comments_count: number;
    created_at: string;
    profiles: {
      full_name?: string;
      username?: string;
      avatar_url?: string;
    };
  };
  onLike?: () => void;
  onComment?: () => void;
}

const SocialPostCard = ({ post, onLike, onComment }: SocialPostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 ring-2 ring-gradient-to-r from-blue-400 to-purple-500">
              <AvatarImage src={post.profiles.avatar_url} />
              <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold">
                {post.profiles.full_name?.charAt(0) || post.profiles.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">
                {post.profiles.full_name || post.profiles.username || 'LifeFlow Member'}
              </p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-gray-800 leading-relaxed">
          {post.content}
        </div>
        
        {post.media_type === 'video' && post.media_url && (
          <div className="rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 p-2">
            <video 
              src={post.media_url} 
              controls
              className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
            <div className="flex items-center justify-center mt-2 text-xs text-purple-600 font-medium">
              <Play className="h-4 w-4 mr-1" />
              <span>Shared Video</span>
            </div>
          </div>
        )}
        
        {post.media_type === 'youtube_short' && post.youtube_url && (
          <div className="flex flex-col items-center space-y-3 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4">
            <YouTubeShortPlayer
              videoUrl={post.youtube_url}
              startTime={post.youtube_start_time || 0}
              endTime={post.youtube_end_time || 60}
            />
            <div className="flex items-center space-x-2 text-xs text-red-600 font-medium">
              <Youtube className="h-4 w-4" />
              <span>Shared Video Clip</span>
            </div>
          </div>
        )}
        
        {post.media_type === 'image' && post.media_url && (
          <div className="rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 p-2">
            <img 
              src={post.media_url} 
              alt="Shared content" 
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 border-0 hover:from-blue-200 hover:to-purple-200 cursor-pointer"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-all duration-200 ${
                isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{post.likes_count}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onComment}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{post.comments_count}</span>
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-500 hover:text-purple-500 transition-colors duration-200"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialPostCard;
