import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, TrendingUp, Star } from "lucide-react";

interface Route {
  id: string;
  name: string;
  distance: string;
  time: string;
  difficulty: "easy" | "medium" | "hard";
  rating: number;
  coordinates: [number, number][];
  description: string;
}

interface RouteMapProps {
  routes: Route[];
  selectedRoute: string | null;
  onRouteSelect: (routeId: string) => void;
  maptilerToken?: string;
}

export const RouteMap = ({ routes, selectedRoute, onRouteSelect, maptilerToken }: RouteMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [showTokenInput, setShowTokenInput] = useState(!maptilerToken);
  const [tokenInput, setTokenInput] = useState("");

  // Mock coordinates for Kathmandu routes
  const mockRoutes: Route[] = [
    {
      id: "1",
      name: "Phewa Lake Circuit",
      distance: "5.2 km",
      time: "35 min",
      difficulty: "easy",
      rating: 4.8,
      coordinates: [[85.3240, 27.7172], [85.3280, 27.7200], [85.3320, 27.7180], [85.3240, 27.7172]],
      description: "Beautiful lake circuit with mountain views"
    },
    {
      id: "2", 
      name: "Sarangkot Trail",
      distance: "8.7 km",
      time: "1h 15min",
      difficulty: "hard",
      rating: 4.9,
      coordinates: [[85.3200, 27.7100], [85.3250, 27.7150], [85.3300, 27.7200], [85.3350, 27.7250]],
      description: "Challenging hill climb with sunrise views"
    },
    {
      id: "3",
      name: "Durbar Square Loop", 
      distance: "3.1 km",
      time: "22 min",
      difficulty: "easy",
      rating: 4.6,
      coordinates: [[85.3080, 27.7040], [85.3120, 27.7060], [85.3100, 27.7080], [85.3080, 27.7040]],
      description: "Historic heritage route through old city"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500/20 text-green-500";
      case "medium": return "bg-yellow-500/20 text-yellow-500";
      case "hard": return "bg-red-500/20 text-red-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleUseToken = () => {
    if (tokenInput.trim()) {
      setShowTokenInput(false);
      // In a real implementation, you would initialize the map here with the token
      initializeMap(tokenInput);
    }
  };

  const initializeMap = (token: string) => {
    // Mock map initialization - in a real app this would use Maptiler GL JS
    console.log("Initializing map with token:", token);
    setMap({ initialized: true });
  };

  if (showTokenInput) {
    return (
      <Card className="card-elevated p-6 text-center">
        <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Maptiler Token Required</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          To display interactive maps, please add your Maptiler API key.
          Get one from <a href="https://maptiler.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">maptiler.com</a>
        </p>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Enter your Maptiler API key"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
          />
          <Button onClick={handleUseToken} className="w-full">
            Initialize Map
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <Card className="card-elevated p-0 overflow-hidden">
        <div 
          ref={mapContainer}
          className="h-64 bg-gradient-to-br from-muted/50 to-muted relative flex items-center justify-center"
        >
          {/* Mock Map UI */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
          <div className="relative z-10 text-center">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Interactive Map View</p>
            <p className="text-xs text-muted-foreground mt-1">
              {mockRoutes.length} routes in Kathmandu area
            </p>
          </div>
          
          {/* Mock route lines */}
          <div className="absolute inset-4">
            <svg className="w-full h-full opacity-60">
              <path
                d="M 20 40 Q 80 20 140 60 Q 200 100 260 80"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
              <path
                d="M 40 80 Q 100 60 160 100 Q 220 140 280 120"
                stroke="hsl(var(--accent))"
                strokeWidth="3"
                fill="none"
                strokeDasharray="3,3"
                className="animate-pulse"
                style={{ animationDelay: "1s" }}
              />
            </svg>
          </div>
        </div>
      </Card>

      {/* Route List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Popular Routes</h3>
          <Badge variant="outline" className="text-xs">
            {mockRoutes.length} routes
          </Badge>
        </div>
        
        {mockRoutes.map((route) => (
          <Card 
            key={route.id}
            className={`card-elevated p-4 cursor-pointer transition-all hover:shadow-lg ${
              selectedRoute === route.id ? 'ring-2 ring-primary/50 bg-primary/5' : ''
            }`}
            onClick={() => onRouteSelect(route.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-foreground mb-1">{route.name}</h4>
                <p className="text-sm text-muted-foreground">{route.description}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs text-muted-foreground">{route.rating}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-foreground">{route.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-foreground">{route.time}</span>
                </div>
              </div>
              
              <Badge className={getDifficultyColor(route.difficulty)}>
                {route.difficulty}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};