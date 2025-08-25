import { useState } from "react";
import { MobileHeader } from "@/components/ui/mobile-header";
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
  Calendar
} from "lucide-react";
import heroImage from "@/assets/hero-nepal-trail.jpg";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedDistrict, setSelectedDistrict] = useState("Kathmandu");
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  // Mock data for districts and leaderboards
  const districts = ["Kathmandu", "Pokhara", "Chitwan", "Lalitpur"];
  
  const leaderboardData = {
    "Kathmandu": [
      { id: "1", name: "Ramesh Shrestha", district: "Kathmandu", totalDistance: 127.5, totalRuns: 45, averagePace: "5:30" },
      { id: "2", name: "Sita Tamang", district: "Kathmandu", totalDistance: 98.2, totalRuns: 38, averagePace: "6:15" },
      { id: "3", name: "Kiran Maharjan", district: "Kathmandu", totalDistance: 89.7, totalRuns: 32, averagePace: "5:45" },
    ],
    "Pokhara": [
      { id: "4", name: "Bikash Gurung", district: "Pokhara", totalDistance: 156.3, totalRuns: 52, averagePace: "5:20" },
      { id: "5", name: "Maya Thapa", district: "Pokhara", totalDistance: 134.8, totalRuns: 48, averagePace: "5:55" },
    ],
    "Chitwan": [
      { id: "6", name: "Suresh Chaudhary", district: "Chitwan", totalDistance: 92.1, totalRuns: 29, averagePace: "6:10" },
    ],
    "Lalitpur": [
      { id: "7", name: "Anita Shakya", district: "Lalitpur", totalDistance: 78.5, totalRuns: 25, averagePace: "6:25" },
    ]
  };

  const routes = [
    {
      id: "1",
      title: "Phewa Lake Circuit",
      distance: "5.2 km",
      duration: "35 min",
      difficulty: "easy" as const,
      elevation: "+45m",
      rating: 4.8,
      isHeritage: true,
      imageUrl: heroImage
    },
    {
      id: "2", 
      title: "Sarangkot Sunrise Trail",
      distance: "8.7 km",
      duration: "1h 15min", 
      difficulty: "hard" as const,
      elevation: "+380m",
      rating: 4.9,
      imageUrl: heroImage
    },
    {
      id: "3",
      title: "Durbar Square Loop",
      distance: "3.1 km", 
      duration: "22 min",
      difficulty: "easy" as const,
      elevation: "+12m",
      rating: 4.6,
      isHeritage: true,
      imageUrl: heroImage
    }
  ];

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
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="card-hero relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative z-10">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            🇳🇵 Run Nepal
          </Badge>
          <h1 className="text-3xl font-bold mb-3 text-foreground">
            Discover Nepal
            <br />
            <span className="text-primary">One Step at a Time</span>
          </h1>
          <p className="text-muted-foreground mb-6">
            Track your runs through the beautiful landscapes of Nepal. From mountain trails to heritage sites.
          </p>
          <div className="flex gap-3">
            <Button className="btn-primary flex-1">
              <MapPin className="h-4 w-4 mr-2" />
              Find Routes Near Me
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsCalendarOpen(true)}
              className="border-primary/30 hover:bg-primary/10"
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
          <h2 className="text-xl font-semibold text-foreground">Suggested Routes</h2>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        
        <div className="space-y-4">
          {routes.map((route) => (
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
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Explore Routes</h2>
        <p className="text-muted-foreground">Discover popular running routes in Nepal</p>
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
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">District Leaderboards</h2>
        <p className="text-muted-foreground">See how you rank in your area</p>
      </div>

      <DistrictTabs
        currentDistrict={selectedDistrict}
        districts={districts}
        leaderboardData={leaderboardData}
        onDistrictChange={setSelectedDistrict}
      />
    </div>
  );

  const ProfileTab = () => (
    <div className="space-y-6">
      <div className="card-elevated text-center">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold text-primary">RS</span>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-1">Ramesh Shrestha</h3>
        <p className="text-muted-foreground mb-4">Kathmandu, Nepal</p>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">45</div>
            <div className="text-xs text-muted-foreground">Total Runs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">127</div>
            <div className="text-xs text-muted-foreground">Total KM</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">8</div>
            <div className="text-xs text-muted-foreground">Badges</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Weekly Goal" value="85%" unit="" icon={Flag} variant="primary" />
        <StatCard title="Streak" value="12" unit="days" icon={TrendingUp} variant="accent" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <CalendarOverlay 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
      />
      
      <div className="mobile-container pb-20">
        <MobileHeader 
          title={
            activeTab === "home" ? "Run Nepal" :
            activeTab === "track" ? "Explore Routes" :
            activeTab === "leaderboard" ? "Leaderboards" :
            "Profile"
          }
          onMenuClick={() => console.log("Menu clicked")}
          onProfileClick={() => setActiveTab("profile")}
        />

        <main className="pt-6">
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
            <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border">
              <TabsList className="grid w-full grid-cols-4 h-16 bg-transparent">
                <TabsTrigger 
                  value="home" 
                  className="flex-col gap-1 h-full data-[state=active]:bg-primary/10"
                >
                  <Mountain className="h-4 w-4" />
                  <span className="text-xs">Home</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="track"
                  className="flex-col gap-1 h-full data-[state=active]:bg-primary/10"
                >
                  <Target className="h-4 w-4" />
                  <span className="text-xs">Track</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="leaderboard"
                  className="flex-col gap-1 h-full data-[state=active]:bg-primary/10"
                >
                  <Trophy className="h-4 w-4" />
                  <span className="text-xs">Rankings</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="profile"
                  className="flex-col gap-1 h-full data-[state=active]:bg-primary/10"
                >
                  <Users className="h-4 w-4" />
                  <span className="text-xs">Profile</span>
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
