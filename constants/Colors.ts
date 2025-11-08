/**
 * SLock Design System - Colors
 * Theme: Playfully Serious · Futuristic · Youthful · Competitive
 * Mode: Dark by default
 * Inspired by: Duolingo × Discord × Apple Fitness
 */

export const Colors = {
  // Primary: Electric Teal / Mint Green
  primary: {
    50: '#E6FFFB',
    100: '#B3FFF4',
    200: '#80FFED',
    300: '#4DFFE6',
    400: '#1AFFDF',
    500: '#00FFC6',  // Main - Electric Teal
    600: '#00CC9E',
    700: '#009977',
    800: '#00664F',
    900: '#003328',
  },

  // Accent: Vibrant Orange / Coral
  accent: {
    50: '#FFF4EB',
    100: '#FFE0C2',
    200: '#FFCB99',
    300: '#FFB770',
    400: '#FFA247',
    500: '#FF8A00',  // Main - Vibrant Orange
    600: '#CC6E00',
    700: '#995300',
    800: '#663700',
    900: '#331C00',
  },

  // Error/Lock: Crimson Pink-Red
  error: {
    50: '#FFEBEE',
    100: '#FFC2C9',
    200: '#FF99A5',
    300: '#FF7080',
    400: '#FF475C',
    500: '#FF3B3B',  // Main - Crimson Pink-Red
    600: '#CC2F2F',
    700: '#992323',
    800: '#661818',
    900: '#330C0C',
  },

  // Secondary/Social: Purple-Blue gradient range
  secondary: {
    purple: '#6C63FF',    // Purple end
    lavender: '#8B84FF',
    periwinkle: '#A9A4FF',
    skyBlue: '#89CBF0',
    cyan: '#4BE1EC',      // Blue end
  },

  // Success/Growth (for streaks, achievements)
  success: {
    50: '#E6FFF6',
    100: '#B3FFE6',
    200: '#80FFD6',
    300: '#4DFFC6',
    400: '#1AFFB6',
    500: '#00FFC6',  // Using primary teal for consistency
    600: '#00E6B1',
    700: '#00B38B',
    800: '#008066',
    900: '#004D40',
  },

  // Warning (for limits, caution)
  warning: {
    50: '#FFF9E6',
    100: '#FFECB3',
    200: '#FFDF80',
    300: '#FFD24D',
    400: '#FFC61A',
    500: '#FFB800',  // Warm yellow
    600: '#CC9300',
    700: '#996E00',
    800: '#664900',
    900: '#332500',
  },

  // Dark backgrounds (matte gradient)
  background: {
    primary: '#121212',      // Base dark
    secondary: '#1E1E1E',    // Slightly lighter
    tertiary: '#252525',     // Card/elevated surfaces
    elevated: '#2A2A2A',     // Hover/active states
  },

  // Neutral grays
  neutral: {
    black: '#000000',
    900: '#0A0A0A',
    800: '#1A1A1A',
    700: '#2D2D2D',
    600: '#404040',
    500: '#666666',
    400: '#999999',
    300: '#B3B3B3',
    200: '#CCCCCC',
    100: '#E6E6E6',
    50: '#F5F5F5',
    white: '#FFFFFF',
  },

  // Text colors (for dark mode)
  text: {
    primary: '#FFFFFF',         // Main text
    secondary: '#B3B3B3',       // Secondary text
    tertiary: '#808080',        // Tertiary/muted
    disabled: '#4D4D4D',        // Disabled state
    inverse: '#121212',         // Text on light backgrounds
    accent: '#00FFC6',          // Accent text
    error: '#FF3B3B',           // Error text
  },

  // Borders
  border: {
    subtle: 'rgba(255, 255, 255, 0.08)',
    light: 'rgba(255, 255, 255, 0.12)',
    medium: 'rgba(255, 255, 255, 0.18)',
    strong: 'rgba(255, 255, 255, 0.24)',
    accent: '#00FFC6',
  },

  // Tab navigation colors
  tabActive: '#00FFC6',        // Electric Teal
  tabInactive: '#666666',

  // Gradients
  gradient: {
    background: ['#121212', '#1E1E1E'] as const,           // Main background gradient
    primary: ['#00FFC6', '#00CC9E'] as const,              // Electric teal gradient
    accent: ['#FF8A00', '#FF6B00'] as const,               // Orange gradient
    social: ['#6C63FF', '#4BE1EC'] as const,               // Purple to blue
    success: ['#00FFC6', '#00E6B1'] as const,              // Success gradient
    error: ['#FF3B3B', '#CC2F2F'] as const,                // Error gradient
    glow: ['#00FFC6', '#00FFFF', '#00FFC6'] as const,      // Glow effect
  },

  // Glow effects for wins and streaks
  glow: {
    primary: 'rgba(0, 255, 198, 0.4)',            // Teal glow
    accent: 'rgba(255, 138, 0, 0.4)',             // Orange glow
    success: 'rgba(0, 255, 198, 0.6)',            // Success glow
    subtle: 'rgba(0, 255, 198, 0.15)',            // Subtle glow
  },

  // Character theme options
  characterTheme: {
    digitalCreature: '#00FFC6',    // Neon cyberpunk - teal
    growingPlant: '#4BE1EC',       // Soft gradient nature - cyan
    miniAvatar: '#FF8A00',         // Cartoon minimalist - orange
    energyCore: '#6C63FF',         // Sci-fi glow - purple
  },

  // Onboarding-specific (keeping for compatibility)
  onboarding: {
    darkPurple: ['#1a0b2e', '#2d1b4e'] as const,
    darkBlue: ['#0f1729', '#1e2a4a'] as const,
    deepSpace: ['#0a0e1f', '#1a1f3a'] as const,
    vibrantPurple: ['#6C63FF', '#9D4EDD'] as const,
    electricBlue: ['#4361EE', '#3A86FF'] as const,
    coralOrange: ['#FF8A00', '#FF8E53'] as const,
    pinkPurple: ['#F72585', '#B5179E'] as const,
    glowBlue: ['#4CC9F0', '#4361EE'] as const,
    glowPink: ['#FF006E', '#FB5607'] as const,
    overlay: 'rgba(10, 14, 31, 0.85)',
    cardGlass: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.18)',
    glassBackground: 'rgba(255, 255, 255, 0.08)',
    glassBackgroundHover: 'rgba(255, 255, 255, 0.12)',
    glassShadow: 'rgba(0, 0, 0, 0.1)',
    // Blue gradients (for legacy onboarding compatibility)
    blueGradient1: ['#0EA5E9', '#1E40AF'] as const,
    blueGradient2: ['#3B82F6', '#1E3A8A'] as const,
    blueGradient3: ['#60A5FA', '#2563EB'] as const,
    blueGradient4: ['#0284C7', '#0C4A6E'] as const,
  },

  // Shadows with glow
  shadow: {
    sm: 'rgba(0, 0, 0, 0.2)',
    md: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.3)',  // Alias for md
    lg: 'rgba(0, 0, 0, 0.4)',
    dark: 'rgba(0, 0, 0, 0.5)',
    glow: 'rgba(0, 255, 198, 0.3)',          // Teal glow shadow
    glowOrange: 'rgba(255, 138, 0, 0.3)',    // Orange glow shadow
  },

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',

  // Legacy compatibility
  surface: '#1E1E1E',  // Alias for background.secondary
  danger: {  // Alias for error
    50: '#FFEBEE',
    100: '#FFC2C9',
    200: '#FF99A5',
    300: '#FF7080',
    400: '#FF475C',
    500: '#FF3B3B',
    600: '#CC2F2F',
    700: '#992323',
    800: '#661818',
    900: '#330C0C',
  },
};

export default Colors;
