import { Button } from "@/components/ui/button";
import { Menu, Bell, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  onMenuClick?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  onSideNavClick?: () => void;
  className?: string;
}

export function MobileHeader({ 
  title, 
  showBack = false, 
  onMenuClick, 
  onProfileClick,
  onLogout,
  onSideNavClick,
  className 
}: MobileHeaderProps) {
  return (
    <header className={cn(
      "flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50",
      className
    )}>
      <div className="flex items-center gap-3">
        {showBack ? (
          <Button variant="ghost" size="sm" className="tap-target" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="tap-target" onClick={onSideNavClick}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        {title && (
          <h1 className="text-lg font-semibold text-foreground truncate">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="tap-target relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-card" />
        </Button>
        
        <Button variant="ghost" size="sm" className="tap-target" onClick={onProfileClick}>
          <User className="h-5 w-5" />
        </Button>

        {onLogout && (
          <Button variant="ghost" size="sm" className="tap-target" onClick={onLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}