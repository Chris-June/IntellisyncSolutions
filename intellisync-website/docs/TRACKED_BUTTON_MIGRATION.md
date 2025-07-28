# TrackedButton Migration Guide

This guide provides instructions for migrating existing buttons to the new `TrackedButton` component for consistent analytics tracking across the application.

## Why Use TrackedButton?

The `TrackedButton` component provides:
- Automatic click event tracking
- Consistent analytics across the application
- Support for different button variants and sizes
- Built-in loading states and icons
- TypeScript support

## Installation

The `TrackedButton` component is already installed and available at `src/components/TrackedButton.tsx`.

## Basic Usage

### Import

```typescript
import { TrackedButton } from '../components/TrackedButton';
```

### Basic Button

```typescript
<TrackedButton
  trackingName="Button Click"
  trackingSection="ComponentName"
  onClick={handleClick}
>
  Click Me
</TrackedButton>
```

### Button with Additional Tracking Properties

```typescript
<TrackedButton
  trackingName="Sign Up"
  trackingSection="Hero"
  trackingProps={{
    variant: 'primary',
    location: 'above_fold',
    test_variant: 'A'
  }}
  onClick={handleSignUp}
>
  Sign Up Now
</TrackedButton>
```

## Button Variants

### Available Variants

- `default` - Standard button
- `primary` - Primary action button
- `secondary` - Secondary action button
- `outline` - Outlined button
- `ghost` - Minimal button
- `link` - Text link styled as a button

### Example

```typescript
<TrackedButton
  variant="primary"
  trackingName="Get Started"
  trackingSection="Pricing"
>
  Get Started
</TrackedButton>
```

## Sizes

### Available Sizes

- `sm` - Small button
- `default` - Default size
- `lg` - Large button
- `icon` - Square icon button

### Example

```typescript
<TrackedButton
  size="lg"
  trackingName="Contact Sales"
  trackingSection="Footer"
>
  Contact Sales
</TrackedButton>
```

## Icons

### Adding Icons

Use the `icon` prop to add an icon to your button. You can control the icon position with `iconPosition` (default: `left`).

```typescript
import { Mail, ArrowRight } from 'lucide-react';

// Icon on the left (default)
<TrackedButton
  icon={<Mail className="w-4 h-4" />}
  trackingName="Contact Us"
  trackingSection="Header"
>
  Contact Us
</TrackedButton>

// Icon on the right
<TrackedButton
  icon={<ArrowRight className="w-4 h-4" />}
  iconPosition="right"
  trackingName="Learn More"
  trackingSection="Features"
>
  Learn More
</TrackedButton>
```

## Loading States

Use the `isLoading` prop to show a loading spinner and disable the button.

```typescript
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await submitForm();
  } finally {
    setIsLoading(false);
  }
};

<TrackedButton
  isLoading={isLoading}
  trackingName="Submit Form"
  trackingSection="ContactForm"
  onClick={handleSubmit}
>
  Submit
</TrackedButton>
```

## Link Buttons

Use the `as` prop to render the button as a link.

```typescript
<TrackedButton
  as="a"
  href="/pricing"
  trackingName="View Pricing"
  trackingSection="Hero"
  variant="outline"
>
  View Pricing
</TrackedButton>
```

## Migration Checklist

1. Replace all `<button>` elements with `TrackedButton`
2. Add appropriate `trackingName` and `trackingSection` props
3. Map existing button variants to the new variant system
4. Update any custom button components to extend `TrackedButton`
5. Test all button interactions to ensure tracking works as expected

## Best Practices

1. **Be specific with tracking names**: Use clear, descriptive names that indicate the button's purpose
2. **Group related buttons**: Use consistent `trackingSection` values for related buttons
3. **Use tracking props for additional context**: Add metadata like `variant`, `location`, or `test_group` to track different button variations
4. **Keep tracking names consistent**: Use consistent naming conventions (e.g., "Get Started" vs "Get started")
5. **Test tracking**: Verify that events appear in your analytics dashboard with the expected properties

## Example Migration

### Before

```typescript
<button 
  className="bg-blue-500 text-white px-4 py-2 rounded"
  onClick={handleClick}
>
  Click Me
</button>
```

### After

```typescript
<TrackedButton
  trackingName="Click Me"
  trackingSection="ExampleComponent"
  variant="primary"
  onClick={handleClick}
>
  Click Me
</TrackedButton>
```
