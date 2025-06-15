import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MessageCircle, X, Minimize2, Maximize2, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useDraggable } from '@/hooks/useDraggable';
import { useIsMobile } from '@/hooks/use-mobile';

interface Friend {
  id: string;
  full_name: string;
  avatar_url: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen: string;
}

declare global {
  interface Window {
    __OPEN_CHAT__?: string | null;
  }
}

const FriendsChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [onlineFriends, setOnlineFriends] = useState<Friend[]>([]);
  const [offlineFriends, setOfflineFriends] = useState<Friend[]>([]);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { ref } = useDraggable({ x: window.innerWidth - 400, y: window.innerHeight - 450 });

  // Mobile chat toggle state (lifted out to window for both chats)
  // @ts-ignore
  window.__OPEN_CHAT__ = window.__OPEN_CHAT__ || "community";
  const [visibleOnMobile, setVisibleOnMobile] = useState(() =>
    isMobile ? window.__OPEN_CHAT__ === "friends" : true
  );

  useEffect(() => {
    if (isMobile) {
      const handler = () => setVisibleOnMobile(window.__OPEN_CHAT__ === "friends");
      window.addEventListener("__chat_switch", handler);
      return () => window.removeEventListener("__chat_switch", handler);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isOpen && user) {
      fetchFriends();
      subscribeToPresence();
    }
  }, [isOpen, user]);

  useEffect(() => {
    // Separate online and offline friends
    const online = friends.filter(friend => friend.status !== 'offline');
    const offline = friends.filter(friend => friend.status === 'offline');
    setOnlineFriends(online);
    setOfflineFriends(offline);
  }, [friends]);

  const fetchFriends = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('friendships')
      .select(`
        addressee_id,
        requester_id
      `)
      .eq('status', 'accepted')
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    if (error) {
      console.error('Error fetching friends:', error);
      return;
    }

    // Get friend IDs
    const friendIds = data?.map(friendship => {
      return friendship.requester_id === user.id 
        ? friendship.addressee_id 
        : friendship.requester_id;
    }) || [];

    if (friendIds.length > 0) {
      const { data: presenceData } = await supabase
        .from('user_presence')
        .select('*')
        .in('user_id', friendIds);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', friendIds);

      const friendsWithPresence = profileData?.map(profile => {
        const presence = presenceData?.find(p => p.user_id === profile.id);
        return {
          ...profile,
          status: (presence?.status as 'online' | 'away' | 'busy' | 'offline') || 'offline',
          last_seen: presence?.last_seen || new Date().toISOString()
        };
      }) || [];

      setFriends(friendsWithPresence);
    }
  };

  const subscribeToPresence = () => {
    const channel = supabase
      .channel('user_presence_friends')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence'
        },
        () => {
          fetchFriends(); // Refresh friends list when presence changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  if (!user) return null;

  // Both minimized and closed state suppressed on mobile if not shown
  if (isMobile && !visibleOnMobile) return null;

  const containerClass = isMobile
    ? "fixed bottom-0 right-0 left-0 w-full max-w-none h-[350px] z-50 bg-white rounded-t-xl shadow-2xl border-t"
    : "fixed bottom-4 right-4 w-80 h-96 shadow-xl z-50 flex flex-col bg-white rounded-xl";

  return (
    <>
      {/* Friends Toggle Button (only visible if closed AND (desktop OR not active on mobile)) */}
      {!isOpen && (!isMobile || (isMobile && window.__OPEN_CHAT__ !== "friends")) && (
        <Button
          onClick={() => {
            setIsOpen(true);
            if (isMobile) {
              window.__OPEN_CHAT__ = "friends";
              window.dispatchEvent(new CustomEvent("__chat_switch"));
            }
          }}
          className={`fixed ${isMobile ? "bottom-20 right-4" : "bottom-4 right-4"} rounded-full w-14 h-14 p-0 bg-green-600 hover:bg-green-700 shadow-lg z-50`}
        >
          <Users className="h-6 w-6" />
        </Button>
      )}

      {/* Friends Window */}
      {isOpen && (
        <div
          ref={isMobile ? undefined : ref}
          className={containerClass}
          style={
            isMobile
              ? { transform: "none" }
              : {}
          }
        >
          {/* Drag handle for desktop */}
          {!isMobile && (
            <div className="drag-handle cursor-move w-full h-5 rounded-t-xl flex items-center px-2 bg-green-50" />
          )}
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                Friends ({onlineFriends.length} online)
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-6 w-6 p-0"
                >
                  {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {/* Online Friends */}
                  {onlineFriends.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Online - {onlineFriends.length}
                      </h4>
                      <div className="space-y-2">
                        {onlineFriends.map((friend) => (
                          <div key={friend.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <div className="relative">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={friend.avatar_url} />
                                <AvatarFallback>
                                  {friend.full_name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(friend.status)}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{friend.full_name}</p>
                              <p className="text-xs text-gray-500 capitalize">{friend.status}</p>
                            </div>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <MessageCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Offline Friends */}
                  {offlineFriends.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Offline - {offlineFriends.length}
                      </h4>
                      <div className="space-y-2">
                        {offlineFriends.map((friend) => (
                          <div key={friend.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer opacity-60">
                            <div className="relative">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={friend.avatar_url} />
                                <AvatarFallback>
                                  {friend.full_name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(friend.status)}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{friend.full_name}</p>
                              <p className="text-xs text-gray-500">
                                Last seen {new Date(friend.last_seen).toLocaleDateString()}
                              </p>
                            </div>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <MessageCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {friends.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No friends yet</p>
                      <p className="text-xs">Start connecting with people!</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <Button className="w-full" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Find Friends
                </Button>
              </div>
            </CardContent>
          )}
        </div>
      )}

      {/* Mobile Chat Switcher Bar */}
      {isMobile && isOpen && (
        <div className="fixed left-0 right-0 bottom-[350px] flex z-50 justify-center">
          <div className="inline-flex rounded-full shadow-lg bg-white/80 border">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                window.__OPEN_CHAT__ = "community";
                window.dispatchEvent(new CustomEvent("__chat_switch"));
              }}
              className="rounded-full"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={visibleOnMobile ? "default" : "outline"}
              onClick={() => {
                window.__OPEN_CHAT__ = "friends";
                window.dispatchEvent(new CustomEvent("__chat_switch"));
              }}
              className="rounded-full"
            >
              <Users className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default FriendsChat;
