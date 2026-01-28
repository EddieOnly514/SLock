/**
 * Spacing Design Tokens
 * Based on 4pt grid system
 * 
 * All values are multiples of 4
 */

export const Spacing = {
    // Core spacing tokens
    micro: 4,      // Micro spacing
    tight: 8,      // Tight spacing
    compact: 12,   // Compact spacing
    default: 16,   // Default spacing
    cozy: 20,      // Cozy spacing
    section: 24,   // Section spacing
    large: 32,     // Large spacing
    xl: 40,        // Extra large
    xxl: 48,       // Double extra large
    hero: 56,      // Hero/big gaps
} as const;

/**
 * Layout-specific spacing
 */
export const LayoutSpacing = {
    // Screen padding
    screenPadding: 16,
    screenPaddingLarge: 20,  // For premium feel on larger phones

    // Card spacing
    cardPadding: 16,
    cardGap: 12,             // Vertical gap between cards
    cardGapLarge: 16,

    // Section spacing
    sectionGap: 24,
    sectionGapLarge: 32,

    // Input/form spacing
    inputGap: 12,
    formGap: 16,
} as const;

export default Spacing;
