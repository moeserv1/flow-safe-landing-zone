
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, ThumbsUp, ThumbsDown, Pin, Search, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRealtime } from '@/hooks/useRealtime';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Discussion {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  upvotes: number;
  downvotes: number;
  replies_count: number;
  created_at: string;
  profiles?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

const DiscussionBoard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    category: 'general'
  });

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'general', label: 'General Discussion' },
    { id: 'help', label: 'Help & Support' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'showcase', label: 'Showcase' }
  ];

  const { data: discussions, loading } = useRealtime<Discussion>('discussions');

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesCategory = selectedCategory === 'all' || discussion.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const createThread = async () => {
    if (!user || !newThread.title.trim() || !newThread.content.trim()) return;

    try {
      const { error } = await supabase
        .from('discussions')
        .insert({
          title: newThread.title,
          content: newThread.content,
          category: newThread.category,
          author_id: user.id,
          upvotes: 0,
          downvotes: 0,
          replies_count: 0
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Discussion thread created successfully"
      });

      setNewThread({ title: '', content: '', category: 'general' });
      setShowCreateForm(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const voteThread = async (threadId: string, voteType: 'up' | 'down') => {
    if (!user) return;

    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('discussion_votes')
        .select('*')
        .eq('discussion_id', threadId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        // Update existing vote
        await supabase
          .from('discussion_votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id);
      } else {
        // Create new vote
        await supabase
          .from('discussion_votes')
          .insert({
            discussion_id: threadId,
            user_id: user.id,
            vote_type: voteType
          });
      }

      toast({
        title: "Vote recorded",
        description: `Your ${voteType}vote has been recorded`
      });
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Discussion Board</h1>
        {user && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Thread
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Create Thread Form */}
      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Thread</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Thread title"
              value={newThread.title}
              onChange={(e) => setNewThread({...newThread, title: e.target.value})}
            />
            <select
              value={newThread.category}
              onChange={(e) => setNewThread({...newThread, category: e.target.value})}
              className="w-full p-2 border rounded-md"
            >
              {categories.slice(1).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
            <Textarea
              placeholder="Thread content"
              value={newThread.content}
              onChange={(e) => setNewThread({...newThread, content: e.target.value})}
              rows={4}
            />
            <div className="flex gap-2">
              <Button onClick={createThread}>Create Thread</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Threads List */}
      <div className="space-y-4">
        {filteredDiscussions.map((discussion) => (
          <Card key={discussion.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Vote Section */}
                <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => voteThread(discussion.id, 'up')}
                    className="p-1"
                    disabled={!user}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    {discussion.upvotes - discussion.downvotes}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => voteThread(discussion.id, 'down')}
                    className="p-1"
                    disabled={!user}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content Section */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg hover:text-blue-600 cursor-pointer">
                        {discussion.title}
                      </h3>
                    </div>
                    <Badge variant="secondary">{discussion.category}</Badge>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {discussion.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={discussion.profiles?.avatar_url} />
                          <AvatarFallback>
                            {discussion.profiles?.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600">
                          {discussion.profiles?.full_name || discussion.profiles?.username || 'Anonymous'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{discussion.replies_count} replies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDiscussions.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery || selectedCategory !== 'all' ? 'No discussions found' : 'No discussions yet'}
          </h3>
          <p className="text-gray-600">
            {searchQuery || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Start a new discussion to get the conversation going!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DiscussionBoard;
