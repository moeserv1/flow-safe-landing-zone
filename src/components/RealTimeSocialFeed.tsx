
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRealtime } from '@/hooks/useRealtime';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SocialPost {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  media_url?: string;
  media_type?: string;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
}

const RealTimeSocialFeed = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  
  const { data: posts, loading } = useRealtime('social_posts');
  const { data: profiles } = useRealtime('profiles');

  // Join posts with profile data
  const postsWithProfiles = posts.map((post: any) => {
    const profile = profiles.find((p: any) => p.id === post.author_id);
    return {
      ...post,
      profiles: profile || { full_name: 'Anonymous User', avatar_url: null }
    };
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const createPost = async () => {
    if (!user || !newPost.trim()) return;

    try {
      setPosting(true);
      const { error } = await supabase
        .from('social_posts')
        .insert({
          content: newPost,
          author_id: user.id,
          media_type: 'text'
        });

      if (error) throw error;

      setNewPost('');
      toast({
        title: "Success",
        description: "Post created successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setPosting(false);
    }
  };

  const likePost = async (postId: string) => {
    if (!user) return;

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('id', existingLike.id);
        
        // Decrease likes count
        const post = posts.find((p: any) => p.id === postId);
        if (post) {
          await supabase
            .from('social_posts')
            .update({ likes_count: Math.max(0, (post.likes_count || 0) - 1) })
            .eq('id', postId);
        }
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: user.id });
        
        // Increase likes count
        const post = posts.find((p: any) => p.id === postId);
        if (post) {
          await supabase
            .from('social_posts')
            .update({ likes_count: (post.likes_count || 0) + 1 })
            .eq('id', postId);
        }
      }
    } catch (error: any) {
      // Ignore duplicate key errors for likes
      if (!error.message.includes('duplicate')) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      {user && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end">
                <Button
                  onClick={createPost}
                  disabled={posting || !newPost.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {postsWithProfiles.map((post: any) => (
          <Card key={post.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={post.profiles?.avatar_url} />
                  <AvatarFallback>
                    {post.profiles?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.profiles?.full_name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{post.content}</p>
              {post.media_url && (
                <div className="mb-4">
                  {post.media_type === 'image' ? (
                    <img src={post.media_url} alt="Post media" className="rounded-lg max-w-full h-auto" />
                  ) : post.media_type === 'video' ? (
                    <video controls className="rounded-lg max-w-full h-auto">
                      <source src={post.media_url} type="video/mp4" />
                    </video>
                  ) : null}
                </div>
              )}
              <div className="flex items-center space-x-6 text-gray-500">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => likePost(post.id)}
                  className="flex items-center space-x-2"
                >
                  <Heart className="h-4 w-4" />
                  <span>{post.likes_count || 0}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments_count || 0}</span>
                </Button>
                <Button variant="ghost" size="sm">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {postsWithProfiles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts yet. Be the first to share something!</p>
        </div>
      )}
    </div>
  );
};

export default RealTimeSocialFeed;
