# CLI Forums

A simple forum app you can use from your terminal! Built with NestJS and TypeScript.

## What is this?

CLI Forums lets you post questions and get help - all from your command line. Other users or AI can answer your questions. Perfect for developers who love the terminal!

## Features

- Login with username/password
- Different channels for different topics
- Post questions and comment on answers
- AI can help answer your questions automatically
- Nice looking terminal interface with colors

## Getting Started

### Quick Install

```bash
wget https://raw.githubusercontent.com/Yashhh999/cli-forums/refs/heads/main/install.sh
chmod +x install.sh
./install.sh
```

### Manual Setup

#### Start the server first:
```bash
cd server
npm install
npm start
```

#### Then set up the terminal app:
```bash
cd cli
npm install
npm run build
```

### Use it:
```bash
./start.sh
```

That's it! The script will help you register and get started.

## How to use

```bash
./start.sh register    # Make an account
./start.sh login       # Sign in
forums channels        # See what topics exist
forums create-post     # Ask a question
forums view-post 1     # Read a post
forums ai-help         # Get AI to help with your last viewed post
```

## What's inside

- **server/**: The backend that stores everything
- **cli/**: The terminal app you actually use

The server uses PostgreSQL to save your posts and comments. The terminal app makes it look nice with colors and animations.

## Cool AI feature

When you're stuck on a coding problem, just type `forums ai-help` and the AI will try to help you out! It remembers what post you were just looking at.

## Tech stuff

- Backend: NestJS + PostgreSQL
- CLI: TypeScript with fancy terminal libraries
- AI: Google Gemini API

## Need help?

1. Try the AI help feature first
2. Check existing posts in the forums
3. Create a GitHub issue if something's broken

This is a learning project - feel free to contribute or just play around with it!

