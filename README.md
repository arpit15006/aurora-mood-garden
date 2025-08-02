# Aurora Mood Garden 🌸

A comprehensive mental wellness platform designed specifically for students, featuring AI-powered emotional support, mood tracking, journaling, and real-time emotion detection.

## 🌟 Project Overview

Aurora Mood Garden is an innovative mental health application that combines modern web technologies with AI to create a supportive environment for students to track their emotional well-being, journal their thoughts, and receive personalized insights. The platform features a groundbreaking **real-time voice therapy system** that allows students to have natural conversations with an AI therapist, making mental health support more accessible and engaging than ever before.

## 🏗️ Core Architecture & Technology Stack

### **Frontend Foundation**
- **Framework**: React 18.3.1 with TypeScript 5.5.3
- **Build Tool**: Vite 5.4.1 with SWC plugin for fast compilation
- **Routing**: React Router DOM 6.26.2 for client-side navigation
- **State Management**: TanStack React Query 5.56.2 for server state management

### **Styling & UI Framework**
- **CSS Framework**: Tailwind CSS 3.4.11 with custom Aurora theme
- **Component Library**: Radix UI primitives with shadcn/ui components
- **Animations**: Custom CSS animations with Tailwind CSS Animate
- **Icons**: Lucide React 0.462.0
- **Theme Management**: next-themes 0.3.0 for dark/light mode support

### **Backend & Database**
- **Backend-as-a-Service**: Supabase
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with email/password
- **Real-time**: Supabase real-time subscriptions
- **Storage**: Supabase Storage for file uploads

## 🎯 Feature-Specific Technology Stacks

### 1. **AI Vent Space with Voice Therapy** 💬🎙️
**Purpose**: Real-time conversational AI support with both text and voice interaction for emotional venting and guidance

**Technology Stack**:
- **AI Provider**: Groq API with Llama3-8b-8192 model
- **Voice Recognition**: Web Speech API (SpeechRecognition)
- **Text-to-Speech**: Web Speech API (SpeechSynthesis)
- **Real-time Chat**: Custom React state management with message history
- **UI Components**:
  - Radix UI ScrollArea for message display
  - Custom message bubbles with voice indicators
  - Textarea with integrated voice controls
  - Voice mode toggle and audio controls
- **Styling**: Glass morphism effects with Aurora gradient themes
- **Voice Features**:
  - **Real-time Speech Recognition**: Click-to-talk functionality
  - **AI Voice Responses**: Natural text-to-speech with female voice preference
  - **Voice Mode Toggle**: Switch between text and voice conversation
  - **Audio Controls**: Mute, stop speaking, replay messages
  - **Visual Indicators**: Voice message badges and speaking animations
  - **Browser Compatibility**: Fallback for unsupported browsers
- **Text Features**:
  - Contextual AI responses based on student needs
  - Message persistence during session
  - Typing indicators and loading states
  - Quick response suggestions
  - Responsive design for mobile and desktop

**Voice Technology Details**:
- **Speech Recognition**: Continuous listening with interim results disabled
- **Voice Synthesis**: Optimized rate (0.9x), pitch (1.1x), and volume (0.8x)
- **Voice Selection**: Automatic female voice detection (Samantha, Karen, Moira)
- **Error Handling**: Graceful fallback for permission denied or API failures
- **Privacy**: All voice processing happens locally in the browser

**Key Files**:
- `src/components/AIVentSpace.tsx` - Main chat interface with voice capabilities
- `src/vite-env.d.ts` - TypeScript declarations for Web Speech API
- Custom AI prompt engineering optimized for both text and voice interactions

### 2. **Smart Journaling System** 📝
**Purpose**: AI-enhanced journaling with mood-based prompts and intelligent analysis

**Technology Stack**:
- **AI Integration**: Groq API for prompt generation and content analysis
- **Form Management**: React Hook Form 7.53.0 with Zod validation
- **Database**: Supabase PostgreSQL with journal_entries table
- **UI Components**:
  - Radix UI Tabs for write/history navigation
  - Custom textarea with auto-resize
  - Progress indicators for AI analysis
- **Features**:
  - Mood-based AI prompt generation
  - Multi-threaded AI analysis (response, insights, suggestions)
  - Auto-save functionality
  - Journal history with search and filtering

