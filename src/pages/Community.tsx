
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, TrendingUp, Calendar, MapPin, Filter } from "lucide-react";

const Community = () => {
  const communityStats = [
    { label: "Active Members", value: "50,847", icon: Users },
    { label: "Daily Discussions", value: "2,341", icon: MessageCircle },
    { label: "Growth This Month", value: "+12.5%", icon: TrendingUp },
    { label: "Events This Week", value: "18", icon: Calendar }
  ];

  const discussions = [
    {
      title: "Best Practices for Remote Team Collaboration",
      author: "Sarah Chen",
      replies: 24,
      views: 1247,
      lastActivity: "2 hours ago",
      tags: ["Remote Work", "Collaboration", "Productivity"]
    },
    {
      title: "Industry Trends in AI and Machine Learning",
      author: "Marcus Rodriguez",
      replies: 67,
      views: 3421,
      lastActivity: "4 hours ago",
      tags: ["AI", "Technology", "Innovation"]
    },
    {
      title: "Networking Events and Professional Development",
      author: "Jennifer Park",
      replies: 15,
      views: 892,
      lastActivity: "6 hours ago",
      tags: ["Networking", "Career", "Events"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Welcome to the Community
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connect with professionals, share insights, and grow together in our thriving community platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-700">
                Start Discussion
              </Button>
              <Button variant="outline" size="lg">
                Browse Topics
              </Button>
            </div>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {communityStats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">General Discussion</Button>
                  <Button variant="ghost" className="w-full justify-start">Career Development</Button>
                  <Button variant="ghost" className="w-full justify-start">Technology</Button>
                  <Button variant="ghost" className="w-full justify-start">Industry News</Button>
                  <Button variant="ghost" className="w-full justify-start">Networking</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="border-l-4 border-blue-600 pl-3">
                    <h4 className="font-medium">Virtual Networking</h4>
                    <p className="text-sm text-gray-600">Tomorrow, 2:00 PM</p>
                  </div>
                  <div className="border-l-4 border-green-600 pl-3">
                    <h4 className="font-medium">Tech Talk Series</h4>
                    <p className="text-sm text-gray-600">Friday, 10:00 AM</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Discussion Area */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Latest Discussions</h2>
                <Button>New Discussion</Button>
              </div>

              <div className="space-y-4">
                {discussions.map((discussion, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                          {discussion.title}
                        </h3>
                        <span className="text-sm text-gray-500">{discussion.lastActivity}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>by {discussion.author}</span>
                          <span>{discussion.replies} replies</span>
                          <span>{discussion.views} views</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {discussion.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Community;
