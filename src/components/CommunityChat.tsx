import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send, Minimize2, Maximize2, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useDraggable } from '@/hooks/useDraggable';
import { useIsMobile } from '@/hooks/use-mobile';

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

const CommunityChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { ref } = useDraggable({ x: 24, y: window.innerHeight - 450 });

  // Mobile chat toggle state (lifted out to window for both chats)
  // @ts-ignore
  window.__OPEN_CHAT__ = window.__OPEN_CHAT__ || "community";
  const [visibleOnMobile, setVisibleOnMobile] = useState(() =>
    isMobile ? window.__OPEN_CHAT__ === "community" : true
  );

  useEffect(() => {
    if (isMobile) {
      const handler = () => setVisibleOnMobile(window.__OPEN_CHAT__ === "community");
      window.addEventListener("__chat_switch", handler);
      return () => window.removeEventListener("__chat_switch", handler);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isOpen && user) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [isOpen, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('community_messages')
      .select(`
        *,
        profiles:sender_id (
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data || []);
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('community_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_messages'
        },
        async (payload) => {
          // Fetch the complete message with profile data
          const { data } = await supabase
            .from('community_messages')
            .select(`
              *,
              profiles:sender_id (
                full_name,
                avatar_url
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setMessages(prev => [...prev, data]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setIsLoading(true);
    const { error } = await supabase
      .from('community_messages')
      .insert({
        sender_id: user.id,
        message: newMessage.trim()
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } else {
      setNewMessage('');
    }
    setIsLoading(false);
  };

  if (!user) return null;

  // Both minimized and closed state suppressed on mobile if not shown
  if (isMobile && !visibleOnMobile) return null;

  // Mobile styles: docked to bottom, full width. Desktop: floating and draggable.
  const containerClass = isMobile
    ? "fixed bottom-0 left-0 w-full max-w-none h-[350px] z-50 bg-white rounded-t-xl shadow-2xl border-t"
    : "fixed bottom-4 left-4 w-80 h-96 shadow-xl z-50 flex flex-col bg-white rounded-xl";

  return (
    <>
      {/* Chat Toggle Button (only visible if closed AND (desktop OR current toggle on mobile)) */}
      {!isOpen && (!isMobile || (isMobile && window.__OPEN_CHAT__ !== "community")) && (
        <Button
          onClick={() => {
            setIsOpen(true);
            if (isMobile) {
              window.__OPEN_CHAT__ = "community";
              window.dispatchEvent(new CustomEvent("__chat_switch"));
            }
          }}
          className={`fixed ${isMobile ? "bottom-20 left-1/2 -translate-x-1/2" : "bottom-4 left-4"} rounded-full w-14 h-14 p-0 bg-blue-600 hover:bg-blue-700 shadow-lg z-50`}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
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
            <div className="drag-handle cursor-move w-full h-5 rounded-t-xl flex items-center px-2 bg-blue-50" />
          )}
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Community Chat
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
                  onClick={() => {
                    setIsOpen(false);
                    // On mobile: remove toggle state
                    if (isMobile) {
                      window.__OPEN_CHAT__ = null;
                      window.dispatchEvent(new CustomEvent("__chat_switch"));
                    }
                  }}
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
                  {messages.map((message) => (
                    <div key={message.id} className="flex gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.profiles?.avatar_url} />
                        <AvatarFallback>
                          {message.profiles?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {message.profiles?.full_name || 'Unknown User'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button type="submit" size="sm" disabled={isLoading || !newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
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
              variant={visibleOnMobile ? "default" : "outline"}
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
              variant="outline"
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

export default CommunityChat;
