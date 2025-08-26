import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";

interface CalendarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarOverlay = ({ isOpen, onClose }: CalendarOverlayProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  
  // Mock data for running days - in a real app this would come from your backend
  const runningDays = [
    new Date(2025, 0, 20), // January 20, 2025
    new Date(2025, 0, 18), // January 18, 2025
    new Date(2025, 0, 15), // January 15, 2025
    new Date(2025, 0, 12), // January 12, 2025
    new Date(2025, 0, 10), // January 10, 2025
  ];

  const getDayStats = (date: Date) => {
    // Mock stats for demonstration
    const stats = [
      { distance: "5.2 km", time: "28:15", pace: "5:25/km" },
      { distance: "3.8 km", time: "21:30", pace: "5:39/km" },
      { distance: "7.1 km", time: "42:18", pace: "5:57/km" },
      { distance: "4.5 km", time: "25:45", pace: "5:43/km" },
      { distance: "6.3 km", time: "35:20", pace: "5:36/km" },
    ];
    
    const dayIndex = runningDays.findIndex(runDay => isSameDay(runDay, date));
    return dayIndex !== -1 ? stats[dayIndex] : null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="fixed top-20 left-4 right-4 z-50" onClick={(e) => e.stopPropagation()}>
        <Card className="card-elevated p-6 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Running Calendar</h3>
            <Badge variant="secondary" className="text-xs">
              {runningDays.length} runs this month
            </Badge>
          </div>
          
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md"
            modifiers={{
              running: runningDays
            }}
            modifiersClassNames={{
              running: "bg-primary/20 text-primary font-semibold border border-primary/30"
            }}
          />
          
          {selectedDate && getDayStats(selectedDate) && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium text-foreground mb-2">
                {format(selectedDate, "EEEE, MMMM d")}
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold text-primary">{getDayStats(selectedDate)?.distance}</div>
                  <div className="text-muted-foreground">Distance</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-primary">{getDayStats(selectedDate)?.time}</div>
                  <div className="text-muted-foreground">Time</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-primary">{getDayStats(selectedDate)?.pace}</div>
                  <div className="text-muted-foreground">Pace</div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};