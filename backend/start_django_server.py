#!/usr/bin/env python3
"""
Startup script for the Django ML API server
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    print("Installing requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("Requirements installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Error installing requirements: {e}")
        return False
    return True

def run_migrations():
    """Run Django migrations"""
    print("Running Django migrations...")
    try:
        subprocess.check_call([sys.executable, "manage.py", "migrate"])
        print("Migrations completed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Error running migrations: {e}")
        return False
    return True

def load_models():
    """Load ML models"""
    print("Loading ML models...")
    try:
        subprocess.check_call([sys.executable, "manage.py", "load_models"])
        print("Models loaded successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Warning: Could not load models: {e}")
        print("Models will be loaded when first API call is made.")

def start_server():
    """Start the Django development server"""
    print("Starting Django ML API server...")
    try:
        # Start the server
        subprocess.run([sys.executable, "manage.py", "runserver", "0.0.0.0:5000"])
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Error starting server: {e}")

if __name__ == "__main__":
    print("=== Django ML API Server Startup ===")
    
    # Check if we're in the right directory
    if not os.path.exists("manage.py"):
        print("Error: manage.py not found. Please run this script from the backend directory.")
        sys.exit(1)
    
    # Install requirements
    if not install_requirements():
        print("Failed to install requirements. Please check your Python environment.")
        sys.exit(1)
    
    # Run migrations
    if not run_migrations():
        print("Failed to run migrations. Please check your Django setup.")
        sys.exit(1)
    
    # Load models
    load_models()
    
    # Start the server
    start_server()
