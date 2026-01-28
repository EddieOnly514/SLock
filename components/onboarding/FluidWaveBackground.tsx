import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    interpolate,
    interpolateColor,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface FluidWaveBackgroundProps {
    children?: React.ReactNode;
    /** Animation speed multiplier. 1 = normal, 0.5 = slower. Default: 1 */
    speed?: number;
    /** Enable/disable animation. Default: true */
    animated?: boolean;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

/**
 * FluidWaveBackground - Silky smooth flowing blue gradient
 * 
 * Uses full-screen gradient layers that gently shift position
 * creating a seamless, silk-like flowing effect
 */
export default function FluidWaveBackground({
    children,
    speed = 1,
    animated = true,
}: FluidWaveBackgroundProps) {
    const flow1 = useSharedValue(0);
    const flow2 = useSharedValue(0);

    useEffect(() => {
        if (!animated) return;

        // Slow flowing animation - 25 seconds per cycle
        flow1.value = withRepeat(
            withTiming(1, {
                duration: 25000 / speed,
                easing: Easing.inOut(Easing.sin),
            }),
            -1,
            true
        );

        // Offset second flow for organic movement
        flow2.value = withRepeat(
            withTiming(1, {
                duration: 18000 / speed,
                easing: Easing.inOut(Easing.sin),
            }),
            -1,
            true
        );
    }, [animated, speed]);

    // First flowing layer - moves diagonally
    const layer1Style = useAnimatedStyle(() => {
        const translateX = interpolate(flow1.value, [0, 1], [-30, 30]);
        const translateY = interpolate(flow1.value, [0, 1], [-20, 20]);
        const rotate = interpolate(flow1.value, [0, 1], [-3, 3]);

        return {
            transform: [
                { translateX },
                { translateY },
                { rotate: `${rotate}deg` },
                { scale: 1.3 }, // Oversized to prevent edges showing
            ],
        };
    });

    // Second flowing layer - opposite direction
    const layer2Style = useAnimatedStyle(() => {
        const translateX = interpolate(flow2.value, [0, 1], [25, -25]);
        const translateY = interpolate(flow2.value, [0, 1], [15, -15]);
        const rotate = interpolate(flow2.value, [0, 1], [2, -2]);

        return {
            transform: [
                { translateX },
                { translateY },
                { rotate: `${rotate}deg` },
                { scale: 1.3 },
            ],
            opacity: interpolate(flow2.value, [0, 0.5, 1], [0.6, 0.75, 0.6]),
        };
    });

    return (
        <View style={styles.container}>
            {/* Base layer - static soft blue */}
            <LinearGradient
                colors={['#DBEAFE', '#EFF6FF', '#F8FAFC', '#FFFFFF']}
                locations={[0, 0.35, 0.65, 1]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0.3, y: 0 }}
                end={{ x: 0.7, y: 1 }}
            />

            {/* Flowing layer 1 - soft blue wash */}
            <Animated.View style={[styles.flowLayer, layer1Style]}>
                <LinearGradient
                    colors={['#BFDBFE', '#DBEAFE', '#E0F2FE', '#F0F9FF']}
                    locations={[0, 0.3, 0.6, 1]}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
            </Animated.View>

            {/* Flowing layer 2 - lighter accent */}
            <Animated.View style={[styles.flowLayer, layer2Style]}>
                <LinearGradient
                    colors={['transparent', '#BFDBFE', '#DBEAFE', 'transparent']}
                    locations={[0, 0.3, 0.7, 1]}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                />
            </Animated.View>

            {/* Content */}
            <View style={styles.content}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
        backgroundColor: '#F0F9FF',
    },
    flowLayer: {
        position: 'absolute',
        top: -height * 0.15,
        left: -width * 0.15,
        right: -width * 0.15,
        bottom: -height * 0.15,
    },
    content: {
        flex: 1,
        zIndex: 10,
    },
});
