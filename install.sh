#!/bin/bash

# CLI Forums Installer
# Install the CLI client only

set -e

echo "🚀 CLI Forums Client Installer"
echo "=============================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Repository configuration
REPO_URL="https://github.com/Yashhh999/cli-forums.git"  # Replace with your repo URL
CLI_FOLDER="cli"  # The folder to clone
INSTALL_DIR="cli-forums-client"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed.${NC}"
    echo -e "${YELLOW}Please install Git from https://git-scm.com${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Git $(git --version | cut -d' ' -f3) detected${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed.${NC}"
    echo -e "${YELLOW}Please install Node.js (version 16 or higher) from https://nodejs.org${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2)
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)

if [ "$MAJOR_VERSION" -lt 16 ]; then
    echo -e "${RED}❌ Node.js version $NODE_VERSION is too old.${NC}"
    echo -e "${YELLOW}Please install Node.js version 16 or higher.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $NODE_VERSION detected${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed.${NC}"
    echo -e "${YELLOW}Please install npm or use Node.js with npm included.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm -v) detected${NC}"
echo ""

# Clone only the CLI folder
echo -e "${BLUE}📥 Cloning CLI client from repository...${NC}"

# Remove existing directory if it exists
if [ -d "$INSTALL_DIR" ]; then
    echo -e "${YELLOW}⚠️  Removing existing installation directory...${NC}"
    rm -rf "$INSTALL_DIR"
fi

# Clone with sparse checkout to get only the CLI folder
git clone --no-checkout "$REPO_URL" "$INSTALL_DIR"
cd "$INSTALL_DIR"
git sparse-checkout init --cone
git sparse-checkout set "$CLI_FOLDER"
git checkout

# Move CLI folder contents to root and cleanup
mv "$CLI_FOLDER"/* .
mv "$CLI_FOLDER"/.[^.]* . 2>/dev/null || true  # Move hidden files if they exist
rmdir "$CLI_FOLDER"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to clone repository${NC}"
    exit 1
fi

echo -e "${GREEN}✅ CLI client cloned successfully${NC}"
echo ""

# Install CLI dependencies
echo -e "${BLUE}📦 Installing CLI dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
echo ""

# Build the CLI
echo -e "${BLUE}🔨 Building CLI application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to build CLI${NC}"
    exit 1
fi

echo -e "${GREEN}✅ CLI built successfully${NC}"
echo ""

# Make start script executable
if [ -f "start.sh" ]; then
    chmod +x start.sh
    echo -e "${GREEN}✅ Start script made executable${NC}"
fi

echo ""
echo -e "${CYAN}🎉 Installation Complete!${NC}"
echo ""
echo -e "${BLUE}📋 Quick Start:${NC}"
echo ""
echo -e "  ${YELLOW}1. Navigate to the CLI directory:${NC}"
echo -e "     cd $INSTALL_DIR"
echo ""
echo -e "  ${YELLOW}2. Start the CLI:${NC}"
echo -e "     ./start.sh"
echo ""
echo -e "  ${YELLOW}3. Or use individual commands:${NC}"
echo -e "     ./start.sh register    # Register new account"
echo -e "     ./start.sh login       # Login to account"
echo -e "     ./start.sh help        # Show all commands"
echo ""
echo -e "${BLUE}📚 Available Commands:${NC}"
echo ""
echo -e "  ${CYAN}Authentication:${NC}"
echo -e "    forums register         # Register new account"
echo -e "    forums login            # Login to account" 
echo -e "    forums logout           # Logout"
echo -e "    forums profile          # Show profile"
echo ""
echo -e "  ${CYAN}Forums:${NC}"
echo -e "    forums channels         # List channels"
echo -e "    forums posts            # List posts"
echo -e "    forums create-post      # Create new post"
echo -e "    forums view-post <id>   # View specific post"
echo -e "    forums comment <id>     # Add comment to post"
echo -e "    forums ai-help          # Get AI help (smart session)"
echo ""
echo -e "  ${CYAN}Interactive:${NC}"
echo -e "    forums interactive      # Start interactive mode"
echo ""
echo -e "${BLUE}📝 Configuration:${NC}"
echo ""
echo -e "  The CLI connects to ${CYAN}http://localhost:3000${NC} by default."
echo -e "  To use a different server, set the environment variable:"
echo -e "    ${YELLOW}export FORUMS_API_URL=https://your-server.com${NC}"
echo ""
echo -e "${BLUE}🔧 Development:${NC}"
echo ""
echo -e "  npm run dev             # Run in development mode"
echo -e "  npm run build           # Build TypeScript"
echo -e "  npm run start           # Run built version"
echo ""
echo -e "${GREEN}🚀 Ready to use! Start with: ${YELLOW}cd $INSTALL_DIR && ./start.sh${NC}"
echo ""
echo -e "${BLUE}💡 Pro Tips:${NC}"
echo -e "  • Use interactive mode for the best experience"
echo -e "  • View a post first, then use 'forums ai-help' (no ID needed!)"
echo ""
