
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, CheckCircle, XCircle, Clock, Users, Eye, Lock } from 'lucide-react';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'creator' | 'user';
  approved: boolean;
  approved_by?: string;
  created_at: string;
}

interface AccessRequest {
  id: string;
  user_id: string;
  requested_role: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  profiles?: {
    full_name: string;
    username: string;
    avatar_url: string;
  };
}

const UserAccessControl = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string>('user');
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserRole();
      fetchAccessRequests();
    }
  }, [user]);

  const fetchUserRole = async () => {
    try {
      // Mock role check - in real app this would check user_roles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      // Mock admin check for demo
      if (data?.username === 'admin' || data?.full_name?.toLowerCase().includes('admin')) {
        setUserRole('admin');
      } else {
        setUserRole('user');
      }
    } catch (error: any) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchAccessRequests = async () => {
    // Mock data for access requests
    const mockRequests: AccessRequest[] = [
      {
        id: '1',
        user_id: 'user1',
        requested_role: 'creator',
        reason: 'I want to start creating content and monetize my videos',
        status: 'pending',
        created_at: new Date().toISOString(),
        profiles: {
          full_name: 'John Creator',
          username: 'johncreator',
          avatar_url: ''
        }
      },
      {
        id: '2',
        user_id: 'user2',
        requested_role: 'moderator',
        reason: 'I have experience moderating communities and want to help',
        status: 'pending',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        profiles: {
          full_name: 'Jane Mod',
          username: 'janemod',
          avatar_url: ''
        }
      }
    ];

    setAccessRequests(mockRequests);
    setPendingRequests(mockRequests.filter(req => req.status === 'pending'));
  };

  const handleAccessRequest = async (requestId: string, action: 'approve' | 'reject') => {
    setLoading(true);
    try {
      // Mock approval/rejection
      const updatedRequests = accessRequests.map(req => 
        req.id === requestId 
          ? { ...req, status: action === 'approve' ? 'approved' as const : 'rejected' as const }
          : req
      );
      
      setAccessRequests(updatedRequests);
      setPendingRequests(updatedRequests.filter(req => req.status === 'pending'));

      toast({
        title: action === 'approve' ? 'Request Approved' : 'Request Rejected',
        description: `User access request has been ${action}d successfully`
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

  const requestRoleUpgrade = async (role: string, reason: string) => {
    try {
      // Mock role upgrade request
      toast({
        title: 'Request Submitted',
        description: 'Your role upgrade request has been submitted for review'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-600">Please sign in to access user controls</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Access Control & User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <span>Current Role:</span>
            <Badge variant={userRole === 'admin' ? 'default' : 'secondary'}>
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </Badge>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              {userRole === 'admin' && <TabsTrigger value="requests">Pending Requests</TabsTrigger>}
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm font-medium">Total Users</p>
                    <p className="text-2xl font-bold">1,234</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-sm font-medium">Approved</p>
                    <p className="text-2xl font-bold">987</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-sm font-medium">Pending</p>
                    <p className="text-2xl font-bold">{pendingRequests.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <XCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                    <p className="text-sm font-medium">Rejected</p>
                    <p className="text-2xl font-bold">23</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Role Permissions</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">View Content</p>
                        <p className="text-sm text-gray-600">Access to view posts and media</p>
                      </div>
                    </div>
                    <Badge variant="outline">All Users</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Create Posts</p>
                        <p className="text-sm text-gray-600">Create and share content</p>
                      </div>
                    </div>
                    <Badge variant={userRole !== 'user' ? 'default' : 'secondary'}>
                      {userRole !== 'user' ? 'Granted' : 'Requires Approval'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Moderate Content</p>
                        <p className="text-sm text-gray-600">Moderate posts and users</p>
                      </div>
                    </div>
                    <Badge variant={userRole === 'admin' || userRole === 'moderator' ? 'default' : 'secondary'}>
                      {userRole === 'admin' || userRole === 'moderator' ? 'Granted' : 'Admin/Mod Only'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium">Admin Access</p>
                        <p className="text-sm text-gray-600">Full system administration</p>
                      </div>
                    </div>
                    <Badge variant={userRole === 'admin' ? 'default' : 'secondary'}>
                      {userRole === 'admin' ? 'Granted' : 'Admin Only'}
                    </Badge>
                  </div>
                </div>

                {userRole === 'user' && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Request Role Upgrade</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Want to become a creator or moderator? Submit a request for review.
                    </p>
                    <Button 
                      onClick={() => requestRoleUpgrade('creator', 'I want to create content')}
                      size="sm"
                    >
                      Request Creator Access
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {userRole === 'admin' && (
              <TabsContent value="requests" className="space-y-4">
                <h3 className="text-lg font-semibold">Pending Access Requests</h3>
                
                {pendingRequests.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-600">No pending requests</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <Card key={request.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <Users className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="font-medium">{request.profiles?.full_name}</p>
                                  <p className="text-sm text-gray-600">@{request.profiles?.username}</p>
                                </div>
                                <Badge variant="outline">{request.requested_role}</Badge>
                              </div>
                              <p className="text-sm text-gray-700 mb-3">{request.reason}</p>
                              <p className="text-xs text-gray-500">
                                Requested {new Date(request.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                size="sm"
                                onClick={() => handleAccessRequest(request.id, 'approve')}
                                disabled={loading}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAccessRequest(request.id, 'reject')}
                                disabled={loading}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAccessControl;
