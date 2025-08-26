import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Play, Pause, Square, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveStatsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onPhoto?: () => void;
  className?: string;
}

export function LiveStats({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onStop,
  onPhoto,
  className
}: LiveStatsProps) {
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [pace, setPace] = useState("0:00");
  const [calories, setCalories] = useState(0);

  // Simulate real-time updates when running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
        // Simulate distance increase (roughly 5-6 km/h pace)
        setDistance(prev => prev + (Math.random() * 0.003 + 0.002));
        // Calculate pace
        const currentPace = duration > 0 ? (duration / 60) / (distance || 0.1) : 0;
        const minutes = Math.floor(currentPace);
        const seconds = Math.floor((currentPace - minutes) * 60);
        setPace(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        // Estimate calories (rough calculation)
        setCalories(Math.floor(distance * 60)); // ~60 cal/km
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, duration, distance]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Time Display - Large and prominent */}
      <div className="text-center">
        <div className="text-6xl font-bold text-primary mb-2 tracking-tight">
          {formatTime(duration)}
        </div>
        <p className="text-muted-foreground">
          {isRunning ? (isPaused ? "Paused" : "Running") : "Ready to start"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Distance"
          value={distance.toFixed(2)}
          unit="km"
          variant="primary"
        />
        <StatCard
          title="Avg Pace"
          value={pace}
          unit="/km"
          variant="accent"
        />
        <StatCard
          title="Calories"
          value={calories}
          unit="kcal"
        />
        <StatCard
          title="Elevation"
          value="0"
          unit="m"
        />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-4 pt-4">
        {!isRunning ? (
          <Button
            size="lg"
            className="btn-primary h-16 w-16 rounded-full"
            onClick={onStart}
          >
            <Play className="h-6 w-6" />
          </Button>
        ) : (
          <>
            <Button
              variant="secondary"
              size="lg"
              className="h-12 w-12 rounded-full"
              onClick={isPaused ? onStart : onPause}
            >
              {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="destructive"
              size="lg"
              className="h-12 w-12 rounded-full"
              onClick={onStop}
            >
              <Square className="h-5 w-5" />
            </Button>
            
            {onPhoto && (
              <Button
                variant="outline"
                size="lg"
                className="h-12 w-12 rounded-full"
                onClick={onPhoto}
              >
                <Camera className="h-5 w-5" />
              </Button>
            )}
          </>
        )}
      </div>

      {/* Current Status */}
      <div className="text-center text-sm text-muted-foreground">
        {isRunning && !isPaused && "Tap pause to take a break"}
        {isRunning && isPaused && "Tap play to continue your run"}
        {!isRunning && "Tap play when you're ready to start"}
      </div>
    </div>
  );
}