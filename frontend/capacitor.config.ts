import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.aeb350b1b36547c99105275cf8df1fde',
  appName: 'A Lovable project',
  webDir: 'dist',
  server: {
    url: 'https://aeb350b1-b365-47c9-9105-275cf8df1fde.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Geolocation: {
      permissions: ["location"]
    },
    Camera: {
      permissions: ["camera", "photos"]
    }
  }
};

export default config;