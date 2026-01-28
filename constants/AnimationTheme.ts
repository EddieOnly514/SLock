import { Easing } from 'react-native-reanimated';

export const ANIMATION_THEME = {
    // Custom Bezier: [0.16, 1, 0.3, 1] for smooth, elegant motion without bounce
    eased: Easing.bezier(0.16, 1, 0.3, 1),

    // Standard durations
    duration: {
        fast: 200,    // Interactions (hover, tap)
        regular: 500, // Standard transitions
        slow: 700,    // Page entrances (0.6s - 0.8s)
    },

    // Stagger delays
    stagger: 100, // 0.1s between items
};
