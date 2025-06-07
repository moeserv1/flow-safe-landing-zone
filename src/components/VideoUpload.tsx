
import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Video, Image } from 'lucide-react';

interface UploadProps {
  onContentUploaded?: (contentData: any) => void;
}

const VideoUpload = ({ onContentUploaded }: UploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadContent = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    setProgress(0);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const bucketName = selectedFile.type.startsWith('video/') ? 'videos' : 'images';

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, selectedFile);

      clearInterval(progressInterval);
      setProgress(100);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      const contentData = {
        title: title || selectedFile.name,
        description,
        file_name: fileName,
        file_size: selectedFile.size,
        status: 'published'
      };

      if (selectedFile.type.startsWith('video/')) {
        const { data: videoData, error: dbError } = await supabase
          .from('videos')
          .insert({
            ...contentData,
            user_id: user.id,
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
        description: "Content uploaded successfully"
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setPreview(null);
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
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your content"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="content-file">Media File</Label>
            <div className="mt-2">
              <Input
                ref={fileInputRef}
                id="content-file"
                type="file"
                accept="video/*,image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
              />
              
              {!selectedFile ? (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Click to select a video or image file</p>
                  <p className="text-sm text-gray-500 mt-2">Max file size: 100MB</p>
                </div>
              ) : (
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {selectedFile.type.startsWith('video/') ? (
                        <Video className="h-8 w-8 text-blue-500" />
                      ) : (
                        <Image className="h-8 w-8 text-green-500" />
                      )}
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {preview && (
                    <div className="mt-4">
                      {selectedFile.type.startsWith('video/') ? (
                        <video src={preview} controls className="w-full max-h-48 rounded" />
                      ) : (
                        <img src={preview} alt="Preview" className="w-full max-h-48 object-cover rounded" />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          <Button
            onClick={uploadContent}
            disabled={uploading || !selectedFile || !title.trim()}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Content'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoUpload;
