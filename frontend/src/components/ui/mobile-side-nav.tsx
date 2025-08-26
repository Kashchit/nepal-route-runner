import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  Home, 
  MapPin, 
  Trophy, 
  User, 
  Settings, 
  LogOut, 
  Mountain,
  Target,
  Calendar,
  Bell,
  Heart,
  Star,
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MobileSideNavProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  currentTab: string;
}

export const MobileSideNav: React.FC<MobileSideNavProps> = ({
  isOpen,
  onClose,
  onNavigate,
  currentTab
}) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    onClose();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const handleNavigation = (tab: string) => {
    onNavigate(tab);
    onClose();
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, badge: null },
    { id: 'track', label: 'Track Routes', icon: MapPin, badge: null },
    { id: 'leaderboard', label: 'Leaderboards', icon: Trophy, badge: 'Hot' },
    { id: 'profile', label: 'Profile', icon: User, badge: null },
  ];

  const quickActions = [
    { id: 'calendar', label: 'Schedule Run', icon: Calendar, badge: null },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3' },
    { id: 'favorites', label: 'Favorite Routes', icon: Heart, badge: null },
    { id: 'achievements', label: 'Achievements', icon: Award, badge: '5' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0 bg-background border-r">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Mountain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Run Nepal</h2>
                  <p className="text-xs text-muted-foreground">Discover Nepal</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.profile_picture} />
                <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                  {user?.first_name?.[0]}{user?.last_name?.[0] || user?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : user?.username
                  }
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.location || "Nepal"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Navigation</h3>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={currentTab === item.id ? "secondary" : "ghost"}
                    className="w-full justify-start h-12 px-4"
                    onClick={() => handleNavigation(item.id)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
              </nav>
            </div>

            <Separator />

            <div className="p-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Quick Actions</h3>
              <nav className="space-y-1">
                {quickActions.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-start h-12 px-4"
                    onClick={() => handleNavigation(item.id)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
              </nav>
            </div>

            <Separator />

            <div className="p-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Account</h3>
              <nav className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 px-4"
                  onClick={() => handleNavigation('settings')}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  <span className="flex-1 text-left">Settings</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 px-4 text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span className="flex-1 text-left">Logout</span>
                </Button>
              </nav>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Run Nepal v1.0.0
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                🇳🇵 Made for Nepal
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
