import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../frontend/src/hooks/useAuth';
import CountryCodePicker, { CountryCode } from '../../components/CountryCodePicker';
import Colors from '../../constants/Colors';
import Theme from '../../constants/Theme';
import { trackAuthEvent, trackAuthError, trackAuthSuccess } from '../../services/analytics';

type LoginMethod = 'phone' | 'email';
type LoginState = 'idle' | 'validating' | 'error' | 'success' | 'captcha';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loginWithPhone, verifyOTP } = useAuth();

  // Login method state
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');
  const [loginState, setLoginState] = useState<LoginState>('idle');

  // Phone login state
  const [countryCode, setCountryCode] = useState<CountryCode>({
    code: '+1',
    country: 'US',
    name: 'United States',
    flag: '🇺🇸',
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpStartTime, setOtpStartTime] = useState<number>(0);

  // Email login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Error states
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [otpError, setOtpError] = useState('');

  // Loading state
  const [loading, setLoading] = useState(false);
  const [authStartTime, setAuthStartTime] = useState<number>(0);

  // Track view on mount
  useEffect(() => {
    trackAuthEvent('auth_view');
  }, []);

  const clearErrors = () => {
    setError('');
    setPhoneError('');
    setEmailError('');
    setPasswordError('');
    setOtpError('');
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Basic validation - adjust regex for your needs
    const phoneRegex = /^\d{10,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

    if (!cleanPhone) {
      setPhoneError('Phone number is required');
      return false;
    }

    if (!phoneRegex.test(cleanPhone)) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }

    setPhoneError('');
    return true;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }

    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }

    setEmailError('');
    return true;
  };

  const validatePassword = (pass: string): boolean => {
    if (!pass) {
      setPasswordError('Password is required');
      return false;
    }

    if (pass.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }

    setPasswordError('');
    return true;
  };

  const handlePhoneLogin = async () => {
    clearErrors();

    if (!validatePhoneNumber(phoneNumber)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    setLoginState('validating');
    setAuthStartTime(Date.now());

    trackAuthEvent('tap_phone_login');

    try {
      const fullPhone = `${countryCode.code}${phoneNumber.replace(/[\s\-\(\)]/g, '')}`;
      await loginWithPhone(fullPhone);

      setOtpSent(true);
      setOtpStartTime(Date.now());
      setLoginState('idle');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      trackAuthEvent('otp_sent', { phone: fullPhone });
    } catch (err: any) {
      setLoginState('error');
      setError(err.message || 'Failed to send verification code');
      setPhoneError('Could not send OTP. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      trackAuthError('phone', 'invalid_credentials', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    clearErrors();

    if (!otp.trim() || otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit code');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    setLoginState('validating');

    try {
      const fullPhone = `${countryCode.code}${phoneNumber.replace(/[\s\-\(\)]/g, '')}`;
      await verifyOTP(fullPhone, otp);

      setLoginState('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const duration = Date.now() - otpStartTime;
      trackAuthSuccess('phone', authStartTime);
      trackAuthEvent('otp_verified', { duration_ms: duration });

      // Navigate after short delay to show success state
      setTimeout(() => router.replace('/'), 500);
    } catch (err: any) {
      setLoginState('error');
      setError(err.message || 'Invalid verification code');
      setOtpError('Code is incorrect or expired');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      trackAuthError('phone', 'invalid_otp', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    //TODO: fix the syntax for login, can defnitely seperate it so it's easier to read
    //also seems like there is some unnecessary code here
    clearErrors();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    setLoginState('validating');
    setAuthStartTime(Date.now());

    trackAuthEvent('tap_email_login');

    try {
      await login(email, password);

      setLoginState('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      trackAuthSuccess('email', authStartTime);

      // Navigate after short delay to show success state
      setTimeout(() => router.replace('/(tabs)/lock'), 500);
    } catch (err: any) {
      setLoginState('error');
      setError(err.message || 'Failed to login');

      // Set specific field errors based on error message
      if (err.message?.includes('email')) {
        setEmailError('Email not found or invalid');
      } else if (err.message?.includes('password')) {
        setPasswordError('Incorrect password');
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      trackAuthError('email', 'invalid_credentials', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    // TODO: Implement when you add Apple/Google
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Coming Soon', `${provider} login will be available soon!`);
  };

  const switchLoginMethod = (method: LoginMethod) => {
    setLoginMethod(method);
    clearErrors();
    setOtpSent(false);
    setLoginState('idle');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    trackAuthEvent('country_code_changed');
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    trackAuthEvent('password_reveal');
  };

  return (
    <LinearGradient
      colors={[Colors.background.primary, Colors.background.secondary, Colors.background.tertiary]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Uber-style Header with Large Slogan */}
            <View style={styles.header}>
              <Text style={styles.slogan}>SLOCK IN</Text>
              <Text style={styles.tagline}>Take back your time</Text>
            </View>

            {/* Login Method Switcher */}
            <View style={styles.methodSwitcher}>
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  loginMethod === 'phone' && styles.methodButtonActive,
                ]}
                onPress={() => switchLoginMethod('phone')}
                disabled={loading}
              >
                <MaterialIcons
                  name="phone"
                  size={20}
                  color={loginMethod === 'phone' ? Colors.primary[500] : Colors.text.tertiary}
                />
                <Text
                  style={[
                    styles.methodText,
                    loginMethod === 'phone' && styles.methodTextActive,
                  ]}
                >
                  Phone
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodButton,
                  loginMethod === 'email' && styles.methodButtonActive,
                ]}
                onPress={() => switchLoginMethod('email')}
                disabled={loading}
              >
                <MaterialIcons
                  name="email"
                  size={20}
                  color={loginMethod === 'email' ? Colors.primary[500] : Colors.text.tertiary}
                />
                <Text
                  style={[
                    styles.methodText,
                    loginMethod === 'email' && styles.methodTextActive,
                  ]}
                >
                  Email
                </Text>
              </TouchableOpacity>
            </View>

            {/* Main Card (Uber-style) */}
            <View style={styles.card}>
              {/* Global Error Toast */}
              {error && loginState === 'error' ? (
                <View style={styles.errorContainer}>
                  <MaterialIcons name="error-outline" size={20} color={Colors.error[500]} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Success State */}
              {loginState === 'success' ? (
                <View style={styles.successContainer}>
                  <MaterialIcons name="check-circle" size={20} color={Colors.success[500]} />
                  <Text style={styles.successText}>Success! Logging you in...</Text>
                </View>
              ) : null}

              {/* Phone Login */}
              {loginMethod === 'phone' && !otpSent && (
                <View style={styles.form}>
                  <Text style={styles.inputLabel}>Phone Number</Text>

                  <View style={styles.phoneInputRow}>
                    <CountryCodePicker
                      selectedCode={countryCode}
                      onSelect={setCountryCode}
                    />

                    <View style={[styles.inputContainer, styles.phoneInput, phoneError && styles.inputError]}>
                      <TextInput
                        style={styles.input}
                        placeholder="(555) 123-4567"
                        placeholderTextColor={Colors.text.disabled}
                        value={phoneNumber}
                        onChangeText={(text) => {
                          setPhoneNumber(text);
                          if (phoneError) setPhoneError('');
                        }}
                        keyboardType="phone-pad"
                        autoFocus
                        editable={!loading}
                      />
                    </View>
                  </View>

                  {phoneError ? (
                    <Text style={styles.fieldError}>{phoneError}</Text>
                  ) : null}

                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      (loading || loginState === 'validating') && styles.primaryButtonDisabled,
                    ]}
                    onPress={handlePhoneLogin}
                    disabled={loading || loginState === 'validating'}
                    activeOpacity={0.8}
                  >
                    {loading ? (
                      <ActivityIndicator color={Colors.text.inverse} />
                    ) : (
                      <Text style={styles.primaryButtonText}>Continue</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* OTP Verification */}
              {loginMethod === 'phone' && otpSent && (
                <View style={styles.form}>
                  <Text style={styles.inputLabel}>Verification Code</Text>
                  <Text style={styles.helperText}>
                    Enter the 6-digit code sent to {countryCode.code} {phoneNumber}
                  </Text>

                  <View style={[styles.inputContainer, otpError && styles.inputError]}>
                    <MaterialIcons name="lock-outline" size={20} color={Colors.text.tertiary} />
                    <TextInput
                      style={styles.input}
                      placeholder="123456"
                      placeholderTextColor={Colors.text.disabled}
                      value={otp}
                      onChangeText={(text) => {
                        setOtp(text);
                        if (otpError) setOtpError('');
                      }}
                      keyboardType="number-pad"
                      maxLength={6}
                      autoFocus
                      editable={!loading}
                    />
                  </View>

                  {otpError ? (
                    <Text style={styles.fieldError}>{otpError}</Text>
                  ) : null}

                  <TouchableOpacity
                    style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                    onPress={handleVerifyOTP}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    {loading ? (
                      <ActivityIndicator color={Colors.text.inverse} />
                    ) : (
                      <Text style={styles.primaryButtonText}>Verify</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => {
                      setOtpSent(false);
                      setOtp('');
                      clearErrors();
                    }}
                    disabled={loading}
                  >
                    <Text style={styles.secondaryButtonText}>Change number</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Email Login */}
              {loginMethod === 'email' && (
                <View style={styles.form}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <View style={[styles.inputContainer, emailError && styles.inputError]}>
                    <MaterialIcons name="email" size={20} color={Colors.text.tertiary} />
                    <TextInput
                      style={styles.input}
                      placeholder="your@email.com"
                      placeholderTextColor={Colors.text.disabled}
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        if (emailError) setEmailError('');
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoFocus
                      editable={!loading}
                    />
                  </View>

                  {emailError ? (
                    <Text style={styles.fieldError}>{emailError}</Text>
                  ) : null}

                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={[styles.inputContainer, passwordError && styles.inputError]}>
                    <MaterialIcons name="lock-outline" size={20} color={Colors.text.tertiary} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      placeholderTextColor={Colors.text.disabled}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (passwordError) setPasswordError('');
                      }}
                      secureTextEntry={!passwordVisible}
                      editable={!loading}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                      <MaterialIcons
                        name={passwordVisible ? 'visibility' : 'visibility-off'}
                        size={20}
                        color={Colors.text.tertiary}
                      />
                    </TouchableOpacity>
                  </View>

                  {passwordError ? (
                    <Text style={styles.fieldError}>{passwordError}</Text>
                  ) : null}

                  <TouchableOpacity
                    style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                    onPress={handleEmailLogin}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    {loading ? (
                      <ActivityIndicator color={Colors.text.inverse} />
                    ) : (
                      <Text style={styles.primaryButtonText}>Continue</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={() => router.push('/auth/forgot-password' as any)}
                    disabled={loading}
                  >
                    <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons (Uber-style) - Disabled for now */}
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[styles.socialButton, styles.socialButtonDisabled]}
                onPress={() => handleSocialLogin('Apple')}
                disabled
              >
                <FontAwesome name="apple" size={24} color={Colors.text.disabled} />
                <Text style={[styles.socialButtonText, styles.socialButtonTextDisabled]}>
                  Continue with Apple (Coming Soon)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.socialButtonDisabled]}
                onPress={() => handleSocialLogin('Google')}
                disabled
              >
                <FontAwesome name="google" size={22} color={Colors.text.disabled} />
                <Text style={[styles.socialButtonText, styles.socialButtonTextDisabled]}>
                  Continue with Google (Coming Soon)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Terms and Privacy (Uber-style) */}
            <Text style={styles.terms}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.lg,
  },
  header: {
    marginTop: Theme.spacing.xxl,
    marginBottom: Theme.spacing.xl,
  },
  slogan: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.text.primary,
    letterSpacing: 2,
    marginBottom: Theme.spacing.sm,
  },
  tagline: {
    fontSize: Theme.fontSize.lg,
    color: Colors.text.secondary,
    fontWeight: Theme.fontWeight.medium,
  },
  methodSwitcher: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[100],
    borderRadius: Theme.borderRadius.xl,
    padding: 4,
    marginBottom: Theme.spacing.lg,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    gap: Theme.spacing.xs,
  },
  methodButtonActive: {
    backgroundColor: Colors.surface,
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  methodText: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.medium,
    color: Colors.text.tertiary,
  },
  methodTextActive: {
    color: Colors.primary[500],
    fontWeight: Theme.fontWeight.semibold,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.xl,
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: Theme.spacing.lg,
  },
  form: {
    gap: Theme.spacing.md,
  },
  inputLabel: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: -Theme.spacing.xs,
  },
  helperText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text.tertiary,
    marginTop: -Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: Theme.spacing.md,
    borderWidth: 2,
    borderColor: Colors.border.light,
    height: 56,
  },
  phoneInput: {
    flex: 1,
  },
  inputError: {
    borderColor: Colors.error[500],
    backgroundColor: Colors.error[50],
  },
  input: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
    fontSize: Theme.fontSize.md,
    color: Colors.text.inverse,
    fontWeight: Theme.fontWeight.medium,
  },
  fieldError: {
    color: Colors.error[600],
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.medium,
    marginTop: -Theme.spacing.xs,
  },
  primaryButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: Theme.borderRadius.lg,
    paddingVertical: Theme.spacing.md + 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.sm,
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 56,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: Colors.text.inverse,
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.bold,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    paddingVertical: Theme.spacing.sm,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.primary[500],
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semibold,
  },
  forgotPassword: {
    alignSelf: 'center',
    paddingVertical: Theme.spacing.sm,
  },
  forgotPasswordText: {
    color: Colors.primary[500],
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semibold,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error[50],
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Colors.error[200],
  },
  errorText: {
    flex: 1,
    color: Colors.error[700],
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.medium,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success[50],
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Colors.success[200],
  },
  successText: {
    flex: 1,
    color: Colors.success[700],
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.medium,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.light,
  },
  dividerText: {
    marginHorizontal: Theme.spacing.md,
    color: Colors.text.tertiary,
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.medium,
  },
  socialButtons: {
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg,
    paddingVertical: Theme.spacing.md + 2,
    borderWidth: 2,
    borderColor: Colors.border.medium,
    gap: Theme.spacing.md,
  },
  socialButtonDisabled: {
    opacity: 0.5,
    borderColor: Colors.border.light,
  },
  socialButtonText: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text.primary,
  },
  socialButtonTextDisabled: {
    color: Colors.text.disabled,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  signupText: {
    color: Colors.text.secondary,
    fontSize: Theme.fontSize.md,
  },
  signupLink: {
    color: Colors.primary[500],
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.bold,
  },
  terms: {
    textAlign: 'center',
    color: Colors.text.tertiary,
    fontSize: Theme.fontSize.xs,
    lineHeight: 18,
    paddingHorizontal: Theme.spacing.lg,
  },
  termsLink: {
    color: Colors.text.primary,
    fontWeight: Theme.fontWeight.semibold,
  },
});
