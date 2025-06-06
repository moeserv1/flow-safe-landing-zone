
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, ThumbsUp, ThumbsDown, Pin, Search, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Thread {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  upvotes: number;
  downvotes: number;
  reply_count: number;
  is_pinned: boolean;
  created_at: string;
  profiles: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

const DiscussionBoard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [threads, setThreads] = useState<Thread[]>([]);
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

  useEffect(() => {
    fetchThreads();
  }, [selectedCategory, searchQuery]);

  const fetchThreads = async () => {
    try {
      let query = supabase
        .from('social_posts')
        .select(`
          *,
          profiles:author_id (
            full_name,
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.contains('tags', [selectedCategory]);
      }

      if (searchQuery) {
        query = query.textSearch('content', searchQuery);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Transform posts to thread format
      const transformedThreads = data?.map(post => ({
        id: post.id,
        title: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
        content: post.content,
        category: post.tags?.[0] || 'general',
        author_id: post.author_id,
        upvotes: Math.floor(post.likes_count * 0.8),
        downvotes: Math.floor(post.likes_count * 0.2),
        reply_count: post.comments_count,
        is_pinned: false,
        created_at: post.created_at,
        profiles: post.profiles
      })) || [];

      setThreads(transformedThreads);
    } catch (error: any) {
      console.error('Error fetching threads:', error);
    }
  };

  const createThread = async () => {
    if (!user || !newThread.title.trim() || !newThread.content.trim()) return;

    try {
      const { error } = await supabase
        .from('social_posts')
        .insert({
          author_id: user.id,
          content: `${newThread.title}\n\n${newThread.content}`,
          tags: [newThread.category],
          media_type: 'discussion'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Thread created successfully"
      });

      setNewThread({ title: '', content: '', category: 'general' });
      setShowCreateForm(false);
      fetchThreads();
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
      // Implementation for voting would go here
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Discussion Board</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Thread
        </Button>
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
        {threads.map((thread) => (
          <Card key={thread.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Vote Section */}
                <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => voteThread(thread.id, 'up')}
                    className="p-1"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    {thread.upvotes - thread.downvotes}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => voteThread(thread.id, 'down')}
                    className="p-1"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content Section */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {thread.is_pinned && <Pin className="h-4 w-4 text-blue-500" />}
                      <h3 className="font-semibold text-lg hover:text-blue-600 cursor-pointer">
                        {thread.title}
                      </h3>
                    </div>
                    <Badge variant="secondary">{thread.category}</Badge>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {thread.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={thread.profiles.avatar_url} />
                          <AvatarFallback>
                            {thread.profiles.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600">
                          {thread.profiles.full_name || thread.profiles.username}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{thread.reply_count} replies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {threads.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions found</h3>
          <p className="text-gray-600">Start a new discussion to get the conversation going!</p>
        </div>
      )}
    </div>
  );
};

export default DiscussionBoard;
