
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'virtual' | 'in-person' | 'hybrid';
  attendees: number;
  max_attendees?: number;
  is_rsvp: boolean;
}

const EventsCalendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Mock events data
    setEvents([
      {
        id: '1',
        title: 'Community Meetup',
        description: 'Monthly community gathering to connect and share ideas',
        date: '2024-01-20',
        time: '18:00',
        location: 'Virtual Room',
        type: 'virtual',
        attendees: 45,
        max_attendees: 100,
        is_rsvp: false
      },
      {
        id: '2',
        title: 'Creator Workshop',
        description: 'Learn advanced video editing techniques',
        date: '2024-01-25',
        time: '14:00',
        location: 'Creative Hub, Downtown',
        type: 'in-person',
        attendees: 12,
        max_attendees: 20,
        is_rsvp: false
      },
      {
        id: '3',
        title: 'Live Q&A Session',
        description: 'Ask questions about the platform and upcoming features',
        date: '2024-01-30',
        time: '20:00',
        location: 'YouTube Live',
        type: 'virtual',
        attendees: 234,
        is_rsvp: true
      }
    ]);
  }, []);

  const handleRSVP = (eventId: string) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              is_rsvp: !event.is_rsvp,
              attendees: event.is_rsvp ? event.attendees - 1 : event.attendees + 1
            }
          : event
      )
    );
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'virtual':
        return 'bg-blue-100 text-blue-800';
      case 'in-person':
        return 'bg-green-100 text-green-800';
      case 'hybrid':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Events & Meetups</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {format(selectedDate, 'MMMM yyyy')}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Click on events to view details
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="lg:col-span-2 space-y-4">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-3">{event.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {event.time}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        {event.attendees} attending
                        {event.max_attendees && ` / ${event.max_attendees} max`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                    
                    <Button
                      onClick={() => handleRSVP(event.id)}
                      variant={event.is_rsvp ? "default" : "outline"}
                      size="sm"
                    >
                      {event.is_rsvp ? 'Going' : 'RSVP'}
                    </Button>
                  </div>
                </div>
                
                {event.max_attendees && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Attendance</span>
                      <span>{event.attendees}/{event.max_attendees}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ 
                          width: `${Math.min((event.attendees / event.max_attendees) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events scheduled</h3>
          <p className="text-gray-600">Create the first event to get the community together!</p>
        </div>
      )}
    </div>
  );
};

export default EventsCalendar;
