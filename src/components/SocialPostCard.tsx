
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Youtube } from 'lucide-react';
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
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.profiles.avatar_url} />
            <AvatarFallback>
              {post.profiles.full_name?.charAt(0) || post.profiles.username?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-sm">
              {post.profiles.full_name || post.profiles.username || 'Anonymous'}
            </p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-900">{post.content}</p>
        
        {post.media_type === 'youtube_short' && post.youtube_url && (
          <div className="flex flex-col items-center space-y-2">
            <YouTubeShortPlayer
              videoUrl={post.youtube_url}
              startTime={post.youtube_start_time || 0}
              endTime={post.youtube_end_time || 60}
            />
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Youtube className="h-3 w-3" />
              <span>YouTube Short Clip</span>
            </div>
          </div>
        )}
        
        {post.media_type === 'image' && post.media_url && (
          <div className="rounded-lg overflow-hidden">
            <img 
              src={post.media_url} 
              alt="Post media" 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-1 ${isLiked ? 'text-red-600' : ''}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{post.likes_count}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onComment}
              className="flex items-center space-x-1"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{post.comments_count}</span>
            </Button>
          </div>
          
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialPostCard;
