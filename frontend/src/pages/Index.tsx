import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MobileHeader } from "@/components/ui/mobile-header";
import { MobileSideNav } from "@/components/ui/mobile-side-nav";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { RouteCard } from "@/components/ui/route-card";
import { CalendarOverlay } from "@/components/ui/calendar-overlay";
import { RouteMap } from "@/components/ui/route-map";
import { DistrictTabs } from "@/components/leaderboard/district-tabs";
import { LiveStats } from "@/components/tracking/live-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Target, 
  Trophy, 
  Clock, 
  TrendingUp, 
  Users,
  Mountain,
  Flag,
  Calendar,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/api";
import heroImage from "@/assets/hero-nepal-trail.jpg";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedDistrict, setSelectedDistrict] = useState("Kathmandu");
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Fetch routes from API
  const { data: routesData, isLoading: routesLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: () => apiClient.getRoutes(),
  });

  // Fetch leaderboard data
  const { data: leaderboardData, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['leaderboard', selectedDistrict],
    queryFn: () => apiClient.getDistrictLeaderboard(selectedDistrict),
  });

  // Fetch user stats
  const { data: userStats, isLoading: userStatsLoading } = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: () => apiClient.getUserStats(user?.id || 0),
    enabled: !!user?.id,
  });

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const handleSideNavClick = () => {
    setIsSideNavOpen(true);
  };

  const handleSideNavClose = () => {
    setIsSideNavOpen(false);
  };

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
  };

  // Available districts
  const districts = ["Kathmandu", "Pokhara", "Chitwan", "Lalitpur", "Solukhumbu", "Kaski", "Rupandehi"];

  // Transform API routes data for the UI
  const routes = routesData?.data?.map((route: any) => ({
    id: route.id.toString(),
    title: route.name,
    distance: `${route.distance} km`,
    duration: route.estimated_time ? `${Math.floor(route.estimated_time / 60)}h ${route.estimated_time % 60}min` : "N/A",
    difficulty: route.difficulty as "easy" | "medium" | "hard" | "expert",
    elevation: `+${route.elevation_gain}m`,
    rating: 4.5, // Mock rating
    isHeritage: route.route_type === "urban" || route.highlights?.includes("UNESCO"),
    imageUrl: heroImage,
    description: route.description,
    district: route.district,
    region: route.region,
  })) || [];

  // Transform leaderboard data for the UI
  const transformedLeaderboardData = {
    [selectedDistrict]: leaderboardData?.data?.map((entry: any) => ({
      id: entry.user_id.toString(),
      name: entry.username,
      district: entry.district,
      totalDistance: parseFloat(entry.total_distance || "0"),
      totalRuns: parseInt(entry.total_runs || "0"),
      averagePace: entry.average_pace ? `${Math.floor(entry.average_pace / 60)}:${(entry.average_pace % 60).toString().padStart(2, '0')}` : "N/A",
      bestTime: entry.best_time,
    })) || []
  };

  const handleRouteSelect = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    console.log("Selected route:", route);
    setActiveTab("track");
  };

  const handleStartRun = () => {
    setIsTracking(true);
    setIsPaused(false);
  };

  const handlePauseRun = () => {
    setIsPaused(!isPaused);
  };

  const handleStopRun = () => {
    setIsTracking(false);
    setIsPaused(false);
    setActiveTab("home");
  };

  const HomeTab = () => (
    <div className="space-y-6 px-4">
      {/* Hero Section */}
      <div className="card-hero relative overflow-hidden rounded-2xl">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative z-10 p-6">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            🇳🇵 Run Nepal
          </Badge>
          <h1 className="text-2xl font-bold mb-3 text-foreground">
            Discover Nepal
            <br />
            <span className="text-primary">One Step at a Time</span>
          </h1>
          <p className="text-muted-foreground mb-6 text-sm">
            Track your runs through the beautiful landscapes of Nepal. From mountain trails to heritage sites.
          </p>
          <div className="flex gap-3">
            <Button className="btn-primary flex-1 btn-mobile">
              <MapPin className="h-4 w-4 mr-2" />
              Find Routes
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsCalendarOpen(true)}
              className="border-primary/30 hover:bg-primary/10 tap-target"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="This Week"
          value="12.4"
          unit="km"
          icon={Target}
          trend="up"
          trendValue="2.1km from last week"
          variant="primary"
        />
        <StatCard
          title="Best Pace"
          value="5:23"
          unit="/km"
          icon={Clock}
          variant="accent"
        />
      </div>

      {/* Suggested Routes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Suggested Routes</h2>
          <Button variant="ghost" size="sm" className="text-sm">View All</Button>
        </div>
        
        <div className="space-y-4">
          {routes.slice(0, 3).map((route) => (
            <RouteCard
              key={route.id}
              {...route}
              onSelect={handleRouteSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const TrackTab = () => (
    <div className="space-y-6 px-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">Explore Routes</h2>
        <p className="text-muted-foreground text-sm">Discover popular running routes in Nepal</p>
      </div>

      <RouteMap
        routes={[]}
        selectedRoute={selectedRoute}
        onRouteSelect={(routeId) => {
          setSelectedRoute(routeId);
          console.log("Selected route:", routeId);
        }}
      />

      {selectedRoute && (
        <div className="space-y-4">
          <div className="border-t border-border pt-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Start Your Run</h3>
            <LiveStats
              isRunning={isTracking}
              isPaused={isPaused}
              onStart={handleStartRun}
              onPause={handlePauseRun}
              onStop={handleStopRun}
              onPhoto={() => console.log("Take photo")}
            />
          </div>
        </div>
      )}
    </div>
  );

  const LeaderboardTab = () => (
    <div className="space-y-6 px-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">District Leaderboards</h2>
        <p className="text-muted-foreground text-sm">See how you rank in your area</p>
      </div>

      <DistrictTabs
        currentDistrict={selectedDistrict}
        districts={districts}
        leaderboardData={transformedLeaderboardData}
        onDistrictChange={setSelectedDistrict}
        isLoading={leaderboardLoading}
      />
    </div>
  );

  const ProfileTab = () => (
    <div className="space-y-6 px-4">
      <div className="card-elevated text-center rounded-2xl p-6">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-xl font-bold text-primary">
            {user?.first_name?.[0]}{user?.last_name?.[0] || user?.username?.[0]?.toUpperCase()}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {user?.first_name && user?.last_name 
            ? `${user.first_name} ${user.last_name}`
            : user?.username
          }
        </h3>
        <p className="text-muted-foreground mb-4 text-sm">{user?.location || "Nepal"}</p>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-xl font-bold text-primary">
              {userStats?.data?.stats?.total_runs || 0}
            </div>
            <div className="text-xs text-muted-foreground">Total Runs</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary">
              {userStats?.data?.stats?.total_distance || 0}
            </div>
            <div className="text-xs text-muted-foreground">Total KM</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary">
              {userStats?.data?.leaderboard?.length || 0}
            </div>
            <div className="text-xs text-muted-foreground">Routes</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          title="Weekly Goal" 
          value="85%" 
          unit="" 
          icon={Flag} 
          variant="primary" 
        />
        <StatCard 
          title="Best Pace" 
          value={userStats?.data?.stats?.fastest_run 
            ? `${Math.floor(userStats.data.stats.fastest_run / 60)}:${(userStats.data.stats.fastest_run % 60).toString().padStart(2, '0')}`
            : "N/A"
          } 
          unit="/km" 
          icon={TrendingUp} 
          variant="accent" 
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        {userStats?.data?.leaderboard?.slice(0, 3).map((entry: any) => (
          <div key={entry.id} className="card-elevated p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-foreground text-sm">{entry.route_name}</h4>
                <p className="text-xs text-muted-foreground">{entry.district}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-primary">
                  {entry.best_time ? `${Math.floor(entry.best_time / 60)}:${(entry.best_time % 60).toString().padStart(2, '0')}` : "N/A"}
                </div>
                <div className="text-xs text-muted-foreground">Best Time</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <CalendarOverlay 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
      />
      
      <MobileSideNav
        isOpen={isSideNavOpen}
        onClose={handleSideNavClose}
        onNavigate={handleNavigation}
        currentTab={activeTab}
      />
      
      <div className="mobile-container">
        <MobileHeader 
          title={
            activeTab === "home" ? "Run Nepal" :
            activeTab === "track" ? "Explore Routes" :
            activeTab === "leaderboard" ? "Leaderboards" :
            "Profile"
          }
          onMenuClick={() => console.log("Menu clicked")}
          onProfileClick={() => setActiveTab("profile")}
          onLogout={handleLogout}
          onSideNavClick={handleSideNavClick}
        />

        <main className="pt-6 pb-24">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Tab Content */}
            <TabsContent value="home" className="mt-0">
              <HomeTab />
            </TabsContent>
            
            <TabsContent value="track" className="mt-0">
              <TrackTab />
            </TabsContent>
            
            <TabsContent value="leaderboard" className="mt-0">
              <LeaderboardTab />
            </TabsContent>
            
            <TabsContent value="profile" className="mt-0">
              <ProfileTab />
            </TabsContent>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border mobile-nav">
              <TabsList className="grid w-full grid-cols-4 h-16 bg-transparent">
                <TabsTrigger 
                  value="home" 
                  className="flex-col gap-1 h-full data-[state=active]:bg-primary/10 tap-target"
                >
                  <Mountain className="h-5 w-5" />
                  <span className="text-xs font-medium">Home</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="track"
                  className="flex-col gap-1 h-full data-[state=active]:bg-primary/10 tap-target"
                >
                  <Target className="h-5 w-5" />
                  <span className="text-xs font-medium">Track</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="leaderboard"
                  className="flex-col gap-1 h-full data-[state=active]:bg-primary/10 tap-target"
                >
                  <Trophy className="h-5 w-5" />
                  <span className="text-xs font-medium">Rankings</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="profile"
                  className="flex-col gap-1 h-full data-[state=active]:bg-primary/10 tap-target"
                >
                  <Users className="h-5 w-5" />
                  <span className="text-xs font-medium">Profile</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;
