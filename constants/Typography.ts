/**
 * Typography Design Tokens
 * Based on DM Sans font family
 * 
 * Font weights: 400 (Regular), 500 (Medium), 700 (Bold)
 * Using @expo-google-fonts/dm-sans package
 */

export const FontFamily = {
    regular: 'DMSans_400Regular',
    medium: 'DMSans_500Medium',
    bold: 'DMSans_700Bold',
} as const;

export const FontWeight = {
    regular: '400',
    medium: '500',
    bold: '700',
} as const;

/**
 * Type Scale
 * Format: [fontSize, lineHeight, fontWeight]
 */
export const Typography = {
    // Display / Hero: 32 / 40, 700
    display: {
        fontSize: 32,
        lineHeight: 40,
        fontFamily: FontFamily.bold,
        fontWeight: FontWeight.bold,
    },

    // H1: 24 / 32, 700
    h1: {
        fontSize: 24,
        lineHeight: 32,
        fontFamily: FontFamily.bold,
        fontWeight: FontWeight.bold,
    },

    // H2: 20 / 28, 700
    h2: {
        fontSize: 20,
        lineHeight: 28,
        fontFamily: FontFamily.bold,
        fontWeight: FontWeight.bold,
    },

    // H3: 18 / 26, 700
    h3: {
        fontSize: 18,
        lineHeight: 26,
        fontFamily: FontFamily.bold,
        fontWeight: FontWeight.bold,
    },

    // Body (default): 16 / 24, 400
    body: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: FontFamily.regular,
        fontWeight: FontWeight.regular,
    },

    // Body (emphasis): 16 / 24, 500
    bodyEmphasis: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: FontFamily.medium,
        fontWeight: FontWeight.medium,
    },

    // Small: 14 / 20, 400
    small: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: FontFamily.regular,
        fontWeight: FontWeight.regular,
    },

    // Caption: 12 / 16, 400
    caption: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: FontFamily.regular,
        fontWeight: FontWeight.regular,
    },

    // Micro: 11 / 14, 500 (labels, chips, tiny UI)
    micro: {
        fontSize: 11,
        lineHeight: 14,
        fontFamily: FontFamily.medium,
        fontWeight: FontWeight.medium,
    },

    // Button: 16 / 20, 500
    button: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: FontFamily.medium,
        fontWeight: FontWeight.medium,
    },

    // Nav labels: 12 / 16, 500
    navLabel: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: FontFamily.medium,
        fontWeight: FontWeight.medium,
    },

    // Section titles: 18 / 26, 700
    sectionTitle: {
        fontSize: 18,
        lineHeight: 26,
        fontFamily: FontFamily.bold,
        fontWeight: FontWeight.bold,
    },

    // Numbers (stats, streaks): 24-32 / 32, 700
    statNumber: {
        fontSize: 28,
        lineHeight: 32,
        fontFamily: FontFamily.bold,
        fontWeight: FontWeight.bold,
    },

    // Large stat number
    statNumberLarge: {
        fontSize: 32,
        lineHeight: 40,
        fontFamily: FontFamily.bold,
        fontWeight: FontWeight.bold,
    },
} as const;

/**
 * Letter Spacing (Tracking)
 */
export const LetterSpacing = {
    headline: -0.2,   // Headlines: 0 to -0.2
    body: 0,          // Body: 0
    caps: 0.8,        // Caps labels: +0.6 to +1.2
} as const;

export default Typography;
