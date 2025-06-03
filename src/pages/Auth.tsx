
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Shield, Eye, Heart } from "lucide-react";
import { Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Auth = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedCommunity, setAcceptedCommunity] = useState(false);
  const [acceptedAge, setAcceptedAge] = useState(false);

  // Sign In form
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up form
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn(signInEmail, signInPassword);
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedTerms || !acceptedPrivacy || !acceptedCommunity || !acceptedAge) {
      alert("Please accept all terms and conditions to continue.");
      return;
    }

    // Validate age (must be 16+)
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    
    if (calculatedAge < 16) {
      alert("You must be at least 16 years old to register.");
      return;
    }

    setIsLoading(true);
    await signUp(signUpEmail, signUpPassword, {
      firstName,
      lastName,
      gender,
      dateOfBirth
    });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-3 rounded-full">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to LifeFlow</h1>
            <p className="text-gray-600">Connect, Share, and Grow with Our Community</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Join Our Platform</CardTitle>
              <CardDescription className="text-center">
                A social media and community platform where hearts connect
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={gender} onValueChange={setGender} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="terms" 
                          checked={acceptedTerms}
                          onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                        />
                        <Label htmlFor="terms" className="text-xs leading-relaxed">
                          I accept the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
                        </Label>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="privacy" 
                          checked={acceptedPrivacy}
                          onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)}
                        />
                        <Label htmlFor="privacy" className="text-xs leading-relaxed">
                          I accept the <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                        </Label>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="community" 
                          checked={acceptedCommunity}
                          onCheckedChange={(checked) => setAcceptedCommunity(checked === true)}
                        />
                        <Label htmlFor="community" className="text-xs leading-relaxed">
                          I accept the <a href="/community-guidelines" className="text-blue-600 hover:underline">Community Guidelines</a>
                        </Label>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="age" 
                          checked={acceptedAge}
                          onCheckedChange={(checked) => setAcceptedAge(checked === true)}
                        />
                        <Label htmlFor="age" className="text-xs leading-relaxed">
                          I confirm I am 16 years or older
                        </Label>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
              <div className="flex flex-col items-center">
                <Shield className="h-6 w-6 mb-1 text-blue-600" />
                <span>Secure & Private</span>
              </div>
              <div className="flex flex-col items-center">
                <Eye className="h-6 w-6 mb-1 text-blue-600" />
                <span>Legal Compliance</span>
              </div>
              <div className="flex flex-col items-center">
                <Heart className="h-6 w-6 mb-1 text-blue-600" />
                <span>Community Focused</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Auth;
