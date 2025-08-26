import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPin, Clock, TrendingUp, Star } from "lucide-react";

interface RouteCardProps {
  id: string;
  title: string;
  distance: string;
  duration: string;
  difficulty: "easy" | "medium" | "hard";
  elevation: string;
  rating?: number;
  isHeritage?: boolean;
  imageUrl?: string;
  onSelect: (routeId: string) => void;
  className?: string;
}

export function RouteCard({
  id,
  title,
  distance,
  duration,
  difficulty,
  elevation,
  rating,
  isHeritage = false,
  imageUrl,
  onSelect,
  className
}: RouteCardProps) {
  const difficultyStyles = {
    easy: "bg-nepal-green/20 text-nepal-green border-nepal-green/30",
    medium: "bg-nepal-yellow/20 text-nepal-orange border-nepal-yellow/30",
    hard: "bg-destructive/20 text-destructive border-destructive/30"
  };

  return (
    <div className={cn("card-elevated group cursor-pointer", className)} onClick={() => onSelect(id)}>
      {/* Route Image */}
      {imageUrl && (
        <div className="relative mb-4 -mx-6 -mt-6 h-40 rounded-t-xl overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isHeritage && (
            <div className="absolute top-3 left-3 bg-nepal-purple/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
              🏛️ Heritage Run
            </div>
          )}
          {rating && (
            <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="h-3 w-3 fill-nepal-yellow text-nepal-yellow" />
              <span className="text-xs font-medium">{rating}</span>
            </div>
          )}
        </div>
      )}

      {/* Route Info */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-foreground text-lg leading-tight">
            {title}
          </h3>
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium border",
            difficultyStyles[difficulty]
          )}>
            {difficulty}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">{distance}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">{elevation}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full btn-primary mt-4"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(id);
          }}
        >
          Start Route
        </Button>
      </div>
    </div>
  );
}