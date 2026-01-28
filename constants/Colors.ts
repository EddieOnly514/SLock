/**
 * SLock Design System - Colors
 * Theme: White background · Coral-Red primary (crab mascot)
 * Mode: Light theme
 * 
 * Primary color extracted from crab mascot logo
 */

export const Colors = {
  // Base (White / Surfaces)
  background: {
    primary: '#FFFFFF',      // Background
    secondary: '#F8F8FA',    // Surface / Cards
    tertiary: '#F0F0F5',     // Elevated Surface
    elevated: '#F0F0F5',     // Alias for tertiary
  },

  // Primary (Coral-Red — from Crab Mascot)
  primary: {
    50: 'rgba(255, 90, 79, 0.08)',
    100: 'rgba(255, 90, 79, 0.12)',
    200: 'rgba(255, 90, 79, 0.18)',
    300: 'rgba(255, 90, 79, 0.25)',
    400: '#E65248',            // Darker coral
    500: '#FF5A4F',            // Primary Coral-Red (from crab)
    600: '#E65248',            // Pressed state
    700: '#CC4940',
    800: '#993730',
    900: '#662520',
    soft: 'rgba(255, 90, 79, 0.15)',   // Soft coral glow
  },

  // Secondary (Amber — Reward / Progress)
  // Use sparingly for: Streak flames, Milestones, Progress highlights, Mascot accents
  secondary: {
    50: 'rgba(255, 200, 61, 0.08)',
    100: 'rgba(255, 200, 61, 0.12)',
    200: 'rgba(255, 200, 61, 0.18)',
    300: 'rgba(255, 200, 61, 0.25)',
    400: '#E6B437',
    500: '#FFC83D',           // Amber
    600: '#E6B437',
    700: '#CC9F31',
    800: '#998A2B',
    900: '#665C1D',
    soft: 'rgba(255, 200, 61, 0.18)',  // Soft Amber (highlight)
  },

  // Accent (Amber alias for compatibility)
  accent: {
    50: 'rgba(255, 200, 61, 0.08)',
    100: 'rgba(255, 200, 61, 0.12)',
    200: 'rgba(255, 200, 61, 0.18)',
    300: 'rgba(255, 200, 61, 0.25)',
    400: '#E6B437',
    500: '#FFC83D',           // Amber
    600: '#E6B437',
    700: '#CC9F31',
    800: '#998A2B',
    900: '#665C1D',
  },

  // Error/Lock (Red alias for consistency)
  error: {
    50: 'rgba(255, 59, 59, 0.08)',
    100: 'rgba(255, 59, 59, 0.12)',
    200: 'rgba(255, 59, 59, 0.18)',
    300: 'rgba(255, 59, 59, 0.25)',
    400: '#E63535',
    500: '#FF3B3B',
    600: '#E63535',
    700: '#CC2F2F',
    800: '#992323',
    900: '#661818',
    soft: 'rgba(255, 59, 59, 0.15)',
  },

  // Success/Allowed (Muted Green — Informational only)
  // Green is never celebratory - no glow, no animation
  success: {
    50: 'rgba(76, 175, 80, 0.08)',
    100: 'rgba(76, 175, 80, 0.12)',
    200: 'rgba(76, 175, 80, 0.18)',
    300: 'rgba(76, 175, 80, 0.25)',
    400: '#45A049',
    500: '#4CAF50',           // Allowed / Unblocked (Muted Green)
    600: '#439646',
    700: '#357A38',
    800: '#2E6A31',
    900: '#1B4D1E',
  },

  // Warning (uses Amber)
  warning: {
    50: 'rgba(255, 200, 61, 0.08)',
    100: 'rgba(255, 200, 61, 0.12)',
    200: 'rgba(255, 200, 61, 0.18)',
    300: 'rgba(255, 200, 61, 0.25)',
    400: '#E6B437',
    500: '#FFC83D',
    600: '#E6B437',
    700: '#CC9F31',
    800: '#998A2B',
    900: '#665C1D',
  },

  // Neutral (Text & UI) - Light theme
  neutral: {
    black: '#0E0E10',
    900: '#1A1A1A',
    800: '#2D2D2D',
    700: '#404040',
    600: '#6B6B75',           // Muted / Disabled
    500: '#6B6B75',
    400: '#A1A1AA',           // Secondary Text
    300: '#D4D4D8',
    200: '#E4E4E7',
    100: '#F0F0F5',
    50: '#F8F8FA',
    white: '#FFFFFF',
  },

  // Text colors - Light theme
  text: {
    primary: '#1A1A1A',       // Primary Text (dark on light)
    secondary: '#6B6B75',     // Secondary Text
    tertiary: '#A1A1AA',      // Muted / Disabled
    disabled: '#A1A1AA',      // Muted / Disabled
    inverse: '#FFFFFF',       // Text on dark backgrounds
    accent: '#FF3B3B',        // Red accent text
    error: '#FF3B3B',         // Red error text
  },

  // Borders - Light theme
  border: {
    subtle: 'rgba(0, 0, 0, 0.06)',          // Divider / Border
    light: 'rgba(0, 0, 0, 0.08)',
    medium: 'rgba(0, 0, 0, 0.12)',
    strong: 'rgba(0, 0, 0, 0.18)',
    accent: '#FF3B3B',                       // Red accent border
    primary: '#FF3B3B',                      // Red primary border
  },

  // Tab navigation colors
  tabActive: '#FF3B3B',       // Red for active (action)
  tabInactive: '#A1A1AA',     // Muted gray

  // Gradients
  gradient: {
    background: ['#0E0E10', '#17171C'] as const,           // Main background gradient
    primary: ['#FF3B3B', '#E63535'] as const,              // Red gradient
    accent: ['#FFC83D', '#E6B437'] as const,               // Amber gradient
    surface: ['#17171C', '#1F1F26'] as const,              // Surface gradient
    success: ['#4CAF50', '#45A049'] as const,              // Muted green gradient (no glow)
    error: ['#FF3B3B', '#E63535'] as const,                // Error gradient
  },

  // Glow effects (use sparingly, only for rewards)
  glow: {
    primary: 'rgba(255, 59, 59, 0.4)',         // Red glow
    accent: 'rgba(255, 200, 61, 0.4)',         // Amber glow
    success: 'rgba(76, 175, 80, 0.2)',         // Muted green glow (subtle, informational)
    subtle: 'rgba(255, 200, 61, 0.15)',        // Subtle amber glow
    softRed: 'rgba(255, 59, 59, 0.15)',        // Soft red glow
    softAmber: 'rgba(255, 200, 61, 0.18)',     // Soft amber glow
  },

  // Character theme options (updated)
  characterTheme: {
    digitalCreature: '#FFC83D',    // Amber
    growingPlant: '#4CAF50',       // Muted green
    miniAvatar: '#FFC83D',         // Amber
    energyCore: '#FF3B3B',         // Red
  },

  // Onboarding-specific
  onboarding: {
    darkBase: ['#0E0E10', '#17171C'] as const,
    darkSurface: ['#17171C', '#1F1F26'] as const,
    deepSpace: ['#0E0E10', '#17171C'] as const,
    vibrantRed: ['#FF3B3B', '#E63535'] as const,
    vibrantAmber: ['#FFC83D', '#E6B437'] as const,
    overlay: 'rgba(14, 14, 16, 0.85)',
    cardGlass: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    glassBackground: 'rgba(255, 255, 255, 0.05)',
    glassBackgroundHover: 'rgba(255, 255, 255, 0.08)',
    glassShadow: 'rgba(0, 0, 0, 0.1)',
    // Legacy compatibility
    darkPurple: ['#0E0E10', '#17171C'] as const,
    darkBlue: ['#0E0E10', '#17171C'] as const,
    electricBlue: ['#FF3B3B', '#E63535'] as const,
    coralOrange: ['#FFC83D', '#E6B437'] as const,
    pinkPurple: ['#FF3B3B', '#E63535'] as const,
    glowBlue: ['#FF3B3B', '#E63535'] as const,
    glowPink: ['#FFC83D', '#E6B437'] as const,
    blueGradient1: ['#FF3B3B', '#E63535'] as const,
    blueGradient2: ['#FF3B3B', '#E63535'] as const,
    blueGradient3: ['#FF3B3B', '#E63535'] as const,
    blueGradient4: ['#FF3B3B', '#E63535'] as const,
  },

  // Shadows
  shadow: {
    sm: 'rgba(0, 0, 0, 0.3)',
    md: 'rgba(0, 0, 0, 0.4)',
    medium: 'rgba(0, 0, 0, 0.4)',
    lg: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.6)',
    glowRed: 'rgba(255, 59, 59, 0.3)',       // Red glow shadow
    glowAmber: 'rgba(255, 200, 61, 0.3)',    // Amber glow shadow
    glow: 'rgba(255, 59, 59, 0.3)',          // Default glow (red)
    glowOrange: 'rgba(255, 200, 61, 0.3)',   // Legacy alias for amber
  },

  // Overlay
  overlay: 'rgba(14, 14, 16, 0.7)',

  // Legacy compatibility
  surface: '#17171C',
  danger: {
    50: 'rgba(255, 59, 59, 0.08)',
    100: 'rgba(255, 59, 59, 0.12)',
    200: 'rgba(255, 59, 59, 0.18)',
    300: 'rgba(255, 59, 59, 0.25)',
    400: '#E63535',
    500: '#FF3B3B',
    600: '#E63535',
    700: '#CC2F2F',
    800: '#992323',
    900: '#661818',
  },

  // Specification colors (updated for new theme)
  spec: {
    // Reds (Primary)
    red50: 'rgba(255, 59, 59, 0.08)',
    red100: 'rgba(255, 59, 59, 0.12)',
    red200: 'rgba(255, 59, 59, 0.18)',
    red500: '#FF3B3B',
    red600: '#E63535',
    red700: '#CC2F2F',
    // Ambers (Secondary)
    amber50: 'rgba(255, 200, 61, 0.08)',
    amber100: 'rgba(255, 200, 61, 0.12)',
    amber400: '#E6B437',
    amber500: '#FFC83D',
    amber600: '#E6B437',
    // Grays
    gray50: '#F5F5F7',
    gray100: '#E4E4E7',
    gray200: '#D4D4D8',
    gray300: '#A1A1AA',
    gray400: '#A1A1AA',
    gray500: '#6B6B75',
    gray600: '#6B6B75',
    gray700: '#1F1F26',
    gray900: '#0E0E10',
    // Greens (muted, informational)
    green500: '#4CAF50',
    // Legacy aliases
    blue50: 'rgba(255, 59, 59, 0.08)',
    blue100: 'rgba(255, 59, 59, 0.12)',
    blue200: 'rgba(255, 59, 59, 0.18)',
    blue500: '#FF3B3B',
    blue600: '#E63535',
    blue700: '#CC2F2F',
    emerald50: 'rgba(76, 175, 80, 0.08)',
    emerald100: 'rgba(76, 175, 80, 0.12)',
    emerald400: '#45A049',
    emerald500: '#4CAF50',
    emerald600: '#439646',
    orange50: 'rgba(255, 200, 61, 0.08)',
    orange100: 'rgba(255, 200, 61, 0.12)',
    yellow500: '#FFC83D',
    // Gradients
    gradientButton: ['#FF3B3B', '#E63535'] as const,
    gradientProgress: ['#FFC83D', '#E6B437'] as const,
    gradientIcon: ['#FF3B3B', '#E63535'] as const,
  },
};

export default Colors;
