
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: {
    id: string;
    content: string;
    media_url?: string;
    media_type?: string;
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
  onShare?: () => void;
  onBookmark?: () => void;
}

const PostCard = ({ post, onLike, onComment, onShare, onBookmark }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.profiles.avatar_url} />
              <AvatarFallback>
                {post.profiles.full_name?.charAt(0) || post.profiles.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">
                {post.profiles.full_name || post.profiles.username || 'LifeFlow Member'}
              </p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm leading-relaxed">
          {post.content}
        </div>
        
        {post.media_type === 'image' && post.media_url && (
          <div className="rounded-lg overflow-hidden">
            <img 
              src={post.media_url} 
              alt="Post media" 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        {post.media_type === 'video' && post.media_url && (
          <div className="rounded-lg overflow-hidden">
            <video 
              src={post.media_url} 
              controls
              className="w-full h-auto object-cover"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                isLiked ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{post.likes_count}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onComment}
              className="flex items-center space-x-1 text-gray-500"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{post.comments_count}</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onShare}
              className="text-gray-500"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={`${isBookmarked ? 'text-blue-500' : 'text-gray-500'}`}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
