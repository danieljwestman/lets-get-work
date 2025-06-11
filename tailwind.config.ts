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
				'float-1': {
					'0%, 100%': {
						transform: 'translateY(0px) translateX(0px)',
						opacity: '0.6'
					},
					'25%': {
						transform: 'translateY(-20px) translateX(10px)',
						opacity: '0.8'
					},
					'50%': {
						transform: 'translateY(-10px) translateX(-15px)',
						opacity: '0.4'
					},
					'75%': {
						transform: 'translateY(-25px) translateX(5px)',
						opacity: '0.7'
					}
				},
				'float-2': {
					'0%, 100%': {
						transform: 'translateY(0px) translateX(0px)',
						opacity: '0.6'
					},
					'33%': {
						transform: 'translateY(-15px) translateX(-10px)',
						opacity: '0.8'
					},
					'66%': {
						transform: 'translateY(-25px) translateX(8px)',
						opacity: '0.4'
					}
				},
				'float-3': {
					'0%, 100%': {
						transform: 'translateY(0px) translateX(0px)',
						opacity: '0.6'
					},
					'25%': {
						transform: 'translateY(-30px) translateX(-5px)',
						opacity: '0.8'
					},
					'50%': {
						transform: 'translateY(-15px) translateX(12px)',
						opacity: '0.4'
					},
					'75%': {
						transform: 'translateY(-20px) translateX(-8px)',
						opacity: '0.7'
					}
				},
				'float-4': {
					'0%, 100%': {
						transform: 'translateY(0px) translateX(0px)',
						opacity: '0.7'
					},
					'40%': {
						transform: 'translateY(-18px) translateX(6px)',
						opacity: '0.9'
					},
					'80%': {
						transform: 'translateY(-12px) translateX(-10px)',
						opacity: '0.5'
					}
				},
				'float-5': {
					'0%, 100%': {
						transform: 'translateY(0px) translateX(0px)',
						opacity: '0.6'
					},
					'30%': {
						transform: 'translateY(-22px) translateX(-7px)',
						opacity: '0.8'
					},
					'60%': {
						transform: 'translateY(-8px) translateX(15px)',
						opacity: '0.4'
					}
				},
				'float-6': {
					'0%, 100%': {
						transform: 'translateY(0px) translateX(0px)',
						opacity: '0.7'
					},
					'35%': {
						transform: 'translateY(-16px) translateX(9px)',
						opacity: '0.9'
					},
					'70%': {
						transform: 'translateY(-28px) translateX(-4px)',
						opacity: '0.5'
					}
				},
				'float-7': {
					'0%, 100%': {
						transform: 'translateY(0px) translateX(0px)',
						opacity: '0.6'
					},
					'45%': {
						transform: 'translateY(-14px) translateX(-11px)',
						opacity: '0.8'
					},
					'90%': {
						transform: 'translateY(-24px) translateX(7px)',
						opacity: '0.4'
					}
				},
				'float-8': {
					'0%, 100%': {
						transform: 'translateY(0px) translateX(0px)',
						opacity: '0.7'
					},
					'25%': {
						transform: 'translateY(-26px) translateX(3px)',
						opacity: '0.9'
					},
					'50%': {
						transform: 'translateY(-6px) translateX(-12px)',
						opacity: '0.5'
					},
					'75%': {
						transform: 'translateY(-19px) translateX(8px)',
						opacity: '0.8'
					}
				},
				'timeline-dots': {
					'0%': {
						backgroundPosition: '0 0'
					},
					'100%': {
						backgroundPosition: '0 -60px'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float-1': 'float-1 8s ease-in-out infinite',
				'float-2': 'float-2 7s ease-in-out infinite',
				'float-3': 'float-3 9s ease-in-out infinite',
				'float-4': 'float-4 6s ease-in-out infinite',
				'float-5': 'float-5 10s ease-in-out infinite',
				'float-6': 'float-6 7.5s ease-in-out infinite',
				'float-7': 'float-7 8.5s ease-in-out infinite',
				'float-8': 'float-8 9.5s ease-in-out infinite',
				'timeline-dots-mobile': 'timeline-dots 2.5s linear infinite',
				'timeline-dots-desktop': 'timeline-dots 3s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
