import React from 'react';

interface AuroraLogoProps {
  className?: string;
  size?: number;
}

const AuroraLogo: React.FC<AuroraLogoProps> = ({ className = "", size = 80 }) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="aurora-logo-glow"
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="auroraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer Crescent Ring */}
        <path
          d="M100 20 C 140 20, 180 60, 180 100 C 180 140, 140 180, 100 180 C 80 180, 60 160, 60 140 C 60 120, 80 100, 100 100 C 120 100, 140 120, 140 140 C 140 160, 120 180, 100 180"
          fill="url(#auroraGradient)"
          stroke="none"
          filter="url(#glow)"
          opacity="0.9"
        />

        {/* Inner Dark Circle */}
        <circle
          cx="100"
          cy="100"
          r="50"
          fill="#0f172a"
          stroke="url(#auroraGradient)"
          strokeWidth="2"
          opacity="0.95"
        />

        {/* Heart Icon */}
        <path
          d="M100 85 C 95 75, 80 75, 80 90 C 80 105, 100 120, 100 120 C 100 120, 120 105, 120 90 C 120 75, 105 75, 100 85 Z"
          fill="url(#heartGradient)"
          filter="url(#glow)"
        />

        {/* Sparkle Stars */}
        <g fill="url(#auroraGradient)" filter="url(#glow)">
          {/* Top Right Star */}
          <path
            d="M130 70 L132 75 L137 75 L133 78 L135 83 L130 80 L125 83 L127 78 L123 75 L128 75 Z"
            opacity="0.8"
          />
          
          {/* Top Left Star */}
          <path
            d="M75 65 L76 68 L79 68 L77 70 L78 73 L75 71 L72 73 L73 70 L71 68 L74 68 Z"
            opacity="0.9"
          />
          
          {/* Bottom Right Small Star */}
          <circle cx="125" cy="125" r="2" opacity="0.7" />
          
          {/* Top Small Star */}
          <circle cx="105" cy="55" r="1.5" opacity="0.6" />
        </g>

        {/* Aurora Flow Effect */}
        <path
          d="M40 100 Q 70 80, 100 100 T 160 100"
          stroke="url(#auroraGradient)"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
          className="aurora-flow"
        />
      </svg>
      
      <style>{`
        .aurora-logo-glow {
          filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.3));
          animation: aurora-pulse 3s ease-in-out infinite;
        }
        
        .aurora-flow {
          animation: aurora-flow 4s ease-in-out infinite;
        }
        
        @keyframes aurora-pulse {
          0%, 100% { 
            filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.3));
          }
          50% { 
            filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.5));
          }
        }
        
        @keyframes aurora-flow {
          0%, 100% { 
            opacity: 0.3;
            transform: translateX(0px);
          }
          50% { 
            opacity: 0.6;
            transform: translateX(5px);
          }
        }
      `}</style>
    </div>
  );
};

export default AuroraLogo;
