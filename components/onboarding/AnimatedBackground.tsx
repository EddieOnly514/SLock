import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';

interface AnimatedBackgroundProps {
  children?: React.ReactNode;
}

/**
 * Simplified background component - static gradient for better performance.
 * Previously had 3 animated wave layers causing continuous re-renders.
 */
export default function AnimatedBackground({ children }: AnimatedBackgroundProps) {
  return (
    <View style={styles.container}>
      {/* Base gradient - clean white with subtle brand tint */}
      <LinearGradient
        colors={[Colors.background.primary, Colors.background.secondary, Colors.background.tertiary]}
        style={styles.baseGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  baseGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
});