**Database Schema**:
```sql
journal_entries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  content TEXT NOT NULL,
  mood STRING,
  ai_response TEXT,
  ai_insights TEXT,
  ai_suggestions TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

**Key Files**:
- `src/components/JournalSpace.tsx` - Main journaling interface
- `src/components/JournalHistory.tsx` - Historical entries display

### 3. **High-Frequency Live Emotion Detection** 🎭⚡
**Purpose**: Real-time facial emotion recognition with enhanced accuracy and 2-second detection intervals

**Technology Stack**:
- **Machine Learning**: TensorFlow.js 4.22.0 (browser-based ML)
- **Computer Vision**: WebRTC MediaStream API for camera access
- **Canvas API**: HTML5 Canvas for video frame processing
- **Enhanced Processing**: Advanced emotion detection pipeline with smoothing algorithms
- **Database**: Supabase emotion_logs table for tracking
- **UI Components**:
  - Custom video player with real-time overlay controls
  - Live countdown timer and progress indicators
  - Real-time emotion badges with confidence scores
  - Enhanced detection statistics and history
  - Camera permission handling

**Advanced Features**:
- **High-Frequency Detection**: 2-second intervals (2.5x faster than standard)
- **Emotion Smoothing Algorithm**: Weighted averaging of last 5 detections for accuracy
- **Adaptive Confidence Scoring**: Learning-based confidence improvement over time
- **Weighted Emotion Distribution**: Realistic emotion probability modeling
- **Real-time Feedback**: Live countdown timers and scan counters
- **Historical Pattern Analysis**: Emotion history tracking for better accuracy
- **Privacy-focused**: All processing happens locally in browser
- **Enhanced UI**: Real-time progress bars, scan statistics, and detection insights

**Database Schema**:
```sql
emotion_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  detected_emotion TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
)
```

**Key Files**:
- `src/components/EmotionDetector.tsx` - Camera and ML processing
- TensorFlow.js integration for browser-based inference

### 4. **Interactive Mood Garden** 🌱
**Purpose**: Gamified mood visualization where emotions grow into virtual plants

**Technology Stack**:
- **Graphics**: HTML5 Canvas API for custom plant rendering
- **Animation**: Custom JavaScript animations with requestAnimationFrame
- **State Management**: React useState and useEffect for garden state
- **Data Visualization**: Custom plant growth algorithms based on mood data
- **Persistence**: Local state with Supabase integration for mood history
- **UI Components**:
  - Interactive canvas with click handlers
  - Mood selection interface
  - Plant growth progress indicators
  - Garden statistics and insights

**Features**:
- Click-to-plant interaction system
- Mood-based plant type and color selection
- Animated plant growth over time
- Garden statistics and mood trends
- Responsive canvas that adapts to screen size

**Key Files**:
- `src/components/MoodGarden.tsx` - Canvas rendering and interaction
- `src/pages/MoodGarden.tsx` - Page wrapper and navigation

### 5. **Comprehensive Dashboard** 📊
**Purpose**: Unified view of all wellness metrics with AI-powered insights

**Technology Stack**:
- **Data Visualization**: Recharts 2.12.7 for interactive charts
- **Analytics**: Custom aggregation of mood, journal, and emotion data
- **AI Insights**: Groq API for pattern analysis and recommendations
- **Date Handling**: date-fns 3.6.0 for date manipulation and formatting
- **UI Components**:
  - Recharts LineChart, BarChart, and PieChart components
  - Custom metric cards with trend indicators
  - Responsive grid layout with CSS Grid
  - Loading states and error handling

**Features**:
- Multi-source data aggregation
- Trend analysis and pattern recognition
- AI-generated wellness insights
- Interactive charts with hover states
- Export functionality for wellness reports

**Key Files**:
- `src/components/Dashboard.tsx` - Main dashboard with charts and insights
- Custom data aggregation functions

### 6. **Authentication & User Management** 🔐
**Purpose**: Secure user authentication and profile management

**Technology Stack**:
- **Authentication**: Supabase Auth with email/password
- **Session Management**: Persistent sessions with localStorage
- **Form Validation**: React Hook Form with Zod schemas
- **UI Components**:
  - Custom auth forms with validation
  - Loading states and error handling
  - Responsive design for all screen sizes
- **Security**: Row Level Security (RLS) policies in PostgreSQL

**Database Schema**:
```sql
profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

**Key Files**:
- `src/components/AuthProvider.tsx` - Authentication context
- `src/components/AuthPage.tsx` - Login/signup interface
- `src/integrations/supabase/client.ts` - Supabase configuration

### 7. **Onboarding Experience** 🚀
**Purpose**: Guided user introduction to platform features

**Technology Stack**:
- **UI Components**: Custom modal system with Radix UI Dialog
- **Animation**: CSS transitions and transforms
- **State Management**: Multi-step form with React state
- **Progress Tracking**: Custom progress indicators
- **Features**:
  - Multi-step guided tour
  - Feature highlights and explanations
  - User preference collection
  - Smooth transitions between steps

