/**
 * SLock Design System - Theme Configuration
 * Theme: Playfully Serious · Futuristic · Youthful · Competitive
 * Soft shadows · Rounded corners (20-30px) · Microanimations
 */

export const Theme = {
  // Border radius for rounded design (20-30px range emphasized)
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,        // Design spec range starts here
    xxl: 24,
    xxxl: 28,      // Added for variety
    huge: 30,      // Design spec upper limit
    full: 9999,
  },

  // Spacing scale
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  // Typography (Sans-serif, rounded fonts: Inter, Poppins, SF Pro)
  // Note: Actual font family needs to be loaded separately
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
  },

  fontWeight: {
    regular: '400' as const,    // Body text
    medium: '500' as const,     // Medium-weight body
    semibold: '600' as const,   // Sub-headers
    bold: '700' as const,       // Bold headers (emphasized)
    extrabold: '800' as const,  // Extra emphasis
  },

  // Soft shadows for depth (adjusted for dark mode)
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 8,
    },
    // Glow effects for wins and milestones
    glow: {
      shadowColor: '#00FFC6',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 12,
      elevation: 10,
    },
    glowOrange: {
      shadowColor: '#FF8A00',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 12,
      elevation: 10,
    },
  },

  // Animation durations (microanimations on every button)
  animation: {
    instant: 100,      // Instant feedback
    fast: 150,         // Quick transitions
    normal: 250,       // Standard animations
    slow: 350,         // Smooth, deliberate
    streak: 500,       // Streak/progress animations
    portal: 800,       // Lock portal animation
  },
};

export default Theme;
