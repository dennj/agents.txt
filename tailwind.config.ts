module.exports = {
  content: [
    './pages/**/*.{vue,js}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js}',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
    './content/**/*.md',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
        screens: {
          lg: '1200px',
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography')
  ],
  daisyui: {
    themes: [
      {
        agentstxt: {
          "primary": "#2ECC71",  // Emerland green
          "secondary": "#4F46E5", // Deep Indigo - AI & Technology
          "orange": "#E67E22",
          "accent": "#10B981",    // Emerald Green - Trust & Growth
          "neutral": "#1E293B",   // Slate Gray - Dark Mode UI
          "base-100": "#111827",  // Midnight Blue - Deep Contrast
          "info": "#3B82F6",      // Azure Blue - Intelligence & Data
          "success": "#22C55E",   // Lime Green - Success in AI Ops
          "warning": "#F59E0B",   // Amber Yellow - AI Feedback
          "error": "#EF4444",     // Red Alert - Critical AI Errors
        },
      },
    ],
  },
};
