#!/bin/bash

# CLI Forums Start Script
# Quick start script for the CLI Forums application

echo "🚀 Starting CLI Forums..."
echo ""

# Check if built
if [ ! -d "dist" ]; then
    echo "📦 Building CLI first..."
    npm run build
    echo ""
fi

# Check if user wants interactive mode
if [ "$1" = "interactive" ] || [ "$1" = "i" ]; then
    echo "🎯 Starting interactive mode..."
    npm run start -- interactive
elif [ "$1" = "help" ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    npm run start -- --help
elif [ $# -eq 0 ]; then
    echo "📋 Available quick options:"
    echo ""
    echo "  ./start.sh interactive     # Start interactive mode"
    echo "  ./start.sh help           # Show all commands"
    echo "  ./start.sh register       # Register new account"
    echo "  ./start.sh login          # Login to account"
    echo "  ./start.sh channels       # List channels"
    echo "  ./start.sh posts          # List posts"
    echo ""
    echo "🎯 Starting interactive mode by default..."
    echo ""
    npm run start -- interactive
else
    echo "▶️  Running: forums $@"
    npm run start -- "$@"
fi
