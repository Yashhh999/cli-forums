#!/bin/bash

# CLI Forums Demo Script
# This script demonstrates the CLI functionality

echo "🚀 CLI Forums Demo"
echo "=================="
echo ""

echo "📋 Available commands demonstration:"
echo ""

echo "1. Show help:"
echo "   $ forums --help"
npm run start -- --help
echo ""

echo "2. List channels (public endpoint):"
echo "   $ forums channels"
npm run start -- channels
echo ""

echo "3. List posts (public endpoint):"
echo "   $ forums posts"
npm run start -- posts
echo ""

echo "📝 Authentication required commands:"
echo ""
echo "To test these commands, you need to register and login first:"
echo ""
echo "   $ forums register    # Register a new account"
echo "   $ forums login       # Login to your account"
echo "   $ forums create-post # Create a new post"
echo "   $ forums comment 1   # Add comment to post #1"
echo "   $ forums ai-help 1   # Get AI help for post #1"
echo ""

echo "🎯 Interactive mode:"
echo ""
echo "For the best experience, try interactive mode:"
echo "   $ forums interactive"
echo ""
echo "This provides a menu-driven interface for all operations."
echo ""

echo "🛠️  Admin commands (require admin role):"
echo ""
echo "   $ forums create-channel  # Create a new channel"
echo ""

echo "✅ Demo complete!"
echo ""
echo "Next steps:"
echo "1. Start the server: cd ../server && npm run start:dev"
echo "2. Register: npm run start -- register"
echo "3. Try interactive mode: npm run start -- interactive"
