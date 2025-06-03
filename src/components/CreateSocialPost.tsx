
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Youtube, Image as ImageIcon, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import YouTubeShortPlayer from './YouTubeShortPlayer';

interface CreateSocialPostProps {
  onPostCreated?: () => void;
}

const CreateSocialPost = ({ onPostCreated }: CreateSocialPostProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(60);
  const [imageUrl, setImageUrl] = useState('');
  const [postType, setPostType] = useState<'text' | 'youtube' | 'image'>('text');
  const [isLoading, setIsLoading] = useState(false);

  const addTag = () => {
    if (currentTag && !tags.includes(currentTag) && tags.length < 10) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCreatePost = async () => {
    if (!user || !content.trim()) return;

    setIsLoading(true);
    try {
      const postData = {
        author_id: user.id,
        content: content.trim(),
        tags: tags.length > 0 ? tags : null,
        media_type: postType === 'text' ? null : postType === 'youtube' ? 'youtube_short' : 'image',
        media_url: postType === 'image' ? imageUrl : null,
        youtube_url: postType === 'youtube' ? youtubeUrl : null,
        youtube_start_time: postType === 'youtube' ? startTime : null,
        youtube_end_time: postType === 'youtube' ? endTime : null,
      };

      const { error } = await supabase
        .from('social_posts')
        .insert([postData]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your post has been created."
      });

      // Reset form
      setContent('');
      setTags([]);
      setYoutubeUrl('');
      setImageUrl('');
      setStartTime(0);
      setEndTime(60);
      setPostType('text');
      
      onPostCreated?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Please sign in to create posts</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share with the Community</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />

        <Tabs value={postType} onValueChange={(value) => setPostType(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="youtube">
              <Youtube className="h-4 w-4 mr-1" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="image">
              <ImageIcon className="h-4 w-4 mr-1" />
              Image
            </TabsTrigger>
          </TabsList>

          <TabsContent value="youtube" className="space-y-3">
            <div>
              <Label htmlFor="youtube-url">YouTube URL</Label>
              <Input
                id="youtube-url"
                placeholder="https://youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="start-time">Start Time (seconds)</Label>
                <Input
                  id="start-time"
                  type="number"
                  min="0"
                  value={startTime}
                  onChange={(e) => setStartTime(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="end-time">End Time (seconds)</Label>
                <Input
                  id="end-time"
                  type="number"
                  min="1"
                  value={endTime}
                  onChange={(e) => setEndTime(parseInt(e.target.value) || 60)}
                />
              </div>
            </div>
            {youtubeUrl && (
              <YouTubeShortPlayer
                videoUrl={youtubeUrl}
                startTime={startTime}
                endTime={endTime}
                onTimeUpdate={(start, end) => {
                  setStartTime(start);
                  setEndTime(end);
                }}
                editable
              />
            )}
          </TabsContent>

          <TabsContent value="image" className="space-y-3">
            <div>
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            {imageUrl && (
              <div className="rounded-lg overflow-hidden max-w-sm">
                <img src={imageUrl} alt="Preview" className="w-full h-auto" />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
            />
            <Button onClick={addTag} variant="outline">Add</Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  #{tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={handleCreatePost}
          disabled={!content.trim() || isLoading}
          className="w-full"
        >
          {isLoading ? 'Creating...' : 'Share Post'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateSocialPost;
