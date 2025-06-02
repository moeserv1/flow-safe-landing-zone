
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Clock, User, Eye, Search, TrendingUp } from "lucide-react";

const Blog = () => {
  const blogStats = [
    { label: "Published Articles", value: "2,847", icon: BookOpen },
    { label: "Weekly Readers", value: "45,230", icon: Eye },
    { label: "Contributing Authors", value: "127", icon: User },
    { label: "Monthly Growth", value: "+18%", icon: TrendingUp }
  ];

  const articles = [
    {
      title: "The Future of Remote Work: Trends and Predictions for 2024",
      author: "Alex Thompson",
      excerpt: "Exploring how remote work continues to evolve and what organizations need to know to stay competitive...",
      readTime: "8 min read",
      publishDate: "3 days ago",
      views: 2847,
      category: "Workplace Trends",
      image: "/placeholder.svg"
    },
    {
      title: "Building Resilient Teams in a Digital Age",
      author: "Maria Santos",
      excerpt: "Learn practical strategies for fostering team resilience and maintaining strong connections in virtual environments...",
      readTime: "6 min read",
      publishDate: "1 week ago",
      views: 1923,
      category: "Leadership",
      image: "/placeholder.svg"
    },
    {
      title: "AI and the Changing Landscape of Professional Skills",
      author: "David Chen",
      excerpt: "Understanding which skills will be most valuable as AI continues to transform the workplace...",
      readTime: "10 min read",
      publishDate: "2 weeks ago",
      views: 3421,
      category: "Technology",
      image: "/placeholder.svg"
    }
  ];

  const categories = [
    "All Posts", "Technology", "Career Development", "Leadership", 
    "Workplace Trends", "Industry Insights", "Personal Growth"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              LifeFlow Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Insights, trends, and expert perspectives on professional development, technology, and the future of work.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  placeholder="Search articles..." 
                  className="pl-10 py-3"
                />
              </div>
              <Button>Search</Button>
            </div>
          </div>

          {/* Blog Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {blogStats.map((stat, index) => (
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
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category, index) => (
                    <Button 
                      key={index} 
                      variant={index === 0 ? "default" : "ghost"} 
                      className="w-full justify-start"
                    >
                      {category}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Popular Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["Remote Work", "AI", "Leadership", "Career", "Technology", "Innovation"].map((tag, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-blue-100">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-700">
                Write Article
              </Button>
            </div>

            {/* Article Listings */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
                <select className="border border-gray-300 rounded-md px-3 py-2">
                  <option>Sort by: Newest</option>
                  <option>Sort by: Most Read</option>
                  <option>Sort by: Trending</option>
                </select>
              </div>

              <div className="space-y-8">
                {articles.map((article, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-1">
                          <img 
                            src={article.image} 
                            alt={article.title}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{article.category}</Badge>
                            <span className="text-sm text-gray-500">{article.publishDate}</span>
                          </div>
                          
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
                            {article.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-4">{article.excerpt}</p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {article.author}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {article.readTime}
                              </div>
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {article.views.toLocaleString()} views
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">Read More</Button>
                          </div>
                        </div>
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

export default Blog;
