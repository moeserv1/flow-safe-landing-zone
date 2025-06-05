
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Plus, 
  MessageCircle, 
  Globe, 
  Lock,
  Search
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CommunitySpace {
  id: string;
  name: string;
  description: string;
  category: string;
  member_count: number;
  is_public: boolean;
  creator_id: string;
  created_at: string;
}

const CommunitySpaces = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [spaces, setSpaces] = useState<CommunitySpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newSpace, setNewSpace] = useState({
    name: '',
    description: '',
    category: '',
    is_public: true
  });

  const categories = [
    'Technology',
    'Gaming',
    'Art & Design',
    'Music',
    'Fitness',
    'Cooking',
    'Travel',
    'Education',
    'Business',
    'Lifestyle'
  ];

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      const { data, error } = await supabase
        .from('community_spaces')
        .select('*')
        .eq('is_public', true)
        .order('member_count', { ascending: false });

      if (error) throw error;
      setSpaces(data || []);
    } catch (error) {
      console.error('Error fetching spaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSpace = async () => {
    if (!user || !newSpace.name.trim()) return;

    try {
      const { data, error } = await supabase
        .from('community_spaces')
        .insert([{
          name: newSpace.name,
          description: newSpace.description,
          category: newSpace.category,
          creator_id: user.id,
          is_public: newSpace.is_public
        }])
        .select()
        .single();

      if (error) throw error;

      // Add creator as owner
      await supabase
        .from('space_memberships')
        .insert([{
          space_id: data.id,
          user_id: user.id,
          role: 'owner'
        }]);

      toast({
        title: "Success!",
        description: "Community space created successfully"
      });

      setSpaces(prev => [data, ...prev]);
      setCreateDialogOpen(false);
      setNewSpace({ name: '', description: '', category: '', is_public: true });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const joinSpace = async (spaceId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('space_memberships')
        .insert([{
          space_id: spaceId,
          user_id: user.id,
          role: 'member'
        }]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've joined the community space"
      });

      // Update member count locally
      setSpaces(prev => prev.map(space => 
        space.id === spaceId 
          ? { ...space, member_count: space.member_count + 1 }
          : space
      ));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredSpaces = spaces.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || space.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="p-6">Loading community spaces...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Community Spaces</h1>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Space
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Community Space</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="space-name">Space Name</Label>
                <Input
                  id="space-name"
                  value={newSpace.name}
                  onChange={(e) => setNewSpace(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter space name"
                />
              </div>
              
              <div>
                <Label htmlFor="space-description">Description</Label>
                <Textarea
                  id="space-description"
                  value={newSpace.description}
                  onChange={(e) => setNewSpace(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your community space"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="space-category">Category</Label>
                <Select onValueChange={(value) => setNewSpace(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="public-space"
                  checked={newSpace.is_public}
                  onChange={(e) => setNewSpace(prev => ({ ...prev, is_public: e.target.checked }))}
                />
                <Label htmlFor="public-space">Make this space public</Label>
              </div>
              
              <Button onClick={createSpace} className="w-full">
                Create Space
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search spaces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Spaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpaces.map((space) => (
          <Card key={space.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{space.name}</CardTitle>
                  <Badge variant="secondary">{space.category}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  {space.is_public ? (
                    <Globe className="h-4 w-4 text-green-500" />
                  ) : (
                    <Lock className="h-4 w-4 text-gray-500" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {space.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{space.member_count} members</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={() => joinSpace(space.id)}>
                    Join
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSpaces.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No spaces found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create a community space!'}
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Space
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommunitySpaces;
