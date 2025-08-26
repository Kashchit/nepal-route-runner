import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Medal, Award, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  id: string;
  name: string;
  district: string;
  totalDistance: number;
  totalRuns: number;
  averagePace: string;
  avatar?: string;
}

interface DistrictTabsProps {
  currentDistrict: string;
  districts: string[];
  leaderboardData: Record<string, LeaderboardEntry[]>;
  onDistrictChange: (district: string) => void;
  isLoading?: boolean;
}

export function DistrictTabs({ 
  currentDistrict, 
  districts, 
  leaderboardData, 
  onDistrictChange,
  isLoading = false
}: DistrictTabsProps) {
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-nepal-yellow" />;
      case 2:
        return <Medal className="h-5 w-5 text-muted-foreground" />;
      case 3:
        return <Award className="h-5 w-5 text-nepal-orange" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{position}</span>;
    }
  };

  const LeaderboardList = ({ entries }: { entries: LeaderboardEntry[] }) => (
    <ScrollArea className="h-[500px] w-full mobile-scroll">
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        </div>
      ) : entries.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <Trophy className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No data available</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 p-1">
          {entries.map((entry, index) => (
          <div
            key={entry.id}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
              index === 0 && "bg-gradient-to-r from-nepal-yellow/10 to-primary/10 border-primary/20",
              index === 1 && "bg-muted/50 border-border",
              index === 2 && "bg-nepal-orange/10 border-nepal-orange/20",
              index > 2 && "bg-card border-border hover:bg-muted/30"
            )}
          >
            {/* Rank */}
            <div className="flex items-center justify-center w-10 h-10">
              {getRankIcon(index + 1)}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {entry.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium text-foreground truncate">
                  {entry.name}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {entry.district} • {entry.totalRuns} runs
              </div>
            </div>

            {/* Stats */}
            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                {entry.totalDistance.toFixed(1)}km
              </div>
              <div className="text-xs text-muted-foreground">
                {entry.averagePace} avg
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </ScrollArea>
  );

  return (
    <Tabs value={currentDistrict} onValueChange={onDistrictChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        {districts.slice(0, 3).map((district) => (
          <TabsTrigger 
            key={district} 
            value={district}
            className="text-xs tap-target"
          >
            {district}
          </TabsTrigger>
        ))}
      </TabsList>

      {districts.map((district) => (
        <TabsContent key={district} value={district} className="mt-0">
          <LeaderboardList entries={leaderboardData[district] || []} />
        </TabsContent>
      ))}
    </Tabs>
  );
}