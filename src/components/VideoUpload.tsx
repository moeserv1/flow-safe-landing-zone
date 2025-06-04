
import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface UploadProps {
  onContentUploaded?: (contentData: any) => void;
}

const ContentUpload = ({ onContentUploaded }: UploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('video/') && !file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid video or image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File must be less than 100MB",
        variant: "destructive"
      });
      return;
    }

    await uploadContent(file);
  };

  const uploadContent = async (file: File) => {
    setUploading(true);
    setProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const bucketName = file.type.startsWith('video/') ? 'videos' : 'images';

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      const contentData = {
        user_id: user.id,
        title: title || file.name,
        description,
        file_name: fileName,
        file_size: file.size,
        status: 'published'
      };

      if (file.type.startsWith('video/')) {
        const { data: videoData, error: dbError } = await supabase
          .from('videos')
          .insert({
            ...contentData,
            video_url: publicUrl,
            duration: 0
          })
          .select()
          .single();

        if (dbError) throw dbError;
        onContentUploaded?.(videoData);
      } else {
        const { data: postData, error: dbError } = await supabase
          .from('social_posts')
          .insert({
            author_id: user.id,
            content: title || 'New upload',
            media_url: publicUrl,
            media_type: 'image'
          })
          .select()
          .single();

        if (dbError) throw dbError;
        onContentUploaded?.(postData);
      }

      toast({
        title: "Success!",
        description: "Content uploaded successfully to LifeFlow"
      });
      
      setTitle('');
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Please sign in to upload content</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload to LifeFlow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter content title"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your content"
          />
        </div>

        <div>
          <Label htmlFor="content-file">Media File</Label>
          <Input
            ref={fileInputRef}
            id="content-file"
            type="file"
            accept="video/*,image/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </div>

        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading to LifeFlow...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Select Content to Upload'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ContentUpload;
