
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Clock,
  Users,
  Building,
  DollarSign,
  Search,
  Filter,
  BookOpen,
  Video,
  MessageCircle,
  Star,
  Download,
  Send
} from 'lucide-react';

const JobFestival = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobListings, setJobListings] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    type: '',
    experience: ''
  });

  useEffect(() => {
    generateMockData();
  }, []);

  const generateMockData = () => {
    // Mock job listings
    const mockJobs = [
      {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        type: 'Full-time',
        experience: 'Senior',
        salary: '$120k - $180k',
        description: 'Join our innovative team building next-generation software solutions.',
        requirements: ['5+ years experience', 'React, Node.js', 'Team leadership'],
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        title: 'Product Designer',
        company: 'Design Studio',
        location: 'Remote',
        type: 'Full-time',
        experience: 'Mid-level',
        salary: '$80k - $120k',
        description: 'Create beautiful and functional user experiences.',
        requirements: ['3+ years design experience', 'Figma, Sketch', 'UX/UI expertise'],
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        title: 'Data Analyst',
        company: 'Analytics Co.',
        location: 'New York, NY',
        type: 'Contract',
        experience: 'Junior',
        salary: '$60k - $90k',
        description: 'Help drive data-driven decisions across the organization.',
        requirements: ['SQL, Python', 'Statistics background', '1+ years experience'],
        postedAt: new Date().toISOString()
      }
    ];

    // Mock companies
    const mockCompanies = [
      {
        id: '1',
        name: 'TechCorp Inc.',
        logo: '',
        description: 'Leading technology company focused on innovation.',
        openPositions: 15,
        employees: '1000-5000',
        industry: 'Technology'
      },
      {
        id: '2',
        name: 'Design Studio',
        logo: '',
        description: 'Creative design agency working with top brands.',
        openPositions: 8,
        employees: '50-200',
        industry: 'Design'
      }
    ];

    // Mock events
    const mockEvents = [
      {
        id: '1',
        title: 'Tech Career Fair Keynote',
        type: 'keynote',
        time: '10:00 AM',
        duration: '1 hour',
        speaker: 'Jane Smith, CTO at TechCorp',
        description: 'Future of technology careers and emerging trends.'
      },
      {
        id: '2',
        title: 'Resume Building Workshop',
        type: 'workshop',
        time: '2:00 PM',
        duration: '2 hours',
        speaker: 'Career Experts Panel',
        description: 'Learn to create compelling resumes that get noticed.'
      },
      {
        id: '3',
        title: 'Networking Mixer',
        type: 'networking',
        time: '6:00 PM',
        duration: '2 hours',
        speaker: 'All Attendees',
        description: 'Connect with fellow professionals and potential employers.'
      }
    ];

    setJobListings(mockJobs);
    setCompanies(mockCompanies);
    setEvents(mockEvents);
  };

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = !selectedFilters.location || 
                           job.location.toLowerCase().includes(selectedFilters.location.toLowerCase());
    
    const matchesType = !selectedFilters.type || job.type === selectedFilters.type;
    
    const matchesExperience = !selectedFilters.experience || job.experience === selectedFilters.experience;

    return matchesSearch && matchesLocation && matchesType && matchesExperience;
  });

  const handleApplyToJob = (jobId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to apply for jobs",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Application submitted!",
      description: "Your application has been sent to the employer"
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Virtual Job Festival</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Connect with top employers, attend live sessions, and find your next career opportunity
        </p>
      </div>

      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="jobs">Job Listings</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="networking">Networking</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Input
                  placeholder="Location"
                  value={selectedFilters.location}
                  onChange={(e) => setSelectedFilters({...selectedFilters, location: e.target.value})}
                />
                <select 
                  className="border rounded-md px-3 py-2"
                  value={selectedFilters.type}
                  onChange={(e) => setSelectedFilters({...selectedFilters, type: e.target.value})}
                >
                  <option value="">Job Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
                <select 
                  className="border rounded-md px-3 py-2"
                  value={selectedFilters.experience}
                  onChange={(e) => setSelectedFilters({...selectedFilters, experience: e.target.value})}
                >
                  <option value="">Experience Level</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid-level">Mid-level</option>
                  <option value="Senior">Senior</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Job Listings */}
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{job.description}</p>
                      <div className="flex gap-2 mb-4">
                        <Badge variant="secondary">{job.type}</Badge>
                        <Badge variant="outline">{job.experience}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-6">
                      <Button onClick={() => handleApplyToJob(job.id)}>
                        <Send className="w-4 h-4 mr-2" />
                        Apply Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <Star className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Requirements:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {job.requirements.map((req: string, index: number) => (
                        <li key={index}>• {req}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="companies" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Card key={company.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{company.name}</h3>
                      <p className="text-sm text-gray-600">{company.industry}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{company.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Open Positions:</span>
                      <span className="font-medium">{company.openPositions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Company Size:</span>
                      <span className="font-medium">{company.employees}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">View Jobs</Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={
                          event.type === 'keynote' ? 'default' :
                          event.type === 'workshop' ? 'secondary' : 'outline'
                        }>
                          {event.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{event.time} • {event.duration}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-2">Speaker: {event.speaker}</p>
                      <p className="text-gray-700">{event.description}</p>
                    </div>
                    <div className="flex flex-col gap-2 ml-6">
                      <Button>
                        <Video className="w-4 h-4 mr-2" />
                        Join Live
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Add to Calendar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Resume Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Professional resume templates to help you stand out
                </p>
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Templates
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Interview Prep
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Video guides and practice sessions for interview success
                </p>
                <Button className="w-full">
                  <Video className="w-4 h-4 mr-2" />
                  Watch Videos
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Career Coaching
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  One-on-one sessions with career experts
                </p>
                <Button className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="networking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Networking Lounge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Connect with other professionals and potential employers in real-time
                </p>
                <Button className="w-full mb-4">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Join Chat Room
                </Button>
                <div className="text-sm text-gray-600">
                  <p>🟢 125 people currently online</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule 1-on-1 Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Book private conversations with recruiters and industry professionals
                </p>
                <Button className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Available Slots
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobFestival;
