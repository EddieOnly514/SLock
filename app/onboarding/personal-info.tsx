import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { ANIMATION_THEME } from '../../constants/AnimationTheme';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import ProgressBar from '../../components/onboarding/ProgressBar';
import { useOnboarding } from '../../hooks/useOnboarding';
import Colors from '../../constants/Colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const ages = Array.from({ length: 88 }, (_, i) => i + 13); // 13-100
const ITEM_HEIGHT = 44;

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [name, setName] = useState(data.name || '');
  const [age, setAge] = useState<number | null>(data.age || null);
  const [gender, setGender] = useState(data.gender || '');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showAgePicker, setShowAgePicker] = useState(false);
  const [tempAge, setTempAge] = useState<number>(age || 25);
  const flatListRef = useRef<FlatList>(null);
  const buttonScale = useSharedValue(1);

  // Premium Animation Values
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  React.useEffect(() => {
    const { eased, duration } = ANIMATION_THEME;
    contentOpacity.value = withTiming(1, { duration: duration.slow, easing: eased });
    contentTranslateY.value = withTiming(0, { duration: duration.slow, easing: eased });
  }, []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const isValid = name.trim() && age && gender;

  const handlePickImage = async () => {
    Haptics.selectionAsync();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleOpenAgePicker = () => {
    Haptics.selectionAsync();
    setTempAge(age || 25);
    setShowAgePicker(true);
    // Scroll to current selection after modal opens
    setTimeout(() => {
      const index = ages.indexOf(age || 25);
      flatListRef.current?.scrollToIndex({ index, animated: false, viewPosition: 0.5 });
    }, 100);
  };

  const handleConfirmAge = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAge(tempAge);
    setShowAgePicker(false);
  };

  const handleContinue = () => {
    if (!isValid) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateData({
      name: name.trim(),
      age: age,
      gender,
    });
    setCurrentStep(8);
    router.push('/onboarding/analytics-credibility');
  };

  const handlePressIn = () => {
    if (isValid) {
      buttonScale.value = withTiming(0.98, {
        duration: ANIMATION_THEME.duration.fast,
        easing: ANIMATION_THEME.eased
      });
    }
  };

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, {
      duration: ANIMATION_THEME.duration.fast,
      easing: ANIMATION_THEME.eased
    });
  };

  const renderAgeItem = ({ item }: { item: number }) => (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        setTempAge(item);
      }}
      style={[styles.ageItem, tempAge === item && styles.ageItemSelected]}
    >
      <Text style={[styles.ageItemText, tempAge === item && styles.ageItemTextSelected]}>
        {item}
      </Text>
    </Pressable>
  );

  return (
    <AnimatedBackground>
      <ProgressBar currentStep={7} totalSteps={11} />

      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.spacer} />

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={[styles.content, contentStyle]}>
              {/* Avatar */}
              <Pressable onPress={handlePickImage} style={styles.avatarContainer}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={40} color={Colors.spec.gray400} />
                  </View>
                )}
                <View style={styles.cameraIcon}>
                  <Ionicons name="camera" size={16} color="#FFFFFF" />
                </View>
              </Pressable>

              <Text style={styles.title}>Tell us about yourself</Text>
              <Text style={styles.subtext}>Help us personalize your{'\u00A0'}experience</Text>

              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Your name"
                    placeholderTextColor={Colors.spec.gray400}
                    maxLength={50}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Age</Text>
                  <Pressable onPress={handleOpenAgePicker} style={styles.dropdownButton}>
                    <Text style={age ? styles.dropdownText : styles.dropdownPlaceholder}>
                      {age ? `${age} years old` : 'Select your age'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={Colors.spec.gray400} />
                  </Pressable>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.genderGrid}>
                    {genderOptions.map((option) => (
                      <Pressable
                        key={option.value}
                        onPress={() => {
                          Haptics.selectionAsync();
                          setGender(option.value);
                        }}
                        style={[
                          styles.genderOption,
                          gender === option.value && styles.genderOptionSelected,
                        ]}
                      >
                        <Text style={[
                          styles.genderText,
                          gender === option.value && styles.genderTextSelected,
                        ]}>
                          {option.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>

              <AnimatedPressable
                onPress={handleContinue}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={!isValid}
                style={[styles.buttonWrapper, buttonStyle, !isValid && styles.buttonDisabled]}
              >
                <LinearGradient
                  colors={isValid ? [Colors.primary[500], Colors.primary[600]] : [Colors.spec.gray300, Colors.spec.gray300]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={[styles.buttonText, !isValid && styles.buttonTextDisabled]}>
                    Continue
                  </Text>
                </LinearGradient>
              </AnimatedPressable>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* iOS-style Picker Modal */}
      <Modal
        visible={showAgePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAgePicker(false)}
      >
        <View style={styles.pickerOverlay}>
          <Pressable style={styles.pickerBackdrop} onPress={() => setShowAgePicker(false)} />
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Pressable onPress={() => setShowAgePicker(false)}>
                <Text style={styles.pickerCancel}>Cancel</Text>
              </Pressable>
              <Text style={styles.pickerTitle}>Select Age</Text>
              <Pressable onPress={handleConfirmAge}>
                <Text style={styles.pickerDone}>Done</Text>
              </Pressable>
            </View>

            {/* Selection Indicator */}
            <View style={styles.selectionIndicator} />

            <FlatList
              ref={flatListRef}
              data={ages}
              keyExtractor={(item) => item.toString()}
              renderItem={renderAgeItem}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              contentContainerStyle={styles.ageListContent}
              getItemLayout={(_, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
              onScrollToIndexFailed={() => { }}
              style={styles.ageList}
            />
          </View>
        </View>
      </Modal>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  spacer: {
    height: 80,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.spec.gray200,
    borderStyle: 'dashed',
    backgroundColor: '#F9FAFB',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.spec.gray900,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: Colors.spec.gray600,
    textAlign: 'center',
    marginBottom: 28,
  },
  formContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.spec.gray700,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.spec.gray200,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.spec.gray900,
  },
  dropdownButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.spec.gray200,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.spec.gray900,
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: Colors.spec.gray400,
  },
  genderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genderOption: {
    flex: 1,
    minWidth: '45%',
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Colors.spec.gray200,
    borderRadius: 12,
    alignItems: 'center',
  },
  genderOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: Colors.primary[500],
  },
  genderText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.spec.gray900,
  },
  genderTextSelected: {
    color: Colors.primary[700],
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonTextDisabled: {
    color: Colors.spec.gray400,
  },
  // iOS-style Picker
  pickerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  pickerContainer: {
    backgroundColor: '#F8F8F8',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 34,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
    backgroundColor: '#F8F8F8',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  pickerCancel: {
    fontSize: 17,
    color: '#007AFF',
  },
  pickerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.spec.gray900,
  },
  pickerDone: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
  },
  selectionIndicator: {
    position: 'absolute',
    top: '50%',
    left: 16,
    right: 16,
    height: ITEM_HEIGHT,
    marginTop: 27, // Offset for header
    backgroundColor: 'rgba(120, 120, 128, 0.12)',
    borderRadius: 10,
    zIndex: 0,
  },
  ageList: {
    height: ITEM_HEIGHT * 5,
  },
  ageListContent: {
    paddingVertical: ITEM_HEIGHT * 2,
  },
  ageItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageItemSelected: {},
  ageItemText: {
    fontSize: 22,
    color: Colors.spec.gray900,
  },
  ageItemTextSelected: {
    fontWeight: '500',
  },
});
