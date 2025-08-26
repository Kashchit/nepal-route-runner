#!/bin/bash

echo "🚀 Starting Nepal Route Runner Application..."

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
}

# Start backend if not running
if ! check_port 5001; then
    echo "📡 Starting Backend Server..."
    cd backend
    node src/index.js &
    BACKEND_PID=$!
    echo "✅ Backend started with PID: $BACKEND_PID"
    cd ..
else
    echo "✅ Backend already running on port 5001"
fi

# Wait a moment for backend to start
sleep 3

# Start frontend if not running
if ! check_port 8080; then
    echo "🌐 Starting Frontend Server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    echo "✅ Frontend started with PID: $FRONTEND_PID"
    cd ..
else
    echo "✅ Frontend already running on port 8080"
fi

# Wait for services to start
sleep 5

# Test both services
echo ""
echo "🔍 Testing Services..."

# Test backend
if curl -s http://localhost:5001/health > /dev/null; then
    echo "✅ Backend is running: http://localhost:5001"
else
    echo "❌ Backend is not responding"
fi

# Test frontend
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Frontend is running: http://localhost:8080"
else
    echo "❌ Frontend is not responding"
fi

echo ""
echo "🎉 Application Status:"
echo "   Backend API:  http://localhost:5001"
echo "   Frontend App: http://localhost:8080"
echo "   API Health:   http://localhost:5001/health"
echo ""
echo "📱 Open your browser and go to: http://localhost:8080"
echo ""
echo "To stop the application, press Ctrl+C"
echo ""

# Keep script running
wait
