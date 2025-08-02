# Aurora Mood Garden - Codebase Index

## 📋 Project Overview
Aurora Mood Garden is a comprehensive mental wellness platform for students featuring AI-powered emotional support, mood tracking, journaling, and real-time emotion detection with voice therapy capabilities.

**Live Project**: https://lovable.dev/projects/f68be1f6-ed11-43cf-9d2b-77ee8c1d5498

## 🏗️ Architecture & Tech Stack

### Core Technologies
- **Frontend**: React 18.3.1 + TypeScript 5.5.3
- **Build Tool**: Vite 5.4.1 with SWC plugin
- **Styling**: Tailwind CSS 3.4.11 + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **AI**: Groq API (Llama3-8b-8192 model)
- **ML**: TensorFlow.js 4.22.0 for emotion detection
- **Voice**: Web Speech API (Recognition + Synthesis)

## 📁 Directory Structure

```
aurora-mood-garden-main/
├── public/                          # Static assets
│   ├── placeholder.svg
│   └── robots.txt
├── src/                            # Source code
│   ├── components/                 # React components
│   │   ├── ui/                    # shadcn/ui components (50+ files)
│   │   ├── AIVentSpace.tsx        # Voice therapy & chat system
│   │   ├── AuthPage.tsx           # Authentication interface
│   │   ├── AuthProvider.tsx       # Auth context provider
│   │   ├── Dashboard.tsx          # Analytics & insights
│   │   ├── EmotionDetector.tsx    # Real-time emotion detection
│   │   ├── HomePage.tsx           # Main landing page
│   │   ├── JournalHistory.tsx     # Journal entries history
│   │   ├── JournalSpace.tsx       # AI-powered journaling
│   │   ├── MoodGarden.tsx         # Interactive mood visualization
│   │   ├── Navigation.tsx         # App navigation system
│   │   └── OnboardingModal.tsx    # User onboarding
│   ├── hooks/                     # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── integrations/              # External service integrations
│   │   └── supabase/
│   │       ├── client.ts          # Supabase client configuration
│   │       └── types.ts           # Database type definitions
│   ├── lib/                       # Utility libraries
│   │   └── utils.ts               # Common utilities
│   ├── pages/                     # Page components
│   │   ├── Index.tsx              # Main dashboard page
│   │   ├── MoodGarden.tsx         # Mood garden page
│   │   ├── NotFound.tsx           # 404 error page
│   │   └── Onboarding.tsx         # Onboarding flow
│   ├── utils/                     # Utility functions
│   │   └── testSupabase.ts        # Database testing utilities
│   ├── App.css                    # Component-specific styles
│   ├── App.tsx                    # Main app component
│   ├── index.css                  # Global styles & Aurora theme
│   ├── main.tsx                   # App entry point
│   └── vite-env.d.ts             # TypeScript environment declarations
├── supabase/                      # Database configuration
│   ├── migrations/                # Database migration files
│   │   ├── 20250725131923-*.sql   # Initial schema setup
│   │   ├── 20250728043054-*.sql   # Schema updates
│   │   ├── 20250728045653-*.sql   # Additional tables
│   │   └── 20250730162819-*.sql   # Latest migrations
│   └── config.toml               # Supabase configuration
├── .gitignore                     # Git ignore rules
├── bun.lockb                      # Bun package lock
├── components.json                # shadcn/ui configuration
├── eslint.config.js              # ESLint configuration
├── index.html                     # HTML entry point
├── package-lock.json             # npm package lock
├── package.json                  # Project dependencies
├── postcss.config.js             # PostCSS configuration
├── README.md                     # Project documentation
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.app.json             # TypeScript app config
├── tsconfig.json                 # TypeScript base config
├── tsconfig.node.json            # TypeScript Node config
└── vite.config.ts                # Vite build configuration
```

## 🧩 Core Components

