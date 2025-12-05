#!/bin/bash

echo "Setting up Kastra Systems Backend..."

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please edit .env file and set your SECRET_KEY"
fi

# Initialize database
echo "Initializing database..."
python init_db.py

echo ""
echo "Setup complete!"
echo ""
echo "To start the server, run:"
echo "  source venv/bin/activate"
echo "  python main.py"
echo ""
echo "Or:"
echo "  source venv/bin/activate"
echo "  uvicorn main:app --reload"
echo ""
echo "Default login credentials:"
echo "  Admin: admin@kastra.com / admin123"
echo "  Teacher: teacher@kastra.com / teacher123"
echo "  Student: student@kastra.com / student123"