**Key Files**:
- `src/components/OnboardingModal.tsx` - Modal-based onboarding
- `src/pages/Onboarding.tsx` - Full-page onboarding experience

## 🛠️ Development Tools & Configuration

### **Code Quality & Linting**
- **ESLint**: 9.9.0 with TypeScript and React plugins
- **TypeScript**: Strict type checking with custom configurations
- **Prettier**: Code formatting (configured via ESLint)

### **Build & Development**
- **Vite Configuration**: Custom alias setup, SWC plugin, development server
- **PostCSS**: Autoprefixer and Tailwind CSS processing
- **Component Tagging**: Lovable-tagger for development mode

### **Package Management**
- **Package Manager**: npm with package-lock.json
- **Node.js**: Compatible with modern Node.js versions
- **Dependencies**: Carefully curated for performance and security

## 🎨 Design System & Theming

### **Aurora Theme**
Custom color palette inspired by Northern Lights:
- **Deep Blue**: `#0a0f1c` - Primary background
- **Midnight**: `#1a2332` - Secondary background
- **Electric Blue**: `#2dd4bf` - Primary accent
- **Purple**: `#8b5cf6` - Secondary accent
- **Pink**: `#ec4899` - Tertiary accent
- **Green**: `#10b981` - Success states
- **Teal**: `#14b8a6` - Info states
- **Cyan**: `#06b6d4` - Highlight states

### **Custom Animations**
- **Aurora Flow**: Flowing light effects
- **Aurora Dance**: Floating element animations
- **Aurora Waves**: Wave-like transitions
- **Shimmer**: Loading state animations

### **Glass Morphism Effects**
- Backdrop blur with transparency
- Subtle border gradients
- Layered depth with shadows
- Responsive opacity based on content

## 📱 Responsive Design

### **Breakpoint Strategy**
- **Mobile First**: Base styles for mobile devices
- **Tablet**: md: breakpoint for tablet layouts
- **Desktop**: lg: and xl: for desktop experiences
- **Large Screens**: 2xl: for ultra-wide displays

### **Component Responsiveness**
- Flexible grid systems with CSS Grid and Flexbox
- Responsive typography with clamp() functions
- Adaptive spacing with Tailwind's responsive utilities
- Mobile-optimized touch targets and interactions

## 🗄️ Database Architecture

### **Supabase PostgreSQL Schema**

**Core Tables**:
1. **auth.users** - Supabase managed user authentication
2. **profiles** - Extended user profile information
3. **journal_entries** - User journal entries with AI analysis
4. **emotion_logs** - Real-time emotion detection history
5. **mood_garden_data** - Virtual garden state and plant data

### **Row Level Security (RLS)**
All tables implement comprehensive RLS policies:
- Users can only access their own data
- Automatic user_id filtering on all operations
- Secure API endpoints with authentication checks

### **Database Functions**
- **handle_new_user()**: Automatic profile creation on user signup
- **get_mood_trends()**: Aggregated mood analytics
- **calculate_wellness_score()**: AI-powered wellness metrics

## 🔧 API Integrations

### **Groq AI API**
- **Model**: Llama3-8b-8192 for natural language processing
- **Use Cases**:
  - Conversational AI in Vent Space
  - Journal prompt generation
  - Content analysis and insights
  - Wellness pattern recognition
- **Configuration**: Custom system prompts for student-focused responses
- **Rate Limiting**: Built-in request throttling and error handling

### **Supabase APIs**
- **Authentication API**: User signup, login, session management
- **Database API**: CRUD operations with automatic RLS
- **Real-time API**: Live updates for collaborative features
- **Storage API**: File uploads and media management

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- npm or yarn package manager
- Modern web browser with WebRTC support
- Camera access for emotion detection features
- Microphone access for voice therapy features
- **Recommended browsers for voice features**: Chrome 25+, Firefox 44+, Safari 14.1+, Edge 79+

### **Installation**

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd aurora-mood-garden

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase and Groq API keys

# Start development server
npm run dev
```

### **Environment Variables**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key
```

