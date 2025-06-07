
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Calendar, TrendingUp, Activity } from 'lucide-react';
import { useRealtime } from '@/hooks/useRealtime';
import { formatDistanceToNow } from 'date-fns';
import CommunitySpaces from './CommunitySpaces';
import EventsCalendar from './EventsCalendar';
import DiscussionBoard from './DiscussionBoard';
import CommunityChat from './CommunityChat';

const CommunityDashboard = () => {
  const { data: discussions } = useRealtime('discussions');
  const { data: events } = useRealtime('events');
  const { data: messages } = useRealtime('community_messages');
  const { data: profiles } = useRealtime('profiles');

  // Get recent activity
  const recentDiscussions = discussions
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const upcomingEvents = events
    .filter((event: any) => new Date(event.start_date) > new Date())
    .sort((a: any, b: any) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .slice(0, 3);

  const stats = {
    totalMembers: profiles.length,
    activeDiscussions: discussions.length,
    upcomingEvents: upcomingEvents.length,
    totalMessages: messages.length
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Community Hub
        </h1>
        <p className="text-gray-600">Connect, share, and grow together in our vibrant community</p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Total Members</p>
                <p className="text-2xl font-bold text-blue-700">{stats.totalMembers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Active Discussions</p>
                <p className="text-2xl font-bold text-green-700">{stats.activeDiscussions}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">Upcoming Events</p>
                <p className="text-2xl font-bold text-purple-700">{stats.upcomingEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">Messages Today</p>
                <p className="text-2xl font-bold text-orange-700">{stats.totalMessages}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Discussions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDiscussions.map((discussion: any) => (
                <div key={discussion.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">{discussion.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {discussion.category}
                  </Badge>
                </div>
              ))}
              {recentDiscussions.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No discussions yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event: any) => (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">{event.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(event.start_date).toLocaleDateString()} at {new Date(event.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {event.event_type}
                  </Badge>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No upcoming events</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Community Tabs */}
      <Tabs defaultValue="discussions" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
          <TabsTrigger value="discussions" className="rounded-lg">Discussions</TabsTrigger>
          <TabsTrigger value="spaces" className="rounded-lg">Spaces</TabsTrigger>
          <TabsTrigger value="events" className="rounded-lg">Events</TabsTrigger>
          <TabsTrigger value="chat" className="rounded-lg">Live Chat</TabsTrigger>
        </TabsList>
        
        <TabsContent value="discussions" className="mt-6">
          <DiscussionBoard />
        </TabsContent>
        
        <TabsContent value="spaces" className="mt-6">
          <CommunitySpaces />
        </TabsContent>
        
        <TabsContent value="events" className="mt-6">
          <EventsCalendar />
        </TabsContent>
        
        <TabsContent value="chat" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Live Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <CommunityChat />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityDashboard;
