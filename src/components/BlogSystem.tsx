
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Edit, 
  Eye, 
  Calendar, 
  User, 
  Search,
  Share,
  Heart,
  MessageCircle,
  Plus
} from 'lucide-react';

const BlogSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: [] as string[],
    status: 'draft' as 'draft' | 'published'
  });

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles:author_id (
            full_name,
            avatar_url,
            username
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user || !newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const slug = newPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          title: newPost.title,
          content: newPost.content,
          excerpt: newPost.excerpt || newPost.content.substring(0, 150) + '...',
          author_id: user.id,
          slug,
          tags: newPost.tags,
          status: newPost.status
        }])
        .select(`
          *,
          profiles:author_id (
            full_name,
            avatar_url,
            username
          )
        `)
        .single();

      if (error) throw error;

      if (newPost.status === 'published') {
        setPosts([data, ...posts]);
      }

      setNewPost({
        title: '',
        content: '',
        excerpt: '',
        tags: [],
        status: 'draft'
      });
      setIsCreating(false);

      toast({
        title: "Success",
        description: `Blog post ${newPost.status === 'published' ? 'published' : 'saved as draft'}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleViewPost = async (post: any) => {
    setSelectedPost(post);
    
    // Increment view count
    try {
      await supabase.rpc('increment_blog_view_count', { post_id: post.id });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button 
          variant="outline" 
          onClick={() => setSelectedPost(null)}
          className="mb-6"
        >
          ← Back to Blog
        </Button>

        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{selectedPost.title}</h1>
            
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{selectedPost.profiles?.full_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(selectedPost.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{selectedPost.view_count || 0} views</span>
              </div>
            </div>

            {selectedPost.tags && selectedPost.tags.length > 0 && (
              <div className="flex gap-2 mb-6">
                {selectedPost.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary">#{tag}</Badge>
                ))}
              </div>
            )}
          </header>

          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {selectedPost.content}
          </div>

          <footer className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Comment
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </footer>
        </article>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Create Blog Post</h1>
          <Button variant="outline" onClick={() => setIsCreating(false)}>
            Cancel
          </Button>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                placeholder="Enter your blog post title..."
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Excerpt (Optional)</label>
              <Textarea
                placeholder="Brief description of your post..."
                value={newPost.excerpt}
                onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea
                placeholder="Write your blog post content..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows={15}
                className="min-h-[400px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
              <Input
                placeholder="technology, programming, tutorial"
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                  setNewPost({ ...newPost, tags });
                }}
              />
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={() => {
                  setNewPost({ ...newPost, status: 'draft' });
                  handleCreatePost();
                }}
                variant="outline"
              >
                Save Draft
              </Button>
              <Button 
                onClick={() => {
                  setNewPost({ ...newPost, status: 'published' });
                  handleCreatePost();
                }}
              >
                Publish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog</h1>
          <p className="text-gray-600">Discover insights, tutorials, and stories from our community</p>
        </div>
        {user && (
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Write Post
          </Button>
        )}
      </div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card 
              key={post.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleViewPost(post)}
            >
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-blue-500" />
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-1 mb-4 flex-wrap">
                    {post.tags.slice(0, 3).map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    <span>{post.profiles?.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-3 h-3" />
                    <span>{post.view_count || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredPosts.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
          <p className="text-gray-600">
            {searchQuery ? 'Try adjusting your search terms' : 'Be the first to write a blog post!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogSystem;
