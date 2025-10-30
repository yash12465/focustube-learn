# FocusTube - Local Development Setup for Mac

This guide will help you run the FocusTube project locally on your Mac.

## Prerequisites

### 1. Install Homebrew (if not already installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Node.js and Bun
```bash
# Install Node.js (v18 or higher)
brew install node

# Install Bun (faster alternative to npm)
curl -fsSL https://bun.sh/install | bash
```

### 3. Install Supabase CLI
```bash
brew install supabase/tap/supabase
```

### 4. Install Git (if not already installed)
```bash
brew install git
```

## Project Setup

### 1. Clone or Download the Project
If you have the project already, navigate to it:
```bash
cd /path/to/focustube
```

### 2. Install Dependencies
```bash
bun install
# or if you prefer npm
npm install
```

### 3. Set Up Environment Variables
The `.env` file should already exist with:
```env
VITE_SUPABASE_PROJECT_ID="qqafbqcckevvrqnlmyeh"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxYWZicWNja2V2dnJxbmxteWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NzQ3ODgsImV4cCI6MjA3NjM1MDc4OH0.o3we__pny7RXTxMad4R7aExyGxu3wKORdj3bGyeh27I"
VITE_SUPABASE_URL="https://qqafbqcckevvrqnlmyeh.supabase.co"
```

**Note:** This project is connected to Lovable Cloud (Supabase), so the edge functions will run on the cloud automatically. You don't need to run them locally unless you want to develop/test them.

### 4. Get YouTube API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **YouTube Data API v3**
4. Create credentials (API Key)
5. Copy the API key

The YouTube API key has already been added to your Lovable Cloud secrets, so the production app will work. For local edge function testing (optional), you would need to set it up locally.

## Running the Application

### Option 1: Run Frontend Only (Recommended for Most Development)
This connects to your existing Lovable Cloud backend (edge functions run in the cloud):

```bash
bun run dev
# or
npm run dev
```

The app will be available at: `http://localhost:8080`

**This is the easiest way to develop** - all edge functions will use the cloud deployment automatically.

### Option 2: Run Everything Locally (Advanced)
If you want to test edge functions locally:

#### Step 1: Link to Supabase Project
```bash
supabase link --project-ref qqafbqcckevvrqnlmyeh
```

#### Step 2: Create `.env.local` for Edge Functions
Create `supabase/.env.local`:
```env
YOUTUBE_API_KEY=your_youtube_api_key_here
LOVABLE_API_KEY=your_lovable_api_key_here
```

#### Step 3: Start Supabase Locally
```bash
supabase start
```

This will start local Supabase services. Note the local API URL and anon key.

#### Step 4: Update `.env` to Point to Local Supabase (temporary)
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_PUBLISHABLE_KEY=your_local_anon_key_from_supabase_start
```

#### Step 5: Serve Edge Functions Locally
```bash
supabase functions serve
```

#### Step 6: Run Frontend
```bash
bun run dev
```

## Available Commands

```bash
# Development mode
bun run dev              # Start dev server on port 8080
npm run dev              # Alternative with npm

# Build for production
bun run build            # Create production build
npm run build            # Alternative with npm

# Preview production build
bun run preview          # Preview production build locally
npm run preview          # Alternative with npm

# Type checking
bunx tsc                 # Check TypeScript types
npx tsc                  # Alternative with npm

# Supabase commands
supabase status          # Check local Supabase status
supabase stop            # Stop local Supabase
supabase functions serve # Run edge functions locally
supabase functions deploy # Deploy functions to cloud
```

## Project Structure

```
focustube/
├── src/
│   ├── components/          # React components
│   │   ├── VideoCard.tsx    # Video card component
│   │   ├── VideoPlayer.tsx  # YouTube player
│   │   ├── VideoInput.tsx   # URL input
│   │   └── TranscriptPanel.tsx # AI chat panel
│   ├── pages/              # Page components
│   │   ├── Index.tsx       # Home page with search
│   │   └── Watch.tsx       # Video watch page
│   ├── integrations/       # Supabase client
│   └── index.css           # Global styles
├── supabase/
│   ├── functions/          # Edge functions
│   │   ├── youtube-search/
│   │   ├── youtube-transcript/
│   │   └── transcript-ai-chat/
│   └── config.toml         # Supabase config
└── .env                    # Environment variables
```

## Features

✅ **YouTube Video Search** - Search educational videos
✅ **Video Player** - Watch videos without distractions
✅ **AI Chat** - Ask questions about video content
✅ **Transcript Access** - View available caption tracks
✅ **AI Search** - Dedicated AI-powered search for general queries
✅ **Pomodoro Timer** - Focus sessions with reward system
✅ **Timetable** - Organize your schedule and events
✅ **Notes** - Create and manage study notes
✅ **Rewards System** - Track progress, earn points, and unlock achievements
✅ **User Authentication** - Secure login and signup with email

## Troubleshooting

### Port 8080 already in use
```bash
# Find and kill the process
lsof -ti:8080 | xargs kill -9

# Or use a different port
bun run dev -- --port 3000
```

### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules bun.lockb
bun install
```

### Supabase connection errors
Make sure your `.env` file has the correct values. The default setup uses the cloud Supabase, which should work out of the box.

### Edge function errors
Check the Lovable Cloud logs in your project dashboard, or if running locally, check the terminal output from `supabase functions serve`.

## Development Tips

1. **Hot Reload**: The dev server supports hot module replacement - changes to your code will reflect immediately
2. **TypeScript**: The project uses TypeScript for type safety
3. **Tailwind CSS**: All styling uses Tailwind utility classes
4. **Edge Functions**: Edge functions auto-deploy when you push changes through Lovable

## Next Steps

1. Start the dev server: `bun run dev`
2. Open browser to: `http://localhost:8080`
3. Search for educational videos
4. Click a video to watch and chat with AI

## Need Help?

- Check the console for errors (Chrome DevTools: F12)
- Check edge function logs in Lovable dashboard
- Review the [Lovable Documentation](https://docs.lovable.dev)

Happy coding! 🚀
