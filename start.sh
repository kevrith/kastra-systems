#!/bin/bash

# Kastra Systems - Quick Start Script
# This script starts both frontend and backend servers

echo "Starting Kastra Systems..."
echo ""

# Check if backend is set up
if [ ! -d "backend/venv" ]; then
    echo "Backend not set up. Please run backend/setup.sh first."
    exit 1
fi

# Check if frontend is set up
if [ ! -d "frontend/kastra-systems-app/node_modules" ]; then
    echo "Frontend not set up. Please run 'npm install' in frontend/kastra-systems-app first."
    exit 1
fi

# Start backend in background
echo "Starting backend server on http://localhost:8000..."
cd backend
source venv/bin/activate
python main.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend in background
echo "Starting frontend server on http://localhost:5173..."
cd frontend/kastra-systems-app
npm run dev > ../../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ../..

echo ""
echo "====================================="
echo "Kastra Systems is now running!"
echo "====================================="
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Logs:"
echo "  Backend:  tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""
echo "To stop the servers:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Servers stopped."
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup INT

# Wait for Ctrl+C
wait
