
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Edit, 
  Trash2, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus,
  Save,
  BarChart
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  author_id: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  tags: string[];
  featured_image_url?: string;
}

const BlogManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    featured_image_url: ''
  });

  useEffect(() => {
    if (user) {
      fetchBlogPosts();
    }
  }, [user]);

  const fetchBlogPosts = () => {
    // Mock blog posts data
    const mockPosts: BlogPost[] = [
      {
        id: '1',
        title: 'Getting Started with React',
        content: 'This is a comprehensive guide to React development...',
        excerpt: 'Learn the basics of React development',
        status: 'published',
        author_id: user?.id || '',
        view_count: 1250,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['react', 'javascript', 'frontend']
      },
      {
        id: '2',
        title: 'Advanced TypeScript Patterns',
        content: 'Exploring advanced TypeScript patterns and techniques...',
        excerpt: 'Deep dive into TypeScript advanced features',
        status: 'draft',
        author_id: user?.id || '',
        view_count: 0,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        tags: ['typescript', 'programming', 'patterns']
      },
      {
        id: '3',
        title: 'Building Scalable APIs',
        content: 'How to design and build scalable REST APIs...',
        excerpt: 'Best practices for API development',
        status: 'published',
        author_id: user?.id || '',
        view_count: 890,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['api', 'backend', 'nodejs']
      }
    ];

    setPosts(mockPosts);
  };

  const createPost = async () => {
    if (!newPost.title || !newPost.content) {
      toast({
        title: 'Validation Error',
        description: 'Title and content are required',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const post: BlogPost = {
        id: Date.now().toString(),
        title: newPost.title,
        content: newPost.content,
        excerpt: newPost.excerpt || newPost.content.substring(0, 150) + '...',
        status: 'draft',
        author_id: user?.id || '',
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        featured_image_url: newPost.featured_image_url
      };

      setPosts(prev => [post, ...prev]);
      setNewPost({ title: '', content: '', excerpt: '', tags: '', featured_image_url: '' });

      toast({
        title: 'Post Created',
        description: 'Your blog post has been created successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (post: BlogPost) => {
    setLoading(true);
    try {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...post, updated_at: new Date().toISOString() } : p));
      setEditingPost(null);

      toast({
        title: 'Post Updated',
        description: 'Your blog post has been updated successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setLoading(true);
    try {
      setPosts(prev => prev.filter(p => p.id !== postId));
      toast({
        title: 'Post Deleted',
        description: 'Your blog post has been deleted successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const publishPost = async (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, status: 'published' as const, updated_at: new Date().toISOString() }
        : p
    ));

    toast({
      title: 'Post Published',
      description: 'Your blog post is now live!'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'published':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'archived':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-600">Please sign in to manage your blog posts</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Blog Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="posts">My Posts</TabsTrigger>
              <TabsTrigger value="create">Create New</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Your Blog Posts</h3>
                <div className="flex gap-2">
                  <Badge variant="outline">{posts.filter(p => p.status === 'published').length} Published</Badge>
                  <Badge variant="outline">{posts.filter(p => p.status === 'draft').length} Drafts</Badge>
                </div>
              </div>

              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold">{post.title}</h4>
                            <Badge className={getStatusColor(post.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(post.status)}
                                {post.status}
                              </div>
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{post.excerpt}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span>{post.view_count} views</span>
                            <span>Updated {new Date(post.updated_at).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex gap-2">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-6">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingPost(post)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          
                          {post.status === 'draft' && (
                            <Button
                              size="sm"
                              onClick={() => publishPost(post.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Publish
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deletePost(post.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
              <h3 className="text-lg font-semibold">Create New Post</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    placeholder="Enter post title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Excerpt</label>
                  <Textarea
                    value={newPost.excerpt}
                    onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                    placeholder="Brief description of your post..."
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <Textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder="Write your blog post content here..."
                    rows={10}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <Input
                    value={newPost.tags}
                    onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                    placeholder="react, javascript, tutorial"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Featured Image URL</label>
                  <Input
                    value={newPost.featured_image_url}
                    onChange={(e) => setNewPost({...newPost, featured_image_url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={createPost} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button variant="outline" disabled={loading}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <h3 className="text-lg font-semibold">Blog Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <BarChart className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm font-medium">Total Views</p>
                    <p className="text-2xl font-bold">{posts.reduce((sum, post) => sum + post.view_count, 0)}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-sm font-medium">Published Posts</p>
                    <p className="text-2xl font-bold">{posts.filter(p => p.status === 'published').length}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-sm font-medium">Draft Posts</p>
                    <p className="text-2xl font-bold">{posts.filter(p => p.status === 'draft').length}</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Most Popular Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {posts
                      .filter(p => p.status === 'published')
                      .sort((a, b) => b.view_count - a.view_count)
                      .slice(0, 5)
                      .map((post) => (
                        <div key={post.id} className="flex justify-between items-center">
                          <span className="font-medium">{post.title}</span>
                          <Badge variant="secondary">{post.view_count} views</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <h3 className="text-lg font-semibold">Blog Settings</h3>
              
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Blog Title</label>
                      <Input placeholder="My Awesome Blog" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Blog Description</label>
                      <Textarea placeholder="A blog about technology and development..." rows={3} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Author Bio</label>
                      <Textarea placeholder="Tell readers about yourself..." rows={3} />
                    </div>
                    
                    <Button>
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Post Modal */}
      {editingPost && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Post: {editingPost.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <Textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                  rows={10}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => updatePost(editingPost)} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingPost(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlogManagement;
