/**
 * Layout Design Tokens
 * Component sizing, border radii, and touch targets
 */

/**
 * Button heights
 */
export const ButtonSize = {
    primary: 48,    // Primary buttons
    secondary: 40,  // Secondary buttons
    chip: 32,       // Chip/tag buttons
} as const;

/**
 * Input heights
 */
export const InputSize = {
    default: 48,
    small: 40,
} as const;

/**
 * Icon sizes
 */
export const IconSize = {
    small: 16,
    default: 20,
    medium: 24,
    large: 28,
    xl: 32,
} as const;

/**
 * Touch targets (Apple minimum: 44)
 */
export const TouchTarget = {
    minimum: 44,
    default: 48,
} as const;

/**
 * Border radius (modern-friendly style)
 */
export const BorderRadius = {
    none: 0,
    small: 8,
    button: 12,     // Buttons
    card: 16,       // Cards, chips
    modal: 24,      // Modals, sheets
    pill: 999,      // Full rounded
} as const;

/**
 * Component-specific layouts
 */
export const ComponentLayout = {
    // Card
    card: {
        padding: 16,
        borderRadius: 16,
        gap: 12,
    },

    // Modal/Sheet
    modal: {
        paddingHorizontal: 20,
        paddingBottom: 32,
        borderRadius: 24,
    },

    // Button
    button: {
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        minHeight: 48,
    },

    // Input
    input: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        minHeight: 48,
    },

    // Tab bar
    tabBar: {
        height: 56,
        iconSize: 24,
        labelSize: 12,
    },
} as const;

export default {
    ButtonSize,
    InputSize,
    IconSize,
    TouchTarget,
    BorderRadius,
    ComponentLayout,
};
