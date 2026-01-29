import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '../../constants/Colors';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';

interface GiftCard {
  id: string;
  name: string;
  icon: string;
  color: string;
  pointsCost: number;
  value: string;
}

const GIFT_CARDS: GiftCard[] = [
  { id: '1', name: 'Amazon', icon: 'logo-amazon', color: '#FF9900', pointsCost: 500, value: '$5' },
  { id: '2', name: 'Starbucks', icon: 'cafe', color: '#00704A', pointsCost: 300, value: '$3' },
  { id: '3', name: 'Apple', icon: 'logo-apple', color: '#000000', pointsCost: 1000, value: '$10' },
  { id: '4', name: 'Spotify', icon: 'musical-notes', color: '#1DB954', pointsCost: 500, value: '$5' },
  { id: '5', name: 'Netflix', icon: 'film', color: '#E50914', pointsCost: 1000, value: '$10' },
  { id: '6', name: 'DoorDash', icon: 'restaurant', color: '#FF3008', pointsCost: 500, value: '$5' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function RewardsScreen() {
  const [points, setPoints] = useState(1250);
  const [hoursLocked, setHoursLocked] = useState(12.5);

  const handleRedeemCard = (card: GiftCard) => {
    if (points >= card.pointsCost) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // TODO: Implement redemption flow
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <AnimatedBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Rewards</Text>
            <Pressable style={styles.historyButton}>
              <Text style={styles.historyText}>History</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.spec.blue600} />
            </Pressable>
          </View>

          {/* Points Card */}
          <Animated.View entering={FadeInDown.duration(600).delay(100)}>
            <View style={styles.pointsCard}>
              <LinearGradient
                colors={[Colors.primary[500], Colors.primary[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.pointsCardGradient}
              >
                <View style={styles.pointsHeader}>
                  <Text style={styles.pointsLabel}>Your Points</Text>
                  <View style={styles.pointsBadge}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                  </View>
                </View>
                <Text style={styles.pointsValue}>{points.toLocaleString()}</Text>
                <View style={styles.pointsFormula}>
                  <View style={styles.formulaItem}>
                    <Ionicons name="time" size={18} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.formulaText}>{hoursLocked}h locked</Text>
                  </View>
                  <Text style={styles.formulaEquals}>=</Text>
                  <View style={styles.formulaItem}>
                    <Ionicons name="flash" size={18} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.formulaText}>100 pts/hr</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>

          {/* How It Works */}
          <Animated.View
            entering={FadeInDown.duration(600).delay(200)}
            style={styles.howItWorks}
          >
            <View style={styles.howCard}>
              <View style={[styles.howIcon, { backgroundColor: Colors.spec.blue50 }]}>
                <Ionicons name="lock-closed" size={20} color={Colors.spec.blue600} />
              </View>
              <View style={styles.howInfo}>
                <Text style={styles.howTitle}>Lock Apps</Text>
                <Text style={styles.howDesc}>Stay focused</Text>
              </View>
            </View>
            <Ionicons name="arrow-forward" size={20} color={Colors.spec.gray400} />
            <View style={styles.howCard}>
              <View style={[styles.howIcon, { backgroundColor: Colors.spec.emerald50 }]}>
                <Ionicons name="time" size={20} color={Colors.spec.emerald600} />
              </View>
              <View style={styles.howInfo}>
                <Text style={styles.howTitle}>Earn Points</Text>
                <Text style={styles.howDesc}>100/hour</Text>
              </View>
            </View>
            <Ionicons name="arrow-forward" size={20} color={Colors.spec.gray400} />
            <View style={styles.howCard}>
              <View style={[styles.howIcon, { backgroundColor: Colors.spec.orange50 }]}>
                <Ionicons name="gift" size={20} color="#F97316" />
              </View>
              <View style={styles.howInfo}>
                <Text style={styles.howTitle}>Get Rewards</Text>
                <Text style={styles.howDesc}>Gift cards</Text>
              </View>
            </View>
          </Animated.View>

          {/* Gift Cards Section */}
          <Animated.View
            entering={FadeInDown.duration(600).delay(300)}
            style={styles.giftCardsSection}
          >
            <Text style={styles.sectionTitle}>Gift Cards</Text>
            <View style={styles.giftCardsGrid}>
              {GIFT_CARDS.map((card) => {
                const canRedeem = points >= card.pointsCost;
                return (
                  <Pressable
                    key={card.id}
                    onPress={() => handleRedeemCard(card)}
                    style={[styles.giftCard, !canRedeem && styles.giftCardDisabled]}
                  >
                    <View style={[styles.giftCardIcon, { backgroundColor: card.color + '15' }]}>
                      <Ionicons name={card.icon as any} size={28} color={card.color} />
                    </View>
                    <Text style={styles.giftCardName}>{card.name}</Text>
                    <Text style={styles.giftCardValue}>{card.value}</Text>
                    <View style={[
                      styles.giftCardCost,
                      canRedeem ? styles.giftCardCostActive : styles.giftCardCostInactive
                    ]}>
                      <Ionicons
                        name="star"
                        size={12}
                        color={canRedeem ? Colors.spec.blue600 : Colors.spec.gray400}
                      />
                      <Text style={[
                        styles.giftCardCostText,
                        canRedeem ? styles.costTextActive : styles.costTextInactive
                      ]}>
                        {card.pointsCost}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>

          {/* Prizes Section */}
          <Animated.View
            entering={FadeInDown.duration(600).delay(400)}
            style={styles.prizesSection}
          >
            <Text style={styles.sectionTitle}>Special Prizes</Text>
            <View style={styles.prizeCard}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.prizeGradient}
              >
                <View style={styles.prizeIconContainer}>
                  <Ionicons name="headset" size={32} color="#FFFFFF" />
                </View>
                <View style={styles.prizeInfo}>
                  <Text style={styles.prizeTitle}>AirPods Pro</Text>
                  <Text style={styles.prizeDesc}>Enter the monthly draw</Text>
                </View>
                <View style={styles.prizePoints}>
                  <Text style={styles.prizePointsValue}>5,000</Text>
                  <Text style={styles.prizePointsLabel}>pts</Text>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.prizeCard}>
              <LinearGradient
                colors={['#EC4899', '#F43F5E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.prizeGradient}
              >
                <View style={styles.prizeIconContainer}>
                  <Ionicons name="ticket" size={32} color="#FFFFFF" />
                </View>
                <View style={styles.prizeInfo}>
                  <Text style={styles.prizeTitle}>Concert Tickets</Text>
                  <Text style={styles.prizeDesc}>Random artist giveaway</Text>
                </View>
                <View style={styles.prizePoints}>
                  <Text style={styles.prizePointsValue}>10,000</Text>
                  <Text style={styles.prizePointsLabel}>pts</Text>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.spec.gray900,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.spec.blue600,
  },
  // Points Card
  pointsCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: Colors.spec.blue500,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  pointsCardGradient: {
    padding: 24,
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointsLabel: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
  },
  pointsBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  pointsFormula: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  formulaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  formulaText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  formulaEquals: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginHorizontal: 12,
  },
  // How It Works
  howItWorks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.spec.gray200,
  },
  howCard: {
    alignItems: 'center',
    flex: 1,
  },
  howIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  howInfo: {
    alignItems: 'center',
  },
  howTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.spec.gray900,
  },
  howDesc: {
    fontSize: 10,
    color: Colors.spec.gray500,
  },
  // Gift Cards
  giftCardsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.spec.gray900,
    marginBottom: 16,
  },
  giftCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  giftCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.spec.gray200,
  },
  giftCardDisabled: {
    opacity: 0.6,
  },
  giftCardIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  giftCardName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.spec.gray900,
    marginBottom: 2,
  },
  giftCardValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.spec.gray700,
    marginBottom: 8,
  },
  giftCardCost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  giftCardCostActive: {
    backgroundColor: Colors.spec.blue50,
  },
  giftCardCostInactive: {
    backgroundColor: Colors.spec.gray100,
  },
  giftCardCostText: {
    fontSize: 11,
    fontWeight: '600',
  },
  costTextActive: {
    color: Colors.spec.blue600,
  },
  costTextInactive: {
    color: Colors.spec.gray500,
  },
  // Prizes
  prizesSection: {
    paddingHorizontal: 24,
  },
  prizeCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
  },
  prizeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  prizeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  prizeInfo: {
    flex: 1,
  },
  prizeTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  prizeDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  prizePoints: {
    alignItems: 'center',
  },
  prizePointsValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  prizePointsLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
});
