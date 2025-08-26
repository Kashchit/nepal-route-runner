#!/bin/bash

echo "🏃‍♂️ Starting Run Nepal Demo Application..."
echo "=========================================="

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
}

# Kill any existing processes
echo "🔄 Stopping existing processes..."
pkill -f "node.*index.js" 2>/dev/null
pkill -f "vite" 2>/dev/null

# Start backend
echo "📡 Starting Backend Server..."
cd backend
if ! check_port 5001; then
    node src/index.js &
    BACKEND_PID=$!
    echo "✅ Backend started with PID: $BACKEND_PID"
else
    echo "✅ Backend already running on port 5001"
fi
cd ..

# Wait for backend to start
sleep 3

# Test backend
echo "🔍 Testing Backend..."
if curl -s http://localhost:5001/health > /dev/null; then
    echo "✅ Backend is responding"
else
    echo "❌ Backend is not responding"
    exit 1
fi

# Start frontend
echo "🌐 Starting Frontend Server..."
cd frontend
if ! check_port 8080; then
    npm run dev &
    FRONTEND_PID=$!
    echo "✅ Frontend started with PID: $FRONTEND_PID"
else
    echo "✅ Frontend already running on port 8080"
fi
cd ..

# Wait for frontend to start
sleep 5

# Test frontend
echo "🔍 Testing Frontend..."
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Frontend is responding"
else
    echo "❌ Frontend is not responding"
    exit 1
fi

echo ""
echo "🎉 Demo Application is Ready!"
echo "============================="
echo ""
echo "📱 Frontend: http://localhost:8080"
echo "🔧 Backend API: http://localhost:5001"
echo "📊 Health Check: http://localhost:5001/health"
echo ""
echo "🔐 Demo Credentials:"
echo "   Email: demo@example.com"
echo "   Password: password123"
echo ""
echo "   Email: sherpa@example.com"
echo "   Password: password123"
echo ""
echo "📱 Mobile View:"
echo "   - Open http://localhost:8080 in your browser"
echo "   - Press F12 and click the mobile device icon"
echo "   - Choose iPhone or Android device"
echo ""
echo "🎯 Demo Features:"
echo "   ✅ Authentication with real database"
echo "   ✅ 16+ curated routes across Nepal"
echo "   ✅ District-based leaderboards"
echo "   ✅ User profiles and statistics"
echo "   ✅ Mobile-first responsive design"
echo ""
echo "📖 For detailed demo instructions, see: DEMO_GUIDE.md"
echo ""
echo "To stop the application, press Ctrl+C"
echo ""

# Keep script running
wait