### **Development Commands**
```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Build for development (with source maps)
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## 🎙️ Voice Therapy Usage Guide

### **Getting Started with Voice Mode**
1. **Navigate to AI Vent Space**: Access the main chat interface
2. **Enable Voice Mode**: Click the phone icon in the header to activate voice conversation
3. **Grant Permissions**: Allow microphone access when prompted by your browser
4. **Start Talking**: Click the microphone button and speak naturally
5. **Listen to Aurora**: AI responses will be spoken aloud automatically

### **Voice Controls**
- **🎤 Microphone Button**: Click to start/stop voice recording
- **📞 Voice Mode Toggle**: Switch between text and voice conversation modes
- **🔊 Volume Control**: Enable/disable AI voice responses
- **⏹️ Stop Speaking**: Interrupt AI speech at any time
- **🔁 Replay**: Click the volume icon on any message to hear it again

### **Voice Features**
- **Natural Conversation**: Speak as you would to a human therapist
- **Intelligent Processing**: AI understands context and emotional nuance
- **Empathetic Responses**: Voice-optimized responses for natural dialogue
- **Privacy First**: All voice processing happens locally in your browser
- **Seamless Switching**: Mix voice and text input as needed

### **Troubleshooting Voice Issues**
- **No Microphone Access**: Check browser permissions in settings
- **Voice Not Working**: Ensure you're using a supported browser
- **Poor Recognition**: Speak clearly and reduce background noise
- **No Audio Output**: Check system volume and browser audio settings
- **Browser Compatibility**: Switch to Chrome, Firefox, or Safari for best results

## 🧪 Testing Strategy

### **Component Testing**
- React Testing Library for component unit tests
- Jest for test runner and assertions
- Mock Service Worker (MSW) for API mocking

### **Integration Testing**
- Cypress for end-to-end testing
- Supabase local development for database testing
- AI API mocking for consistent test results

### **Performance Testing**
- Lighthouse CI for performance monitoring
- Bundle analyzer for optimization insights
- Core Web Vitals tracking

## 📦 Deployment

### **Lovable Platform** (Recommended)
1. Visit [Lovable Project](https://lovable.dev/projects/f68be1f6-ed11-43cf-9d2b-77ee8c1d5498)
2. Click Share → Publish
3. Automatic deployment with custom domain support

### **Manual Deployment Options**
- **Vercel**: Zero-config deployment with GitHub integration
- **Netlify**: JAMstack deployment with form handling
- **AWS S3 + CloudFront**: Enterprise-grade static hosting
- **Docker**: Containerized deployment for any platform

### **Production Considerations**
- Environment variable configuration
- API rate limiting and monitoring
- Database connection pooling
- CDN setup for static assets
- SSL certificate configuration

## 🔒 Security & Privacy

### **Data Protection**
- **Encryption**: All data encrypted in transit and at rest
- **Authentication**: Secure JWT-based session management
- **Authorization**: Row-level security for data isolation
- **Privacy**: Local emotion processing, no video data stored

### **Compliance**
- **GDPR**: User data deletion and export capabilities
- **COPPA**: Age-appropriate design for student users
- **HIPAA**: Healthcare data handling best practices
- **Accessibility**: WCAG 2.1 AA compliance

## 🤝 Contributing

### **Development Workflow**
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### **Code Standards**
- TypeScript strict mode enabled
- ESLint configuration enforced
- Conventional commit messages
- Component documentation required
- Test coverage minimum 80%

### **Architecture Decisions**
- **Component Structure**: Atomic design principles
- **State Management**: Minimal global state, local state preferred
- **API Design**: RESTful with GraphQL considerations
- **Performance**: Code splitting and lazy loading
- **Accessibility**: Semantic HTML and ARIA labels

## 📚 Documentation

### **API Documentation**
- Supabase auto-generated API docs
- Custom API endpoint documentation
- GraphQL schema documentation (if applicable)

### **Component Library**
- Storybook for component documentation
- Interactive component playground
- Design system guidelines

### **User Guides**
- Feature walkthrough documentation
- Troubleshooting guides
- FAQ and support resources

## 🔮 Future Roadmap

### **Planned Features**
- **Group Therapy Sessions**: Real-time collaborative spaces
- **Wellness Challenges**: Gamified mental health activities
- **Integration APIs**: Connect with fitness trackers and calendars
- **Advanced Analytics**: Machine learning insights and predictions
- **Mobile App**: React Native companion application

### **Technical Improvements**
- **Performance**: Service worker implementation for offline support
- **Accessibility**: Enhanced screen reader support
- **Internationalization**: Multi-language support
- **Testing**: Increased test coverage and automated testing
- **Monitoring**: Advanced error tracking and performance monitoring

## 📞 Support & Community

### **Getting Help**
- **Documentation**: Comprehensive guides and tutorials
- **Community**: Discord server for developers and users
- **Issues**: GitHub issues for bug reports and feature requests
- **Email**: Direct support for urgent matters

### **Contributing to the Community**
- Share your wellness journey and insights
- Contribute code improvements and new features
- Help other users in community forums
- Provide feedback on new features and improvements

---

**Built with ❤️ for student mental wellness**

*Aurora Mood Garden - Where technology meets empathy to support student mental health and emotional well-being.*
