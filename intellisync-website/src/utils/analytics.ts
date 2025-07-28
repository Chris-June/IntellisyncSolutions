import { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type EventProperties = Record<string, string | number | boolean | null>;

type NavigationEvent = {
  from: string;
  to: string;
  referrer?: string;
  timestamp: number;
  searchParams?: Record<string, string>;
};

// Extend the Window interface to include Vercel Analytics
declare global {
  interface Window {
    va?: (event: 'beforeSend' | 'event' | 'pageview', properties?: unknown) => void;
  }
}

// Type-safe wrapper for Vercel Analytics
type VercelAnalytics = {
  track: (eventName: string, properties?: Record<string, any>) => void;
  page: (params: { name: string; url: string; title: string }) => void;
};

// Safely access the Vercel Analytics instance
const getAnalytics = (): VercelAnalytics | null => {
  if (typeof window === 'undefined' || !window.va) {
    return null;
  }
  
  return {
    track: (eventName, properties) => {
      window.va?.('event', {
        action: eventName,
        ...properties
      });
    },
    page: (params) => {
      window.va?.('pageview', {
        page_title: params.title,
        page_url: params.url,
        page_name: params.name
      });
    }
  };
};

// Helper function to safely track events
const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
  const analytics = getAnalytics();
  if (analytics) {
    analytics.track(eventName, properties);
  } else if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(`[Analytics] ${eventName}`, properties);
  }
};

/**
 * Hook to track user navigation and page views
 */
const useNavigationTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Track page view when location changes
  useEffect(() => {
    const pageTitle = document.title || 'Untitled Page';
    const url = `${window.location.pathname}${window.location.search}`;
    
    trackEvent('page_view', {
      page_title: pageTitle,
      page_url: url,
      page_path: window.location.pathname,
      page_search: window.location.search,
      page_hash: window.location.hash,
      referrer: document.referrer || 'direct',
    });

    // Send to Vercel Analytics
    const analytics = getAnalytics();
    if (analytics) {
      analytics.page({
        name: pageTitle,
        url: window.location.href,
        title: pageTitle,
      });
    }
  }, [location]);

  /**
   * Track a custom navigation event
   */
  const trackNavigation = useCallback((event: Omit<NavigationEvent, 'timestamp'>) => {
    const navigationEvent: NavigationEvent = {
      ...event,
      timestamp: Date.now(),
    };

    trackEvent('navigation', navigationEvent);
  }, []);

  /**
   * Wrapper around navigate that tracks the navigation
   */
  const trackAndNavigate = useCallback((
    to: string,
    options?: { replace?: boolean; state?: any },
    eventProps?: Omit<NavigationEvent, 'to' | 'timestamp'>
  ) => {
    trackNavigation({
      from: window.location.pathname,
      to,
      referrer: document.referrer,
      searchParams: Object.fromEntries(new URLSearchParams(window.location.search)),
      ...eventProps,
    });

    navigate(to, options);
  }, [navigate, trackNavigation]);

  return {
    trackNavigation,
    trackAndNavigate,
  };
};

/**
 * Hook to track user interactions and events
 */
const useTracking = () => {
  // Track button clicks on important CTAs
  const trackButtonClick = (buttonName: string, section: string, additionalProps: EventProperties = {}) => {
    trackEvent('Button Clicked', {
      buttonName,
      section,
      ...additionalProps,
      eventType: 'ui_interaction'
    });
  };

  // Track form submissions
  const trackFormSubmission = (formName: string, status: 'success' | 'error', additionalProps: EventProperties = {}) => {
    trackEvent('Form Submitted', {
      formName,
      status,
      ...additionalProps,
      eventType: 'form_submission'
    });
  };

  // Track navigation events
  const trackNavigation = (from: string, to: string, linkType: 'internal' | 'external' | 'tab') => {
    trackEvent('Navigation', {
      from,
      to,
      linkType,
      eventType: 'navigation'
    });
  };

  // Track feature usage
  const trackFeatureUsage = (featureName: string, action: string, additionalProps: EventProperties = {}) => {
    trackEvent('Feature Used', {
      featureName,
      action,
      ...additionalProps,
      eventType: 'feature_usage'
    });
  };

  // Track conversion events
  const trackConversion = (conversionName: string, value?: number, additionalProps: EventProperties = {}) => {
    trackEvent('Conversion', {
      conversionName,
      value,
      ...additionalProps,
      eventType: 'conversion'
    });
  };

  return {
    trackButtonClick,
    trackFormSubmission,
    trackNavigation,
    trackFeatureUsage,
    trackConversion
  };
};

// Helper component to track page views
const TrackPageView = ({ name }: { name: string }) => {
  useEffect(() => {
    const analytics = getAnalytics();
    if (analytics) {
      analytics.page({
        name,
        url: window.location.pathname,
        title: document.title
      });
    } else if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] Page View: ${name}`, {
        url: window.location.pathname,
        title: document.title
      });
    }
  }, [name]);

  return null;
};

/**
 * Hook to track feature usage across the application
 * @returns Object with trackFeatureUse function
 */
const useFeatureTracking = () => {
  /**
   * Track when a user interacts with a feature
   * @param featureName - The name of the feature being used
   * @param properties - Additional properties to track with the event
   */
  const trackFeatureUse = useCallback((
    featureName: string, 
    properties: EventProperties = {}
  ) => {
    trackEvent('feature_used', {
      feature: featureName,
      ...properties,
      timestamp: Date.now(),
      url: window.location.pathname,
    });
  }, []);

  return { trackFeatureUse };
};

/**
 * Hook to track conversion events (signups, purchases, etc.)
 * @returns Object with trackConversion function
 */
const useConversionTracking = () => {
  /**
   * Track a conversion event
   * @param conversionName - The name of the conversion event (e.g., 'signup', 'purchase')
   * @param value - The monetary value of the conversion (if applicable)
   * @param properties - Additional properties to track with the conversion
   */
  const trackConversion = useCallback((
    conversionName: string,
    value?: number,
    properties: EventProperties = {}
  ) => {
    const conversionEvent = {
      conversion_type: conversionName,
      value,
      currency: 'CAD', // Default currency, can be overridden in properties
      ...properties,
      timestamp: Date.now(),
      url: window.location.pathname,
      referrer: document.referrer || 'direct',
    };

    // Track as a conversion event
    trackEvent('conversion', conversionEvent);

    // Also track as a goal completion if value is provided
    if (value !== undefined) {
      trackEvent('goal_completed', {
        goal: conversionName,
        value,
        ...properties
      });
    }
  }, []);

  return { trackConversion };
};

export {
  useTracking,
  useNavigationTracking,
  useFeatureTracking,
  useConversionTracking,
  TrackPageView,
  trackEvent,
  getAnalytics,
  type EventProperties,
  type NavigationEvent,
  type VercelAnalytics
};
