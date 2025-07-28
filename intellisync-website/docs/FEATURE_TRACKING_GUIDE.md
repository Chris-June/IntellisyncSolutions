# Feature Tracking Guide

This guide explains how to track feature usage across the application using the `useFeatureTracking` hook.

## Table of Contents

- [Introduction](#introduction)
- [Basic Usage](#basic-usage)
- [Tracking Feature Usage](#tracking-feature-usage)
- [Best Practices](#best-practices)
- [Example Implementations](#example-implementations)
- [Viewing the Data](#viewing-the-data)

## Introduction

The `useFeatureTracking` hook provides a simple way to track how users interact with different features in your application. This data helps us understand which features are most valuable to users and identify areas for improvement.

## Basic Usage

First, import the hook in your component:

```typescript
import { useFeatureTracking } from '../utils/analytics';
```

Then, use it in your component:

```typescript
function MyComponent() {
  const { trackFeatureUse } = useFeatureTracking();
  
  // Track when a feature is used
  const handleFeatureAction = () => {
    // Your feature logic here
    
    // Track the feature usage
    trackFeatureUse('feature_name', {
      // Additional properties (optional)
      action: 'button_click',
      value: 'some_value'
    });
  };
  
  return (
    <button onClick={handleFeatureAction}>
      Use Feature
    </button>
  );
}
```

## Tracking Feature Usage

### When to Track

Track feature usage when:

1. A user interacts with a significant UI element (buttons, toggles, etc.)
2. A feature is successfully used (after validation)
3. A user completes a multi-step process
4. A user encounters an error while using a feature

### What to Track

For each feature usage, track:

- A consistent, descriptive feature name
- The action performed (click, submit, toggle, etc.)
- Any relevant context (form data, selected options, etc.)
- Success/failure state if applicable

## Best Practices

1. **Be Consistent**: Use consistent naming conventions for features and actions
2. **Be Specific**: Include enough context to understand the user's action
3. **Don't Track Sensitive Data**: Avoid sending PII or sensitive information
4. **Group Related Actions**: Use the same feature name with different actions for related features
5. **Test in Development**: Verify tracking works in development before deploying

## Example Implementations

### Tracking a Button Click

```typescript
const { trackFeatureUse } = useFeatureTracking();

const handleDownload = (fileId: string) => {
  // Your download logic here
  
  trackFeatureUse('file_download', {
    file_id: fileId,
    file_type: 'pdf',
    location: 'documents_page'
  });
};
```

### Tracking a Form Submission

```typescript
const { trackFeatureUse } = useFeatureTracking();

const handleSubmit = async (formData: FormData) => {
  try {
    // Submit form
    await api.submitForm(formData);
    
    // Track successful submission
    trackFeatureUse('form_submission', {
      form_name: 'contact',
      field_count: Object.keys(formData).length,
      status: 'success'
    });
    
  } catch (error) {
    // Track failed submission
    trackFeatureUse('form_submission', {
      form_name: 'contact',
      status: 'error',
      error: error.message
    });
  }
};
```

### Tracking a Toggle Switch

```typescript
const { trackFeatureUse } = useFeatureTracking();

const handleToggle = (isEnabled: boolean) => {
  // Your toggle logic here
  
  trackFeatureUse('dark_mode_toggle', {
    enabled: isEnabled,
    location: 'settings_page'
  });
};
```

## Viewing the Data

Feature usage data can be viewed in your analytics dashboard under the "Events" section. Look for the `feature_used` event and filter by the feature name or properties.

### Example Queries

- Show most used features:
  ```
  event=feature_used | groupBy(feature) | count() | sort(-count)
  ```

- Show feature usage over time:
  ```
  event=feature_used | groupBy(day(timestamp)) | count() | sort(timestamp)
  ```

- Filter by specific feature:
  ```
  event=feature_used feature=dark_mode_toggle
  ```

## Troubleshooting

If events aren't appearing in your analytics:

1. Check the browser console for any errors
2. Verify the tracking code is being called (add a `console.log` before `trackEvent`)
3. Ensure you're in an environment where analytics is enabled
4. Check your ad blocker isn't blocking the analytics script
