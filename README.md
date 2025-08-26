# 🏃‍♂️ Run Nepal - MVP

**Nepal's first localized running and fitness app** - Track your runs through beautiful landscapes, join district leaderboards, and discover heritage routes across Nepal.

## 🎯 MVP Features

### ✅ **Authentication System**
- **User Registration & Login** with secure JWT authentication
- **Protected Routes** - Users must authenticate to access the app
- **Session Management** - Persistent login with localStorage
- **Demo Accounts** - Ready-to-use test accounts

### ✅ **Real Database Integration**
- **PostgreSQL Database** with Neon DB cloud hosting
- **16+ Curated Routes** across Nepal's districts
- **User Profiles** with personal information and preferences
- **Run Tracking** with detailed statistics
- **Leaderboards** by district and difficulty

### ✅ **Interactive Components**
- **Route Discovery** - Browse and select running routes
- **District Leaderboards** - Compete with local runners
- **User Statistics** - Track personal progress and achievements
- **Real-time Data** - All data fetched from live API endpoints

### ✅ **Modern UI/UX**
- **Mobile-First Design** - Optimized for mobile devices
- **Beautiful Animations** - Smooth transitions and loading states
- **Responsive Layout** - Works on all screen sizes
- **Nepal-Themed Design** - Cultural elements and local branding

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon DB recommended)

### 1. Clone & Install
```bash
git clone <repository-url>
cd nepal-route-runner

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup
```bash
cd backend

# Run database migrations
npm run migrate

# Seed with sample data
npm run seed
```

### 3. Environment Configuration
Create `backend/config.env`:
```env
DATABASE_URL=your_neon_db_connection_string
PORT=5001
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:8080
```

### 4. Start the Application
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

### 5. Access the App
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5001
- **API Health**: http://localhost:5001/health

## 🗄️ Database Schema

### Core Tables
- **users** - User profiles and authentication
- **routes** - Running routes with coordinates and details
- **user_runs** - Individual run tracking data
- **leaderboard** - Performance rankings and statistics
- **achievements** - Gamification system
- **challenges** - Time-based competitions
- **notifications** - User notification system

### Sample Data
- **4 Demo Users** with realistic profiles
- **16 Running Routes** across Nepal's districts
- **Sample Runs** with timing and statistics
- **Achievements & Challenges** for engagement

## 🔐 Authentication

### Demo Accounts
```
Email: demo@example.com
Password: password123

Email: sherpa@example.com  
Password: password123

Email: jogger@example.com
Password: password123
```

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

## 🗺️ Routes & Features

### Available Routes
1. **Annapurna Base Camp Trek** (115km, Hard)
2. **Everest Base Camp Trek** (130km, Expert)
3. **Pokhara Lakeside Run** (8.5km, Easy)
4. **Kathmandu Valley Heritage Trail** (12km, Medium)
5. **Chitwan Jungle Trail** (15km, Medium)
6. **Lumbini Peace Run** (6km, Easy)
7. **+ 10 more routes** across different districts

### Route Features
- **Difficulty Levels**: Easy, Medium, Hard, Expert
- **District Filtering**: Kathmandu, Pokhara, Chitwan, etc.
- **Route Types**: Trail, Road, Urban, Heritage, Wildlife
- **Detailed Information**: Distance, elevation, estimated time, highlights, warnings

## 📊 Leaderboards

### District Rankings
- **Kathmandu** - Urban heritage routes
- **Pokhara** - Lakeside and mountain trails
- **Chitwan** - Jungle and wildlife routes
- **Solukhumbu** - High-altitude treks
- **Kaski** - Annapurna region routes

### Performance Metrics
- **Total Distance** - Cumulative kilometers
- **Total Runs** - Number of completed runs
- **Average Pace** - Speed per kilometer
- **Best Times** - Personal records per route

## 🛠️ Technical Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **React Router** for navigation
- **Lucide Icons** for UI icons

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Neon DB
- **JWT** for authentication
- **bcrypt** for password hashing
- **Helmet** for security
- **CORS** for cross-origin requests

### Database
- **Neon PostgreSQL** - Serverless database
- **Connection Pooling** for performance
- **SSL Encryption** for security
- **Automatic Backups** and scaling

## 📱 Mobile-First Design

### Responsive Features
- **Mobile Navigation** - Bottom tab navigation
- **Touch-Friendly** - Large tap targets
- **Offline-Ready** - Service worker support
- **Progressive Web App** - Installable on mobile

### UI Components
- **Route Cards** - Beautiful route previews
- **Stat Cards** - Performance metrics
- **Leaderboard Tables** - District rankings
- **Authentication Forms** - Clean login/register
- **Loading States** - Smooth user experience

## 🔧 Development Commands

### Backend
```bash
npm run dev          # Start development server
npm run migrate      # Run database migrations
npm run seed         # Seed sample data
npm run setup        # Run migrations + seed
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🌟 MVP Highlights

### Investor-Ready Features
- ✅ **Complete Authentication System**
- ✅ **Real Database with Sample Data**
- ✅ **Interactive Route Discovery**
- ✅ **District-Based Leaderboards**
- ✅ **User Statistics & Progress Tracking**
- ✅ **Mobile-First Responsive Design**
- ✅ **Professional UI/UX**
- ✅ **Scalable Architecture**
- ✅ **Production-Ready Code**
- ✅ **Comprehensive Documentation**

### Business Value
- **Local Market Focus** - Tailored for Nepal's running community
- **Cultural Integration** - Heritage routes and local districts
- **Community Building** - District leaderboards and competitions
- **Scalable Platform** - Ready for additional features and users
- **Monetization Ready** - Infrastructure for premium features

## 🚀 Deployment Ready

### Production Setup
- **Environment Variables** configured
- **Database Migrations** automated
- **API Documentation** available
- **Error Handling** implemented
- **Security Measures** in place

### Next Steps for Production
1. **Domain & SSL** setup
2. **CDN** for static assets
3. **Monitoring** and analytics
4. **User Testing** and feedback
5. **Feature Expansion** based on usage

## 📞 Support

For questions or support:
- **Email**: support@runnepal.com
- **Documentation**: [API Docs](./backend/README.md)
- **Issues**: GitHub Issues

---

**Built with ❤️ for Nepal's running community**