### 1. AIVentSpace.tsx (Voice Therapy System)
**Purpose**: Real-time conversational AI with voice and text support
**Key Features**:
- Web Speech API integration (recognition + synthesis)
- Groq API for AI responses
- Voice mode toggle with audio controls
- Message history and context awareness
- Browser compatibility checks
- Real-time conversation flow

**Dependencies**: Groq API, Web Speech API, Radix UI components

### 2. EmotionDetector.tsx (Real-time Emotion Detection)
**Purpose**: High-frequency facial emotion recognition
**Key Features**:
- TensorFlow.js integration (simulated)
- 2-second detection intervals
- Emotion smoothing algorithms
- Camera access and video processing
- Real-time confidence scoring
- Database logging with Supabase

**Dependencies**: TensorFlow.js, MediaStream API, Canvas API

### 3. Dashboard.tsx (Analytics & Insights)
**Purpose**: Comprehensive wellness analytics dashboard
**Key Features**:
- Multi-source data aggregation
- Recharts visualizations (bar, line, pie charts)
- AI-powered insights generation
- Weekly trends and patterns
- Activity overview tracking
- Real-time statistics

**Dependencies**: Recharts, Groq API, Supabase

### 4. JournalSpace.tsx (AI-Enhanced Journaling)
**Purpose**: Smart journaling with AI analysis
**Key Features**:
- Mood-based prompt generation
- Multi-threaded AI analysis (response, insights, suggestions)
- Auto-save functionality
- Journal history integration
- Quick journal type templates
- Real-time character counting

**Dependencies**: Groq API, React Hook Form, Supabase

### 5. MoodGarden.tsx (Interactive Mood Visualization)
**Purpose**: Gamified mood tracking with visual garden
**Key Features**:
- HTML5 Canvas rendering
- Click-to-plant interaction
- Mood-to-plant mapping
- Animated growth effects
- Local storage persistence
- Garden statistics tracking

**Dependencies**: HTML5 Canvas API, Local Storage

### 6. Navigation.tsx (App Navigation)
**Purpose**: Main navigation system with feature cards
**Key Features**:
- Responsive grid layout
- Interactive feature cards
- Gradient animations
- Active state management
- Route navigation integration
- Glass morphism effects

## 🗄️ Database Schema (Supabase PostgreSQL)

### Tables

#### 1. `profiles`
```sql
- id: UUID (Primary Key, references auth.users)
- email: TEXT
- full_name: TEXT
- user_id: UUID
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 2. `journal_entries`
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key)
- title: TEXT
- content: TEXT (NOT NULL)
- mood: TEXT
- ai_response: TEXT
- ai_insights: TEXT
- ai_suggestions: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 3. `emotion_logs`
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key)
- detected_emotion: TEXT (NOT NULL)
- confidence: FLOAT (NOT NULL)
- timestamp: TIMESTAMP
- notes: TEXT
```

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Automatic user_id filtering on all operations
- Secure API endpoints with authentication checks

### Database Functions
- `handle_new_user()`: Automatic profile creation on signup
- Triggers for user management and data consistency

## 🎨 Design System (Aurora Theme)

### Color Palette
```css
--aurora-deep-blue: #0a0f1c      /* Primary background */
--aurora-midnight: #1a2332       /* Secondary background */
--aurora-electric-blue: #2dd4bf  /* Primary accent */
--aurora-purple: #8b5cf6         /* Secondary accent */
--aurora-pink: #ec4899           /* Tertiary accent */
--aurora-green: #10b981          /* Success states */
--aurora-teal: #14b8a6           /* Info states */
--aurora-cyan: #06b6d4           /* Highlight states */
```

### Glass Morphism Effects
- `.liquid-glass`: Basic glass effect
- `.liquid-glass-strong`: Enhanced glass with stronger blur
- `.liquid-glass-card`: Card-specific glass styling

### Custom Animations
- `aurora-flow`: Flowing light effects
- `aurora-dance`: Floating element animations
- `aurora-waves`: Wave-like transitions
- `float`: Gentle floating motion
- `shimmer`: Loading state animations

