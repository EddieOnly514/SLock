/**
 * Analytics Service Stub
 * Placeholder for analytics tracking - replace with actual implementation when ready
 */

// Event tracking - logs events for debugging in dev mode
export const trackAuthEvent = (event: string, data?: Record<string, any>) => {
    if (__DEV__) {
        console.log('[Analytics] Auth Event:', event, data || '');
    }
};

// Error tracking
export const trackAuthError = (
    method: 'phone' | 'email',
    errorType: string,
    error?: Error
) => {
    if (__DEV__) {
        console.log('[Analytics] Auth Error:', { method, errorType, error: error?.message });
    }
};

// Success tracking
export const trackAuthSuccess = (method: 'phone' | 'email', startTime: number) => {
    const duration = Date.now() - startTime;
    if (__DEV__) {
        console.log('[Analytics] Auth Success:', { method, duration_ms: duration });
    }
};

// Generic event tracking
export const trackEvent = (event: string, properties?: Record<string, any>) => {
    if (__DEV__) {
        console.log('[Analytics] Event:', event, properties || '');
    }
};

// Screen tracking
export const trackScreen = (screenName: string, properties?: Record<string, any>) => {
    if (__DEV__) {
        console.log('[Analytics] Screen:', screenName, properties || '');
    }
};

export default {
    trackAuthEvent,
    trackAuthError,
    trackAuthSuccess,
    trackEvent,
    trackScreen,
};
