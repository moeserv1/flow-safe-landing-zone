
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Heart, MessageCircle, UserPlus, Calendar, Check, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'event';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  actor?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

const NotificationCenter = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Real-time subscription for new notifications
      const channel = supabase
        .channel('notifications')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'notifications' },
          () => fetchNotifications()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      // Mock notifications since we don't have a notifications table yet
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'like',
          title: 'New Like',
          message: 'John Doe liked your post',
          is_read: false,
          created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          actor: {
            full_name: 'John Doe',
            username: 'johndoe',
            avatar_url: undefined
          }
        },
        {
          id: '2',
          type: 'comment',
          title: 'New Comment',
          message: 'Jane Smith commented on your video',
          is_read: false,
          created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          actor: {
            full_name: 'Jane Smith',
            username: 'janesmith',
            avatar_url: undefined
          }
        },
        {
          id: '3',
          type: 'follow',
          title: 'New Follower',
          message: 'Mike Johnson started following you',
          is_read: true,
          created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          actor: {
            full_name: 'Mike Johnson',
            username: 'mikejohnson',
            avatar_url: undefined
          }
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, is_read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, is_read: true }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'mention':
        return <Bell className="h-4 w-4 text-purple-500" />;
      case 'event':
        return <Calendar className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.is_read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      {notification.actor ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={notification.actor.avatar_url} />
                          <AvatarFallback>
                            {notification.actor.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="ml-2"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
