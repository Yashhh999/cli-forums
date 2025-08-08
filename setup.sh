#!/bin/bash

# Development Setup Script for CLI Forums
# This script sets up both the server and CLI for development

echo "🚀 CLI Forums Development Setup"
echo "==============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Setting up dependencies...${NC}"
echo ""

# Setup server
echo -e "${YELLOW}1. Setting up Backend Server${NC}"
cd server
if [ ! -d "node_modules" ]; then
    echo "Installing server dependencies..."
    npm install
    echo -e "${GREEN}✅ Server dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Server dependencies already installed${NC}"
fi

# Setup CLI
echo ""
echo -e "${YELLOW}2. Setting up CLI Client${NC}"
cd ../cli
if [ ! -d "node_modules" ]; then
    echo "Installing CLI dependencies..."
    npm install
    echo -e "${GREEN}✅ CLI dependencies installed${NC}"
else
    echo -e "${GREEN}✅ CLI dependencies already installed${NC}"
fi

# Build CLI
echo "Building CLI..."
npm run build
echo -e "${GREEN}✅ CLI built successfully${NC}"

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. Start the backend server:"
echo "   cd server"
echo "   npm run start:dev"
echo ""
echo "2. In another terminal, use the CLI:"
echo "   cd cli"
echo "   npm run start -- register"
echo "   npm run start -- login"
echo "   npm run start -- interactive"
echo ""
echo -e "${YELLOW}📋 Quick Commands:${NC}"
echo ""
echo "Backend:"
echo "  npm run start:dev    # Start development server"
echo "  npm run build        # Build for production"
echo "  npm run test         # Run tests"
echo ""
echo "CLI:"
echo "  npm run dev          # Run in development mode"
echo "  npm run start        # Run built version"
echo "  ./demo.sh            # Run demo"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "  Server: server/README.md"
echo "  CLI: cli/README.md"
echo "  Project: README.md"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
