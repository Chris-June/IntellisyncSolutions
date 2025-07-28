import React, { forwardRef } from 'react';
import { useTracking } from '../utils/analytics';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

type ButtonVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'default' | 'lg' | 'icon';

type BaseButtonProps = {
  /** The name of the button for tracking purposes */
  trackingName: string;
  /** The section where this button is located (e.g., 'Hero', 'Pricing') */
  trackingSection: string;
  /** Additional tracking properties */
  trackingProps?: Record<string, string | number | boolean | null>;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Show loading state */
  isLoading?: boolean;
  /** Optional icon to display before the button text */
  icon?: React.ReactNode;
  /** Optional icon to display after the button text */
  iconPosition?: 'left' | 'right';
  /** Additional class names */
  className?: string;
};

type ButtonAsButtonProps = BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> & {
    as?: 'button';
  };

type ButtonAsLinkProps = BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> & {
    as: 'a';
    href: string;
  };

type TrackedButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const buttonVariants = {
  default: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700',
  primary: 'bg-accent1 text-gray-900 hover:bg-accent1/90 font-semibold',
  secondary: 'bg-accent2 text-gray-900 hover:bg-accent2/90 font-semibold',
  outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800',
  ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
  link: 'text-accent1 hover:underline underline-offset-4',
};

const buttonSizes = {
  sm: 'h-9 px-3 text-sm',
  default: 'h-10 px-4 py-2',
  lg: 'h-11 px-8',
  icon: 'h-10 w-10',
};

export const TrackedButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, TrackedButtonProps>(
  ({
    as: Component = 'button',
    trackingName,
    trackingSection,
    trackingProps = {},
    variant = 'default',
    size = 'default',
    isLoading = false,
    icon,
    iconPosition = 'left',
    className = '',
    children,
    onClick,
    ...props
  }, ref) => {
    const { trackButtonClick } = useTracking();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      trackButtonClick(trackingName, trackingSection, {
        ...trackingProps,
        element: Component,
        variant,
        text: typeof children === 'string' ? children : '',
      });
      
      if (onClick) {
        onClick(e as any);
      }
    };

    const buttonClasses = cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:pointer-events-none',
      buttonVariants[variant],
      buttonSizes[size],
      className
    );

    const content = (
      <>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {!isLoading && icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </>
    );

    if (Component === 'a') {
      const { as, ...anchorProps } = props as ButtonAsLinkProps;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={buttonClasses}
          onClick={handleClick}
          {...anchorProps}
        >
          {content}
        </a>
      );
    }

    const { as, ...buttonProps } = props as ButtonAsButtonProps;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={buttonClasses}
        onClick={handleClick}
        disabled={isLoading}
        {...buttonProps}
      >
        {content}
      </button>
    );
  }
);

TrackedButton.displayName = 'TrackedButton';

// Example usage:
/*
// As a button
<TrackedButton 
  trackingName="Get Started"
  trackingSection="Hero"
  variant="primary"
  size="lg"
  trackingProps={{ variant: 'primary' }}
  onClick={handleClick}
  icon={<ArrowRight className="h-4 w-4" />}
  iconPosition="right"
>
  Get Started
</TrackedButton>

// As a link
<TrackedButton
  as="a"
  href="/pricing"
  trackingName="View Pricing"
  trackingSection="Hero"
  variant="outline"
>
  View Pricing
</TrackedButton>
*/
