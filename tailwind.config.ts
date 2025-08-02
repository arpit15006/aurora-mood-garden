import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Aurora Northern Lights Theme
				aurora: {
					'deep-blue': '#0a0f1c',
					'midnight': '#1a2332',
					'electric-blue': '#2dd4bf',
					'purple': '#8b5cf6',
					'pink': '#ec4899',
					'green': '#10b981',
					'teal': '#14b8a6',
					'cyan': '#06b6d4'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'aurora-flow': {
					'0%': {
						transform: 'translateX(-100%) skewX(-15deg)',
						opacity: '0'
					},
					'50%': {
						transform: 'translateX(0%) skewX(0deg)',
						opacity: '1'
					},
					'100%': {
						transform: 'translateX(100%) skewX(15deg)',
						opacity: '0'
					}
				},
				'aurora-dance': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg) scale(1)',
						opacity: '0.6'
					},
					'25%': {
						transform: 'translateY(-10px) rotate(1deg) scale(1.05)',
						opacity: '0.8'
					},
					'50%': {
						transform: 'translateY(-5px) rotate(-1deg) scale(1.1)',
						opacity: '0.9'
					},
					'75%': {
						transform: 'translateY(-15px) rotate(0.5deg) scale(1.02)',
						opacity: '0.7'
					}
				},
				'aurora-waves': {
					'0%': {
						transform: 'translateX(-50%) scaleY(1)',
						opacity: '0.3'
					},
					'50%': {
						transform: 'translateX(0%) scaleY(1.2)',
						opacity: '0.5'
					},
					'100%': {
						transform: 'translateX(50%) scaleY(1)',
						opacity: '0.3'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-20px)'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-200% 0'
					},
					'100%': {
						backgroundPosition: '200% 0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'aurora-flow': 'aurora-flow 8s ease-in-out infinite',
				'aurora-dance': 'aurora-dance 20s ease-in-out infinite',
				'aurora-waves': 'aurora-waves 15s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
