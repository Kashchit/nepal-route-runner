import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Badge } from '@/components/ui/badge';
import { Mountain } from 'lucide-react';
import heroImage from '@/assets/hero-nepal-trail.jpg';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-background mobile-container">
      {/* Mobile Hero Background */}
      <div className="absolute inset-0 lg:hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left side - Hero */}
        <div className="lg:w-1/2 relative">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImage})`,
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex flex-col justify-center p-12 text-white">
            <div className="mb-8">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                🇳🇵 Run Nepal
              </Badge>
              <h1 className="text-4xl font-bold mb-4">
                Discover Nepal
                <br />
                <span className="text-primary">One Step at a Time</span>
              </h1>
              <p className="text-lg text-gray-200">
                Track your runs through the beautiful landscapes of Nepal. 
                From mountain trails to heritage sites, every step tells a story.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mountain className="h-6 w-6 text-primary" />
                <span>Explore 16+ curated routes</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mountain className="h-6 w-6 text-primary" />
                <span>Join district leaderboards</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mountain className="h-6 w-6 text-primary" />
                <span>Track your progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Auth Form */}
            {isLogin ? (
              <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col min-h-screen">
        {/* Mobile Hero */}
        <div className="text-center pt-8 pb-6 px-4 relative z-10">
          <Badge className="mb-3 bg-primary/20 text-primary border-primary/30">
            🇳🇵 Run Nepal
          </Badge>
          <h1 className="text-2xl font-bold mb-2">
            Discover Nepal
            <br />
            <span className="text-primary">One Step at a Time</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Track your runs through beautiful landscapes
          </p>
        </div>

        {/* Mobile Auth Form */}
        <div className="flex-1 flex items-center justify-center px-4 pb-6 relative z-10 overflow-y-auto">
          <div className="w-full max-w-sm">
            {isLogin ? (
              <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
