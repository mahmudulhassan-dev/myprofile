/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'aurora-bg': '#f3f4f6', // Fallback
                'aurora-purple': '#E6E6FA',
                'aurora-pink': '#FFD1DC',
                'aurora-blue': '#87CEEB',
                'primary-purple': '#8B5CF6',
                'primary-text': '#1f2937', // Slate 800
                'secondary-text': '#6b7280', // Slate 500
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'blob': 'blob 7s infinite',
                'gradient-x': 'gradient-x 15s ease infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                'gradient-x': {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center',
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center',
                    },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            },
            backgroundImage: {
                'aurora-gradient': 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', // Clean base
                'soft-gradient': 'linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)', // Example soft
            }
        },
    },
    plugins: [],
}
