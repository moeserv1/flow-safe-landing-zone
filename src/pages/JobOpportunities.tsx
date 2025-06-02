
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Briefcase, MapPin, Clock, DollarSign, Users, Search, Filter } from "lucide-react";

const JobOpportunities = () => {
  const jobStats = [
    { label: "Active Jobs", value: "1,247", icon: Briefcase },
    { label: "Companies", value: "384", icon: Users },
    { label: "Remote Jobs", value: "698", icon: MapPin },
    { label: "New This Week", value: "127", icon: Clock }
  ];

  const jobs = [
    {
      title: "Senior Full Stack Developer",
      company: "TechFlow Inc.",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $160k",
      description: "Join our innovative team building next-generation web applications...",
      tags: ["React", "Node.js", "TypeScript", "Remote"],
      posted: "2 days ago"
    },
    {
      title: "Product Manager",
      company: "InnovateNow",
      location: "New York, NY",
      type: "Full-time",
      salary: "$140k - $180k",
      description: "Lead product strategy and development for our flagship platform...",
      tags: ["Product Strategy", "Agile", "Analytics"],
      posted: "3 days ago"
    },
    {
      title: "UX/UI Designer",
      company: "DesignStudio Pro",
      location: "San Francisco, CA",
      type: "Contract",
      salary: "$80/hour",
      description: "Create beautiful and intuitive user experiences for our clients...",
      tags: ["Figma", "User Research", "Prototyping"],
      posted: "1 week ago"
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
              Job Opportunities
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover your next career opportunity or find the perfect candidate for your team.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  placeholder="Search jobs, companies, or skills..." 
                  className="pl-10 py-3 text-lg"
                />
              </div>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-700">
                Search
              </Button>
            </div>
          </div>

          {/* Job Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {jobStats.map((stat, index) => (
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
            
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Job Type</h4>
                    <div className="space-y-1">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Full-time
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Part-time
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Contract
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Location</h4>
                    <div className="space-y-1">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Remote
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        On-site
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Hybrid
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full mb-4 bg-gradient-to-r from-green-600 to-emerald-700">
                Post a Job
              </Button>
            </div>

            {/* Job Listings */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Latest Opportunities</h2>
                <select className="border border-gray-300 rounded-md px-3 py-2">
                  <option>Sort by: Newest</option>
                  <option>Sort by: Salary</option>
                  <option>Sort by: Company</option>
                </select>
              </div>

              <div className="space-y-6">
                {jobs.map((job, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {job.title}
                          </h3>
                          <p className="text-lg text-blue-600 font-medium">{job.company}</p>
                        </div>
                        <span className="text-sm text-gray-500">{job.posted}</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.type}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salary}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{job.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-2">
                          {job.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline">Discuss</Button>
                          <Button>Apply Now</Button>
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

export default JobOpportunities;
