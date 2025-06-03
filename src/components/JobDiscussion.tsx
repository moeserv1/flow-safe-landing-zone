
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface JobDiscussionProps {
  jobId: string;
  jobTitle: string;
}

interface Discussion {
  id: string;
  message: string;
  created_at: string;
  profiles: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

const JobDiscussion = ({ jobId, jobTitle }: JobDiscussionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDiscussions();
    }
  }, [isOpen, jobId]);

  const fetchDiscussions = async () => {
    try {
      const { data, error } = await supabase
        .from('job_discussions')
        .select(`
          id,
          message,
          created_at,
          profiles (
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setDiscussions(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load discussions",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('job_discussions')
        .insert([{
          job_id: jobId,
          participant_id: user.id,
          message: newMessage.trim()
        }]);

      if (error) throw error;

      setNewMessage('');
      fetchDiscussions();
      
      toast({
        title: "Message sent!",
        description: "Your message has been added to the discussion."
      });
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

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2"
      >
        <MessageCircle className="h-4 w-4" />
        <span>Discuss</span>
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Discussion: {jobTitle}</span>
          </span>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-96 overflow-y-auto space-y-3">
          {discussions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No discussions yet. Be the first to start the conversation!
            </p>
          ) : (
            discussions.map((discussion) => (
              <div key={discussion.id} className="flex space-x-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={discussion.profiles.avatar_url} />
                  <AvatarFallback>
                    {discussion.profiles.full_name?.charAt(0) || 
                     discussion.profiles.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">
                      {discussion.profiles.full_name || discussion.profiles.username || 'Anonymous'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{discussion.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {user ? (
          <div className="flex space-x-2">
            <Textarea
              placeholder="Join the discussion..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={2}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-2">
            Please sign in to join the discussion
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default JobDiscussion;
