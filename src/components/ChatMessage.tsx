
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Database } from '@/integrations/supabase/types';

type MessageWithProfile = Database['public']['Views']['community_messages_with_profiles']['Row'];

interface ChatMessageProps {
  message: MessageWithProfile;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  // A user can delete their own message, or an admin/moderator can delete any message.
  const canDelete = user?.id === message.sender_id || profile?.role === 'admin' || profile?.role === 'moderator';

  const handleDelete = async () => {
    if (!canDelete) return;

    setIsDeleting(true);
    const { error } = await supabase
      .from('community_messages')
      .delete()
      .eq('id', message.id);

    setIsDeleting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete message. " + error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Message deleted.",
      });
      // The message will be removed from the UI via the realtime subscription in CommunityChat.tsx
    }
  };

  return (
    <div className="flex gap-2 group items-start">
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.avatar_url || undefined} />
        <AvatarFallback>
          {message.full_name?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {message.full_name || 'Unknown User'}
          </span>
          <span className="text-xs text-gray-500">
            {message.created_at ? new Date(message.created_at).toLocaleTimeString() : ''}
          </span>
        </div>
        <p className="text-sm text-gray-700">{message.message}</p>
      </div>
      {canDelete && (
         <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default ChatMessage;