## 🔧 Configuration Files

### package.json
**Key Dependencies**:
- React ecosystem: react, react-dom, react-router-dom
- UI Framework: @radix-ui components, tailwindcss
- Backend: @supabase/supabase-js, @tanstack/react-query
- AI/ML: @tensorflow/tfjs, groq API integration
- Forms: react-hook-form, zod validation
- Charts: recharts for data visualization

### tailwind.config.ts
**Custom Configuration**:
- Aurora color palette
- Glass morphism utilities
- Custom animations and keyframes
- Responsive breakpoints
- Component-specific styling

### vite.config.ts
**Build Configuration**:
- React SWC plugin for fast compilation
- Path aliases (@/ for src/)
- Development server configuration
- Component tagging for development

## 🔐 Authentication & Security

### Supabase Auth
- Email/password authentication
- Persistent sessions with localStorage
- Automatic token refresh
- Row Level Security (RLS) policies

### API Security
- Environment variables for API keys
- Client-side API key management
- Secure database queries with RLS
- User data isolation

## 🚀 Development Workflow

### Scripts
```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # Code linting
npm run preview  # Preview production build
```

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key
```

## 🧪 Testing & Quality

### Code Quality
- ESLint 9.9.0 with TypeScript and React plugins
- TypeScript strict mode enabled
- Prettier integration via ESLint
- Component prop validation

### Performance
- Vite for fast development and builds
- Code splitting with React.lazy
- Optimized bundle size
- Efficient re-rendering patterns

## 📱 Responsive Design

### Breakpoint Strategy
- Mobile-first approach
- Tailwind responsive utilities
- Flexible grid systems
- Adaptive component layouts

### Browser Compatibility
- Modern browser support
- Web Speech API fallbacks
- Progressive enhancement
- Graceful degradation

## 🔮 Key Features Implementation

### Voice Therapy System
- **File**: `src/components/AIVentSpace.tsx`
- **Technology**: Web Speech API + Groq AI
- **Features**: Real-time voice recognition, AI responses, voice synthesis

### Emotion Detection
- **File**: `src/components/EmotionDetector.tsx`
- **Technology**: TensorFlow.js + Camera API
- **Features**: 2-second intervals, emotion smoothing, confidence scoring

### Smart Journaling
- **File**: `src/components/JournalSpace.tsx`
- **Technology**: Groq AI + Supabase
- **Features**: AI prompts, multi-threaded analysis, auto-save

### Analytics Dashboard
- **File**: `src/components/Dashboard.tsx`
- **Technology**: Recharts + Groq AI
- **Features**: Multi-source data, trend analysis, AI insights

### Mood Garden
- **File**: `src/components/MoodGarden.tsx`
- **Technology**: HTML5 Canvas
- **Features**: Interactive planting, mood visualization, animations

## 🔄 Data Flow

### User Authentication
1. User signs up/logs in via Supabase Auth
2. Profile automatically created via database trigger
3. Session persisted in localStorage
4. RLS policies enforce data isolation

### AI Integration
1. User input captured in components
2. API calls to Groq with context and prompts
3. Responses processed and displayed
4. Data saved to Supabase with user association

### Real-time Features
1. Camera/microphone access requested
2. Real-time processing in browser
3. Results displayed with animations
4. Data logged to database for analytics

## 📊 Performance Metrics

### Bundle Analysis
- Optimized component loading
- Tree-shaking enabled
- Minimal external dependencies
- Efficient asset management

### Runtime Performance
- React 18 concurrent features
- Optimized re-rendering
- Efficient state management
- Memory leak prevention

## 🛠️ Maintenance & Updates

### Code Organization
- Modular component structure
- Consistent naming conventions
- Clear separation of concerns
- Reusable utility functions

### Documentation
- Comprehensive README
- Inline code comments
- Type definitions
- API documentation

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Maintainer**: Aurora Development Team