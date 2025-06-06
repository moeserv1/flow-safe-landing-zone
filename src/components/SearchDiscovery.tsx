
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, TrendingUp, Hash, User, Users, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  type: 'user' | 'post' | 'video' | 'hashtag';
  title: string;
  description?: string;
  avatar_url?: string;
  metadata?: any;
}

const SearchDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrendingTopics();
    fetchSuggestedUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchTrendingTopics = async () => {
    try {
      // Mock trending topics - in real app, this would be based on actual data
      setTrendingTopics([
        '#LifeFlow',
        '#Community',
        '#CreatorEconomy',
        '#SocialMedia',
        '#VideoContent',
        '#Inspiration',
        '#Technology',
        '#Creativity'
      ]);
    } catch (error) {
      console.error('Error fetching trending topics:', error);
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, bio')
        .limit(5);

      if (error) throw error;
      setSuggestedUsers(data || []);
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results: SearchResult[] = [];

      // Search users
      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, bio')
        .or(`full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`)
        .limit(5);

      if (users) {
        results.push(...users.map(user => ({
          id: user.id,
          type: 'user' as const,
          title: user.full_name || user.username || 'Unknown User',
          description: user.bio,
          avatar_url: user.avatar_url
        })));
      }

      // Search posts
      const { data: posts } = await supabase
        .from('social_posts')
        .select('id, content, author_id, profiles:author_id(full_name, username, avatar_url)')
        .textSearch('content', searchQuery)
        .limit(5);

      if (posts) {
        results.push(...posts.map(post => ({
          id: post.id,
          type: 'post' as const,
          title: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
          description: `By ${(post.profiles as any)?.full_name || 'Unknown User'}`,
          avatar_url: (post.profiles as any)?.avatar_url
        })));
      }

      // Search videos
      const { data: videos } = await supabase
        .from('videos')
        .select('id, title, description, thumbnail_url, profiles:user_id(full_name, username)')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(5);

      if (videos) {
        results.push(...videos.map(video => ({
          id: video.id,
          type: 'video' as const,
          title: video.title,
          description: `By ${(video.profiles as any)?.full_name || 'Unknown User'}`,
          avatar_url: video.thumbnail_url
        })));
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4" />;
      case 'post':
        return <Hash className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users, posts, videos, hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchQuery && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <div key={`${result.type}-${result.id}`} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex-shrink-0">
                      {result.avatar_url ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={result.avatar_url} />
                          <AvatarFallback>
                            {getResultIcon(result.type)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {getResultIcon(result.type)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </p>
                      {result.description && (
                        <p className="text-sm text-gray-500 truncate">
                          {result.description}
                        </p>
                      )}
                      <Badge variant="outline" className="mt-1">
                        {result.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No results found for "{searchQuery}"
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Trending Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery(topic)}
                className="text-sm"
              >
                {topic}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Suggested Users to Follow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback>
                      {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {user.full_name || user.username}
                    </p>
                    {user.bio && (
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {user.bio}
                      </p>
                    )}
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchDiscovery;
