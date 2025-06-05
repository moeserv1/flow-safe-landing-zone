
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Search, MessageCircle, Settings } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      // For now, let's use existing data from videos table as community spaces
      const { data, error } = await supabase
        .from('videos')
        .select(`
          id,
          title,
          description,
          user_id,
          created_at,
          views_count
        `)
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;

      // Transform video data to community spaces format
      const transformedSpaces = data?.map(video => ({
        id: video.id,
        name: video.title,
        description: video.description || 'Community space for video discussions',
        category: 'Video Community',
        member_count: Math.floor(Math.random() * 500) + 10,
        is_public: true,
        creator_id: video.user_id,
        created_at: video.created_at
      })) || [];

      setSpaces(transformedSpaces);
    } catch (error: any) {
      console.error('Error fetching spaces:', error);
      toast({
        title: "Error",
        description: "Failed to load community spaces",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSpaces = spaces.filter(space =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Community Spaces</h1>
        <p className="text-gray-600 mb-6">
          Join vibrant communities to connect, learn, and grow together
        </p>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Space
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpaces.map((space) => (
            <Card key={space.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span className="text-lg font-semibold line-clamp-2">{space.name}</span>
                  <Badge variant="secondary">{space.category}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {space.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{space.member_count} members</span>
                  </div>
                  <Badge variant={space.is_public ? "outline" : "secondary"}>
                    {space.is_public ? "Public" : "Private"}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Join Space
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredSpaces.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No spaces found</h3>
          <p className="text-gray-600">Try adjusting your search or create a new space</p>
        </div>
      )}
    </div>
  );
};

export default CommunitySpaces;
