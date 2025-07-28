import React, { FormEvent } from 'react';
import { useTracking } from '../utils/analytics';

type TrackedFormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  formName: string;
  onTrackedSubmit?: (e: FormEvent<HTMLFormElement>) => Promise<boolean | void> | boolean | void;
  trackingProps?: Record<string, string | number | boolean | null>;
  children: React.ReactNode;
};

export const TrackedForm: React.FC<TrackedFormProps> = ({
  formName,
  onSubmit,
  onTrackedSubmit,
  trackingProps = {},
  children,
  ...props
}) => {
  const { trackFormSubmission } = useTracking();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      let submitResult = true;
      
      // Call the original onSubmit if it exists
      if (onSubmit) {
        const result = onSubmit(e);
        if (result !== undefined && result !== null && typeof result === 'object' && 'then' in result) {
          const promiseResult = await result as boolean | void;
          submitResult = promiseResult === undefined ? true : promiseResult;
        } else if (typeof result === 'boolean') {
          submitResult = result;
        }
      }
      
      // Call the tracked submit handler if provided
      if (onTrackedSubmit) {
        const result = onTrackedSubmit(e);
        if (result !== undefined && result !== null && typeof result === 'object' && 'then' in result) {
          const promiseResult = await result as boolean | void;
          const resolvedResult = promiseResult === undefined ? true : promiseResult;
          submitResult = submitResult && resolvedResult;
        } else if (typeof result === 'boolean') {
          submitResult = submitResult && result;
        }
      }
      
      // Track successful form submission
      const formData: Record<string, string | null> = {};
      const formDataEntries = new FormData(e.currentTarget).entries();
      
      for (const [key, value] of formDataEntries) {
        formData[key] = typeof value === 'string' 
          ? (key.toLowerCase().includes('password') ? '***' : value)
          : null;
      }
      
      trackFormSubmission(formName, 'success', {
        ...trackingProps,
        formFields: JSON.stringify(formData) // Convert to string to satisfy type
      });
      
      return submitResult;
    } catch (error) {
      // Track failed form submission
      trackFormSubmission(formName, 'error', {
        ...trackingProps,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  };

  return (
    <form {...props} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};

// Example usage:
/*
<TrackedForm 
  formName="Contact Form"
  onTrackedSubmit={async (e) => {
    // Your form submission logic here
    return true; // Return true for success, false for failure
  }}
  trackingProps={{ location: 'contact-page' }}
>
  <input name="name" />
  <input name="email" type="email" />
  <button type="submit">Submit</button>
</TrackedForm>
*/
