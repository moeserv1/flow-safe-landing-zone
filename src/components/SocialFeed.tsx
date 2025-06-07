
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRealtime } from '@/hooks/useRealtime';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share, Send, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import CreateSocialPost from './CreateSocialPost';
import PostCard from './PostCard';

const SocialFeed = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
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
      {user && <CreateSocialPost />}

      {/* Posts Feed */}
      <div className="space-y-6">
        {postsWithProfiles.map((post: any) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={() => likePost(post.id)}
          />
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

export default SocialFeed;
