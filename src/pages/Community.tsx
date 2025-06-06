
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CommunitySpaces from '@/components/CommunitySpaces';
import EventsCalendar from '@/components/EventsCalendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Community = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="spaces" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="spaces">Community Spaces</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            <TabsContent value="spaces">
              <CommunitySpaces />
            </TabsContent>
            <TabsContent value="events">
              <EventsCalendar />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Community;
