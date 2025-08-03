# Aurora Mood Garden 🌸

A therapeutic web application designed to help students manage stress and enhance their mood through interactive games and mindfulness exercises.

## Features

### 🎮 Therapeutic Games
- **Breakout Therapy** - Break through stress with classic brick-breaking action
- **Word Search Zen** - Find peace through focused word discovery  
- **Mindful Flight** - Navigate challenges with calm focus (Flappy Bird)
- **Color Memory Flow** - Enhance memory and reduce anxiety
- **Mindful Breathing** - Guided breathing exercises with visual cues

### 📊 Analytics & Insights
- Personal gaming statistics and progress tracking
- AI-powered wellness insights
- Mood tracking and analysis
- Session history and achievements

### 🔐 Authentication
- Secure user authentication via Clerk
- Personal data protection and privacy

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **AI**: Groq API
- **Deployment**: Vercel

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/arpit15006/aurora-mood-garden.git
cd aurora-mood-garden
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `VITE_GROQ_API_KEY` - Your Groq API key

5. Set up the database:
```bash
# Run the SQL in game-stats-setup.sql in your Supabase dashboard
# Then run update-breathing-constraint.sql to add breathing exercise support
```

6. Start the development server:
```bash
npm run dev
```

## Deployment on Vercel

### Option 1: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables in Vercel dashboard
4. Deploy!

### Option 2: Deploy via Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

### Environment Variables for Production
Set these in your Vercel dashboard under Settings > Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` 
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_GROQ_API_KEY`

## Database Setup

1. Create a Supabase project
2. Run the SQL from `game-stats-setup.sql` in the SQL editor
3. Run `update-breathing-constraint.sql` to add breathing exercise support
4. Enable Row Level Security (RLS) policies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for student mental wellness