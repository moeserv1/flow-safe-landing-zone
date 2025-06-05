
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Youtube, Image as ImageIcon, X, Video } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import YouTubeShortPlayer from './YouTubeShortPlayer';
import SocialVideoUpload from './SocialVideoUpload';

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
  const [postType, setPostType] = useState<'text' | 'youtube' | 'image' | 'video'>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);

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
        media_type: postType === 'text' ? null : postType === 'youtube' ? 'youtube_short' : postType,
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
        description: "Your post has been shared with the community."
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

  const handleVideoUploadComplete = (postData: any) => {
    setShowVideoUpload(false);
    onPostCreated?.();
    toast({
      title: "Success!",
      description: "Your video has been shared with the community."
    });
  };

  if (!user) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Please sign in to create posts</p>
        </CardContent>
      </Card>
    );
  }

  if (showVideoUpload) {
    return (
      <SocialVideoUpload
        onUploadComplete={handleVideoUploadComplete}
        onCancel={() => setShowVideoUpload(false)}
      />
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Share with LifeFlow Community
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="What's happening in your life? Share your thoughts, experiences, or moments..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="border-2 border-blue-200 focus:border-purple-400 rounded-xl"
        />

        <Tabs value={postType} onValueChange={(value) => setPostType(value as any)}>
          <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
            <TabsTrigger value="text" className="rounded-full">Text</TabsTrigger>
            <TabsTrigger value="video" className="rounded-full">
              <Video className="h-4 w-4 mr-1" />
              Video
            </TabsTrigger>
            <TabsTrigger value="youtube" className="rounded-full">
              <Youtube className="h-4 w-4 mr-1" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="image" className="rounded-full">
              <ImageIcon className="h-4 w-4 mr-1" />
              Image
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video" className="space-y-3">
            <div className="text-center py-6 border-2 border-dashed border-blue-300 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50">
              <Video className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">Share Your Video</p>
              <p className="text-sm text-gray-500 mb-4">Upload videos up to 500MB to share with the community</p>
              <Button 
                onClick={() => setShowVideoUpload(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full px-6"
              >
                <Video className="h-4 w-4 mr-2" />
                Upload Video
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="youtube" className="space-y-3">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4">
              <div>
                <Label htmlFor="youtube-url" className="text-red-700 font-medium">YouTube URL</Label>
                <Input
                  id="youtube-url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="mt-2 border-red-200 focus:border-red-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <Label htmlFor="start-time" className="text-red-700 font-medium">Start Time (seconds)</Label>
                  <Input
                    id="start-time"
                    type="number"
                    min="0"
                    value={startTime}
                    onChange={(e) => setStartTime(parseInt(e.target.value) || 0)}
                    className="mt-1 border-red-200 focus:border-red-400"
                  />
                </div>
                <div>
                  <Label htmlFor="end-time" className="text-red-700 font-medium">End Time (seconds)</Label>
                  <Input
                    id="end-time"
                    type="number"
                    min="1"
                    value={endTime}
                    onChange={(e) => setEndTime(parseInt(e.target.value) || 60)}
                    className="mt-1 border-red-200 focus:border-red-400"
                  />
                </div>
              </div>
              {youtubeUrl && (
                <div className="mt-4">
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
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-3">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4">
              <div>
                <Label htmlFor="image-url" className="text-green-700 font-medium">Image URL</Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="mt-2 border-green-200 focus:border-green-400"
                />
              </div>
              {imageUrl && (
                <div className="mt-4 rounded-lg overflow-hidden max-w-sm">
                  <img src={imageUrl} alt="Preview" className="w-full h-auto rounded-lg shadow-md" />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-3">
          <Label className="text-purple-700 font-medium">Tags</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag to increase visibility"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="border-purple-200 focus:border-purple-400"
            />
            <Button onClick={addTag} variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center gap-1">
                  #{tag}
                  <X
                    className="h-3 w-3 cursor-pointer hover:bg-white/20 rounded"
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
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isLoading ? 'Sharing...' : 'Share with LifeFlow Community'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateSocialPost;
