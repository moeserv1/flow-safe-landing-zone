
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Users, Briefcase, BookOpen, Info, LogOut, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md fixed w-full top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2.5 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              LifeFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button 
                variant={isActive('/') ? "default" : "ghost"} 
                className="flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Community</span>
              </Button>
            </Link>
            <Link to="/jobs">
              <Button 
                variant={isActive('/jobs') ? "default" : "ghost"} 
                className="flex items-center space-x-2"
              >
                <Briefcase className="h-4 w-4" />
                <span>Job Opportunities</span>
              </Button>
            </Link>
            <Link to="/blog">
              <Button 
                variant={isActive('/blog') ? "default" : "ghost"} 
                className="flex items-center space-x-2"
              >
                <BookOpen className="h-4 w-4" />
                <span>Blog</span>
              </Button>
            </Link>
            <Link to="/about">
              <Button 
                variant={isActive('/about') ? "default" : "ghost"} 
                className="flex items-center space-x-2"
              >
                <Info className="h-4 w-4" />
                <span>About</span>
              </Button>
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem className="flex flex-col items-start">
                    <div className="font-medium">{user.user_metadata?.full_name || 'User'}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="ml-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
                  Join Platform
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-fade-in bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block">
                <Button variant={isActive('/') ? "default" : "ghost"} className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Community
                </Button>
              </Link>
              <Link to="/jobs" className="block">
                <Button variant={isActive('/jobs') ? "default" : "ghost"} className="w-full justify-start">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Job Opportunities
                </Button>
              </Link>
              <Link to="/blog" className="block">
                <Button variant={isActive('/blog') ? "default" : "ghost"} className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Blog
                </Button>
              </Link>
              <Link to="/about" className="block">
                <Button variant={isActive('/about') ? "default" : "ghost"} className="w-full justify-start">
                  <Info className="h-4 w-4 mr-2" />
                  About
                </Button>
              </Link>
              <div className="px-3 py-2">
                {user ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      {user.user_metadata?.full_name || user.email}
                    </div>
                    <Button 
                      onClick={handleSignOut}
                      variant="outline" 
                      className="w-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700">
                      Join Platform
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
