
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, Search, UserPlus, UserCheck, Clock } from 'lucide-react';

const FriendsList = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchOnlineUsers();
      
      // Set up real-time subscriptions
      const presenceChannel = supabase
        .channel('user_presence_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'user_presence' }, 
          () => {
            fetchOnlineUsers();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(presenceChannel);
      };
    }
  }, [user]);

  const fetchFriends = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          requester:requester_id (
            id,
            full_name,
            avatar_url,
            username
          ),
          addressee:addressee_id (
            id,
            full_name,
            avatar_url,
            username
          )
        `)
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (!error && data) {
        const friendsList = data.map((friendship: any) => {
          const friend = friendship.requester_id === user.id 
            ? friendship.addressee 
            : friendship.requester;
          return {
            ...friend,
            friendshipId: friendship.id
          };
        });
        setFriends(friendsList);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchOnlineUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_presence')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            avatar_url,
            username
          )
        `)
        .eq('status', 'online')
        .neq('user_id', user?.id || '');

      if (!error && data) {
        setOnlineUsers(data.map((presence: any) => ({
          ...presence.profiles,
          lastSeen: presence.last_seen,
          status: presence.status
        })));
      }
    } catch (error) {
      console.error('Error fetching online users:', error);
    }
  };

  const sendFriendRequest = async (targetUserId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          requester_id: user.id,
          addressee_id: targetUserId,
          status: 'pending'
        });

      if (!error) {
        console.log('Friend request sent');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const startChat = (friendId: string) => {
    setSelectedUser(friends.find(f => f.id === friendId));
  };

  const filteredOnlineUsers = onlineUsers.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFriends = friends.filter(friend => 
    friend.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Please sign in to view friends</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Friends & Online Users
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Friends List */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-3">
              Friends ({filteredFriends.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredFriends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {friend.avatar_url ? (
                          <img 
                            src={friend.avatar_url} 
                            alt={friend.full_name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <span className="text-sm font-medium text-blue-600">
                            {friend.full_name?.charAt(0) || 'U'}
                          </span>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{friend.full_name}</p>
                      <p className="text-xs text-gray-500">@{friend.username || 'user'}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startChat(friend.id)}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Chat
                  </Button>
                </div>
              ))}
              
              {filteredFriends.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No friends found
                </p>
              )}
            </div>
          </div>

          {/* Online Users */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-3">
              Online Users ({filteredOnlineUsers.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredOnlineUsers.map((onlineUser) => (
                <div key={onlineUser.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        {onlineUser.avatar_url ? (
                          <img 
                            src={onlineUser.avatar_url} 
                            alt={onlineUser.full_name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <span className="text-sm font-medium text-green-600">
                            {onlineUser.full_name?.charAt(0) || 'U'}
                          </span>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{onlineUser.full_name}</p>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                          Online
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => sendFriendRequest(onlineUser.id)}
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
              
              {filteredOnlineUsers.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No users online
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Private Chat Component would go here when selectedUser is set */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle>Chat with {selectedUser.full_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Private chat feature coming soon...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FriendsList;
