
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Download,
  Eye,
  Star,
  Calendar
} from 'lucide-react';

interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  cover_letter: string;
  resume_url: string;
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  applied_at: string;
  notes?: string;
  job_title?: string;
  company_name?: string;
}

const JobApplicationSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('my-applications');

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = () => {
    // Mock application data
    const mockApplications: JobApplication[] = [
      {
        id: '1',
        job_id: 'job1',
        applicant_id: user?.id || '',
        cover_letter: 'I am very interested in this position...',
        resume_url: '/mock-resume.pdf',
        status: 'pending',
        applied_at: new Date().toISOString(),
        job_title: 'Senior Software Engineer',
        company_name: 'TechCorp Inc.'
      },
      {
        id: '2',
        job_id: 'job2',
        applicant_id: user?.id || '',
        cover_letter: 'My design experience makes me perfect...',
        resume_url: '/mock-resume.pdf',
        status: 'interview',
        applied_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        job_title: 'Product Designer',
        company_name: 'Design Studio'
      },
      {
        id: '3',
        job_id: 'job3',
        applicant_id: user?.id || '',
        cover_letter: 'I have strong analytical skills...',
        resume_url: '/mock-resume.pdf',
        status: 'accepted',
        applied_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        job_title: 'Data Analyst',
        company_name: 'Analytics Co.'
      }
    ];

    setApplications(mockApplications);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'reviewing':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'interview':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'interview':
        return 'bg-purple-100 text-purple-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const withdrawApplication = async (applicationId: string) => {
    try {
      setLoading(true);
      // Mock withdrawal
      setApplications(prev => prev.filter(app => app.id !== applicationId));
      toast({
        title: 'Application Withdrawn',
        description: 'Your application has been withdrawn successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-600">Please sign in to view your job applications</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Job Application Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="my-applications">My Applications</TabsTrigger>
              <TabsTrigger value="application-history">History</TabsTrigger>
              <TabsTrigger value="interview-schedule">Interviews</TabsTrigger>
            </TabsList>

            <TabsContent value="my-applications" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Active Applications</h3>
                <Badge variant="outline">{applications.filter(app => ['pending', 'reviewing', 'interview'].includes(app.status)).length} Active</Badge>
              </div>

              {applications.filter(app => ['pending', 'reviewing', 'interview'].includes(app.status)).length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No active applications</p>
                    <p className="text-sm text-gray-500 mt-2">Start applying to jobs to see them here</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {applications.filter(app => ['pending', 'reviewing', 'interview'].includes(app.status)).map((application) => (
                    <Card key={application.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold">{application.job_title}</h4>
                              <Badge className={getStatusColor(application.status)}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(application.status)}
                                  {application.status}
                                </div>
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{application.company_name}</p>
                            <p className="text-sm text-gray-500 mb-4">
                              Applied {new Date(application.applied_at).toLocaleDateString()}
                            </p>
                            
                            <div className="bg-gray-50 p-3 rounded-lg mb-4">
                              <p className="text-sm font-medium mb-1">Cover Letter:</p>
                              <p className="text-sm text-gray-700">{application.cover_letter}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-6">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Resume
                            </Button>
                            {application.status === 'pending' && (
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => withdrawApplication(application.id)}
                                disabled={loading}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Withdraw
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="application-history" className="space-y-4">
              <h3 className="text-lg font-semibold">Application History</h3>
              
              <div className="space-y-4">
                {applications.map((application) => (
                  <Card key={application.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{application.job_title}</h4>
                          <p className="text-sm text-gray-600">{application.company_name}</p>
                          <p className="text-xs text-gray-500">
                            Applied {new Date(application.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(application.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(application.status)}
                            {application.status}
                          </div>
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="interview-schedule" className="space-y-4">
              <h3 className="text-lg font-semibold">Upcoming Interviews</h3>
              
              {applications.filter(app => app.status === 'interview').length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No upcoming interviews</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {applications.filter(app => app.status === 'interview').map((application) => (
                    <Card key={application.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold mb-2">{application.job_title}</h4>
                            <p className="text-gray-600 mb-2">{application.company_name}</p>
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm font-medium text-blue-800">Interview Scheduled</p>
                              <p className="text-sm text-blue-600">Please check your email for interview details</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-6">
                            <Button size="sm">
                              <Calendar className="w-4 h-4 mr-2" />
                              Add to Calendar
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              Prep Materials
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobApplicationSystem;
