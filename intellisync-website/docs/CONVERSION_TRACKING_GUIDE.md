# Conversion Tracking Guide

This guide explains how to track conversion events across the application using the `useConversionTracking` hook.

## Table of Contents

- [Introduction](#introduction)
- [Basic Usage](#basic-usage)
- [Tracking Conversions](#tracking-conversions)
- [Best Practices](#best-practices)
- [Example Implementations](#example-implementations)
- [Viewing Conversion Data](#viewing-conversion-data)

## Introduction

Conversion tracking helps measure the effectiveness of your application by tracking when users complete important actions that contribute to your business goals, such as signing up, making a purchase, or requesting a demo.

## Basic Usage

First, import the hook in your component:

```typescript
import { useConversionTracking } from '../utils/analytics';
```

Then, use it in your component:

```typescript
function SignupForm() {
  const { trackConversion } = useConversionTracking();
  
  const handleSignup = async (userData) => {
    try {
      // Your signup logic here
      await api.signup(userData);
      
      // Track the conversion
      trackConversion('signup', 0, {
        plan: 'free_trial',
        method: 'email',
        location: 'homepage'
      });
      
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <form onSubmit={handleSignup}>
      {/* Form fields */}
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

## Tracking Conversions

### When to Track

Track conversions when a user completes any of these key actions:

1. **Sign-ups** (free trials, account creation)
2. **Purchases** (one-time or subscription)
3. **Lead generation** (contact form submissions, demo requests)
4. **Content downloads** (whitepapers, ebooks, etc.)
5. **Feature adoption** (key feature usage after signup)

### What to Track

For each conversion, track:

- A consistent, descriptive conversion name
- The monetary value (if applicable)
- Relevant metadata (plan type, location, etc.)
- Any segmentation data for analysis

## Best Practices

1. **Be Consistent**: Use consistent naming for conversion events
2. **Include Value**: Always include the monetary value when applicable
3. **Add Context**: Include relevant metadata for segmentation
4. **Track Failures**: Track both successful and failed conversion attempts
5. **Test Thoroughly**: Verify tracking in development before deploying

## Example Implementations

### Tracking a Purchase

```typescript
const { trackConversion } = useConversionTracking();

const handlePurchase = async (productId: string, price: number) => {
  try {
    // Process purchase
    await api.completePurchase(productId);
    
    // Track the purchase
    trackConversion('purchase', price, {
      product_id: productId,
      currency: 'USD',
      payment_method: 'credit_card',
      items: [
        { id: productId, quantity: 1, price }
      ]
    });
    
  } catch (error) {
    // Track failed purchase attempt
    trackConversion('purchase_failed', 0, {
      product_id: productId,
      error: error.message,
      step: 'payment_processing'
    });
  }
};
```

### Tracking a Free Trial Signup

```typescript
const { trackConversion } = useConversionTracking();

const startFreeTrial = async (plan: string) => {
  try {
    // Start trial logic
    await api.startTrial(plan);
    
    // Track trial signup
    trackConversion('trial_signup', 0, {
      plan,
      trial_days: 14,
      source: 'pricing_page',
      // Include UTM parameters if available
      ...getUTMParams()
    });
    
  } catch (error) {
    // Track failed signup
    trackConversion('trial_signup_failed', 0, {
      plan,
      error: error.message,
      step: 'account_creation'
    });
  }
};
```

### Tracking a Demo Request

```typescript
const { trackConversion } = useConversionTracking();

const requestDemo = async (formData: DemoFormData) => {
  try {
    // Submit demo request
    await api.requestDemo(formData);
    
    // Track demo request
    trackConversion('demo_requested', 0, {
      company_size: formData.companySize,
      use_case: formData.useCase,
      role: formData.role,
      // Include marketing attribution
      ...getAttributionData()
    });
    
  } catch (error) {
    // Track failed demo request
    trackConversion('demo_request_failed', 0, {
      error: error.message,
      form_data: {
        company_size: formData.companySize,
        use_case: formData.useCase,
        role: formData.role
      }
    });
  }
};
```

## Viewing Conversion Data

Conversion data can be viewed in your analytics dashboard under the "Conversions" or "Goals" section. Look for the `conversion` and `goal_completed` events.

### Example Queries

- Show conversion rates:
  ```
  event=conversion | groupBy(conversion_type) | count() | sort(-count)
  ```

- Calculate total revenue by product:
  ```
  event=conversion conversion_type=purchase | groupBy(product_id) | sum(value) | sort(-sum)
  ```

- Track conversion funnels:
  ```
  event=page_view,conversion | groupBy(session_id) | funnel()
  ```

## Troubleshooting

If conversions aren't being tracked:

1. Verify the tracking code is being called (add `console.log` before `trackEvent`)
2. Check for JavaScript errors in the browser console
3. Ensure the event properties match your tracking plan
4. Verify your ad blocker isn't blocking the analytics script
5. Check network requests to confirm events are being sent
