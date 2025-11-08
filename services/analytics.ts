/**
 * Analytics & Telemetry Service
 * Following enterprise auth guide event tracking requirements
 */

export type AuthEvent =
  | 'auth_view'
  | 'tap_sso_apple'
  | 'tap_sso_google'
  | 'tap_sso_facebook'
  | 'auth_success'
  | 'auth_error'
  | 'reset_start'
  | 'reset_success'
  | 'refresh_success'
  | 'refresh_fail'
  | 'tap_phone_login'
  | 'tap_email_login'
  | 'tap_magic_link'
  | 'otp_sent'
  | 'otp_verified'
  | 'password_reveal'
  | 'country_code_changed'
  | 'captcha_shown'
  | 'captcha_solved'
  | 'logout';

export type AuthErrorReason =
  | 'invalid_credentials'
  | 'network_error'
  | 'rate_limited'
  | 'captcha_required'
  | 'email_not_verified'
  | 'account_locked'
  | 'invalid_otp'
  | 'otp_expired'
  | 'refresh_failed'
  | 'reuse_detected'
  | 'device_mismatch'
  | 'unknown';

interface EventMetadata {
  provider?: 'phone' | 'email' | 'apple' | 'google' | 'facebook' | 'magic_link';
  reason?: AuthErrorReason;
  duration_ms?: number;
  device_id?: string;
  step?: string;
  [key: string]: any;
}

/**
 * Track auth event
 */
export function trackAuthEvent(
  event: AuthEvent,
  metadata?: EventMetadata
): void {
  const timestamp = new Date().toISOString();
  const eventData = {
    event,
    timestamp,
    ...metadata,
  };

  // Log to console in development
  if (__DEV__) {
    console.log('📊 [Analytics]', event, metadata);
  }

  // TODO: In production, send to your analytics service
  // Examples: Mixpanel, Amplitude, Firebase Analytics, PostHog, etc.
  //
  // Example implementation:
  // if (Platform.OS === 'ios' || Platform.OS === 'android') {
  //   Analytics.logEvent(event, metadata);
  // }

  // For now, we'll just log it
  // You can implement your analytics provider here
}

/**
 * Track metric (for aggregation)
 */
export function trackAuthMetric(
  metric: string,
  value: number,
  metadata?: EventMetadata
): void {
  const timestamp = new Date().toISOString();
  const metricData = {
    metric,
    value,
    timestamp,
    ...metadata,
  };

  if (__DEV__) {
    console.log('📈 [Metric]', metric, value, metadata);
  }

  // TODO: Send to analytics service
}

/**
 * Track auth success with timing
 */
export function trackAuthSuccess(
  provider: EventMetadata['provider'],
  startTime: number
): void {
  const duration = Date.now() - startTime;
  trackAuthEvent('auth_success', { provider, duration_ms: duration });
  trackAuthMetric('auth_duration_ms', duration, { provider });
}

/**
 * Track auth error with reason
 */
export function trackAuthError(
  provider: EventMetadata['provider'],
  reason: AuthErrorReason,
  error?: Error
): void {
  trackAuthEvent('auth_error', {
    provider,
    reason,
    error_message: error?.message,
  });
}

/**
 * Track refresh token events
 */
export function trackRefreshSuccess(duration: number): void {
  trackAuthEvent('refresh_success', { duration_ms: duration });
  trackAuthMetric('refresh_duration_ms', duration);
}

export function trackRefreshFail(reason: AuthErrorReason): void {
  trackAuthEvent('refresh_fail', { reason });
}

/**
 * Track password reset flow
 */
export function trackResetStart(method: 'email' | 'sms'): void {
  trackAuthEvent('reset_start', { method });
}

export function trackResetSuccess(method: 'email' | 'sms'): void {
  trackAuthEvent('reset_success', { method });
}

/**
 * Track OTP flow
 */
export function trackOTPSent(phone: string): void {
  trackAuthEvent('otp_sent', {
    phone_masked: phone.replace(/\d(?=\d{4})/g, '*'),
  });
}

export function trackOTPVerified(duration: number): void {
  trackAuthEvent('otp_verified', { duration_ms: duration });
}

/**
 * Track captcha events
 */
export function trackCaptchaShown(reason: 'velocity' | 'geo' | 'device'): void {
  trackAuthEvent('captcha_shown', { reason });
}

export function trackCaptchaSolved(duration: number): void {
  trackAuthEvent('captcha_solved', { duration_ms: duration });
}

/**
 * Calculate success rate (call periodically or on app open)
 */
export function calculateSuccessRate(): {
  overall: number;
  byProvider: Record<string, number>;
} {
  // TODO: Implement actual calculation from stored events
  // For now, return mock data
  return {
    overall: 0.95,
    byProvider: {
      email: 0.97,
      phone: 0.93,
      apple: 0.98,
      google: 0.96,
    },
  };
}

export default {
  trackAuthEvent,
  trackAuthMetric,
  trackAuthSuccess,
  trackAuthError,
  trackRefreshSuccess,
  trackRefreshFail,
  trackResetStart,
  trackResetSuccess,
  trackOTPSent,
  trackOTPVerified,
  trackCaptchaShown,
  trackCaptchaSolved,
  calculateSuccessRate,
};
