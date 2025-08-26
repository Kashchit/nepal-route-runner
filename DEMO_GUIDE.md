# 🏃‍♂️ Run Nepal - Demo Guide

## 🎯 **Demo Credentials**

### **Available Demo Accounts**
```
Email: demo@example.com
Password: password123

Email: sherpa@example.com  
Password: password123

Email: jogger@example.com
Password: password123

Email: trail@example.com
Password: password123
```

## 🚀 **How to Demo the App**

### **1. Access the Application**
- **Frontend URL**: http://localhost:8080
- **Backend API**: http://localhost:5001
- **Mobile-Optimized**: Best viewed on mobile devices or mobile browser view

### **2. Authentication Flow**
1. **Landing Page**: Beautiful mobile-first authentication screen
2. **Login**: Use any of the demo credentials above
3. **Registration**: Create new accounts (optional)
4. **Protected Routes**: All features require authentication

### **3. Core Features to Demo**

#### **🏠 Home Tab**
- **Hero Section**: Nepal-themed welcome with route discovery
- **Quick Stats**: Weekly progress and best pace
- **Suggested Routes**: 16+ curated routes from database
- **Mobile Navigation**: Bottom tab navigation

#### **🗺️ Track Tab**
- **Route Discovery**: Browse all available routes
- **Route Details**: Distance, difficulty, elevation, estimated time
- **Interactive Map**: Route visualization (placeholder)
- **Start Run**: Begin tracking functionality

#### **🏆 Leaderboard Tab**
- **District Rankings**: Kathmandu, Pokhara, Chitwan, etc.
- **Real Data**: Live leaderboard from database
- **Performance Metrics**: Total distance, runs, average pace
- **User Rankings**: Actual user performance data

#### **👤 Profile Tab**
- **User Stats**: Total runs, distance, routes completed
- **Personal Info**: Name, location, bio
- **Recent Activity**: Latest runs and achievements
- **Performance Tracking**: Best times and progress

### **4. Database Integration Demo**

#### **Real Routes Available**
1. **Annapurna Base Camp Trek** (115km, Hard)
2. **Everest Base Camp Trek** (130km, Expert)
3. **Pokhara Lakeside Run** (8.5km, Easy)
4. **Kathmandu Valley Heritage Trail** (12km, Medium)
5. **Chitwan Jungle Trail** (15km, Medium)
6. **Lumbini Peace Run** (6km, Easy)
7. **+ 10 more routes** across different districts

#### **Sample User Data**
- **4 Demo Users** with realistic profiles
- **8 Sample Runs** with timing and statistics
- **6 Leaderboard Entries** with performance data
- **Real Authentication** with JWT tokens

### **5. Mobile-First Design Features**

#### **Responsive Design**
- **Mobile-Optimized**: Touch-friendly interface
- **Safe Areas**: Support for iPhone notches and home indicators
- **Large Tap Targets**: 44px minimum for accessibility
- **Smooth Animations**: Native-like transitions

#### **Mobile Navigation**
- **Bottom Tabs**: Easy thumb navigation
- **Swipe Gestures**: Intuitive interactions
- **Loading States**: Smooth user experience
- **Error Handling**: User-friendly error messages

### **6. Technical Demo Points**

#### **Backend API**
- **RESTful Endpoints**: Clean API design
- **JWT Authentication**: Secure token-based auth
- **Database Integration**: Real PostgreSQL data
- **Error Handling**: Comprehensive error responses

#### **Frontend Features**
- **React Query**: Efficient data fetching
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern styling system
- **Mobile PWA**: Progressive web app capabilities

### **7. Business Value Demo**

#### **Local Market Focus**
- **Nepal-Specific Routes**: Cultural relevance
- **District-Based Competition**: Community building
- **Heritage Integration**: UNESCO World Heritage sites
- **Local Language Support**: Ready for localization

#### **Scalability Features**
- **Modular Architecture**: Easy to extend
- **Database Schema**: Production-ready design
- **API Design**: RESTful and extensible
- **Mobile-First**: Ready for app store deployment

### **8. Demo Script for Investors**

#### **Opening (2 minutes)**
"Welcome to Run Nepal - Nepal's first localized running and fitness app. Today I'll show you how we're building a community around running in Nepal's most beautiful locations."

#### **Authentication Demo (1 minute)**
"Let me log in with one of our demo accounts. Notice the mobile-first design - this is optimized for the Nepali market where mobile usage is dominant."

#### **Route Discovery (2 minutes)**
"Here we have 16+ curated routes across Nepal. From the Annapurna Base Camp Trek to the Kathmandu Valley Heritage Trail. Each route includes detailed information, difficulty levels, and estimated completion times."

#### **Leaderboard Demo (2 minutes)**
"This is where the community aspect comes in. Users compete in district-based leaderboards. Here you can see real performance data from our demo users."

#### **Profile & Stats (1 minute)**
"Users can track their progress, view their achievements, and see their running history. This creates engagement and retention."

#### **Technical Architecture (1 minute)**
"Behind this beautiful interface is a robust backend with PostgreSQL database, JWT authentication, and a scalable API architecture ready for production."

#### **Closing (1 minute)**
"Run Nepal is more than just a fitness app - it's a platform for discovering Nepal's beauty, building community, and promoting healthy living. We're ready to launch and scale."

### **9. Troubleshooting**

#### **If Login Fails**
- Check that backend is running: `curl http://localhost:5001/health`
- Verify CORS settings in backend
- Check browser console for errors
- Try different demo accounts

#### **If Data Doesn't Load**
- Verify database connection
- Check API endpoints: `curl http://localhost:5001/api/routes`
- Ensure sample data is seeded: `npm run seed`

#### **Mobile Testing**
- Use browser dev tools mobile view
- Test on actual mobile devices
- Check touch interactions
- Verify responsive design

### **10. Next Steps**

#### **For Investors**
- **User Testing**: Conduct user research in Nepal
- **Market Analysis**: Validate demand in target districts
- **Partnerships**: Connect with local running clubs
- **Funding**: Scale development and marketing

#### **For Development**
- **GPS Tracking**: Implement real-time run tracking
- **Social Features**: Add friend connections and sharing
- **Gamification**: Expand achievements and challenges
- **Monetization**: Premium features and partnerships

---

**🎉 Ready to showcase Run Nepal to investors!**
