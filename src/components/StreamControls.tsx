
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  RotateCcw, 
  Settings, 
  Save, 
  Trash2,
  RadioIcon,
  StopCircle 
} from 'lucide-react';

interface StreamControlsProps {
  isStreaming: boolean;
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onStartStream: () => void;
  onEndStream: () => void;
  onResetStream: () => void;
  onSaveSettings: () => void;
}

const StreamControls = ({
  isStreaming,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onStartStream,
  onEndStream,
  onResetStream,
  onSaveSettings
}: StreamControlsProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Upload Complete",
        description: "Your content has been uploaded successfully"
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload content",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Stream Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="stream-title">Stream Title</Label>
          <Input
            id="stream-title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter your stream title"
            disabled={isStreaming}
          />
        </div>
        
        <div>
          <Label htmlFor="stream-description">Description</Label>
          <Input
            id="stream-description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Enter stream description"
            disabled={isStreaming}
          />
        </div>

        <div>
          <Label htmlFor="upload-content">Upload Content</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="upload-content"
              type="file"
              accept="video/*,image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-gray-100"
            />
            <Badge variant={isUploading ? "secondary" : "outline"}>
              {isUploading ? "Uploading..." : "Ready"}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          {!isStreaming ? (
            <>
              <Button onClick={onStartStream} className="flex-1" disabled={!title.trim()}>
                <RadioIcon className="h-4 w-4 mr-2" />
                Go Live
              </Button>
              <Button onClick={onSaveSettings} variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </>
          ) : (
            <Button onClick={onEndStream} variant="destructive" className="flex-1">
              <StopCircle className="h-4 w-4 mr-2" />
              End Stream
            </Button>
          )}
          
          <Button onClick={onResetStream} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreamControls;
