'use client';

import { cn } from '@/lib/utils';
import React from 'react';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'ripple' | 'company';
  color?: 'primary' | 'secondary' | 'accent' | 'white';
  className?: string;
  text?: string;
  showText?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colorClasses = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  accent: 'text-purple-600',
  white: 'text-white',
};

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  className,
  text = 'Loading...',
  showText = false,
}) => {
  const renderSpinner = () => (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size]
      )}
    />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full animate-bounce',
            sizeClasses[size],
            colorClasses[color]
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={cn(
        'rounded-full animate-pulse bg-current',
        sizeClasses[size],
        colorClasses[color]
      )}
    />
  );

  const renderBars = () => (
    <div className="flex space-x-1">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse bg-current rounded',
            sizeClasses[size],
            colorClasses[color]
          )}
          style={{
            width: '4px',
            height:
              size === 'sm'
                ? '16px'
                : size === 'md'
                ? '24px'
                : size === 'lg'
                ? '32px'
                : '48px',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );

  const renderRipple = () => (
    <div className="relative">
      <div
        className={cn(
          'absolute rounded-full border-2 border-current animate-ping',
          sizeClasses[size],
          colorClasses[color]
        )}
      />
      <div
        className={cn(
          'rounded-full border-2 border-current',
          sizeClasses[size],
          colorClasses[color]
        )}
      />
    </div>
  );

  const renderCompany = () => (
    <div className="relative">
      {/* Company logo placeholder with loading effect */}
      <div className={cn('relative', sizeClasses[size])}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent animate-pulse opacity-20" />
        <div
          className={cn(
            'w-full h-full rounded-lg bg-current opacity-10',
            colorClasses[color]
          )}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              'w-1/2 h-1/2 bg-current rounded',
              colorClasses[color]
            )}
          />
        </div>
      </div>
      {/* Animated border */}
      <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-current to-transparent animate-spin rounded-lg opacity-30" />
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return renderSpinner();
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'bars':
        return renderBars();
      case 'ripple':
        return renderRipple();
      case 'company':
        return renderCompany();
      default:
        return renderSpinner();
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center space-y-3',
        className
      )}
    >
      <div
        className={cn('flex items-center justify-center', colorClasses[color])}
      >
        {renderLoader()}
      </div>
      {showText && (
        <p
          className={cn(
            'text-sm font-medium animate-pulse',
            colorClasses[color]
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
};

// Convenience components for common use cases
export const Spinner: React.FC<Omit<LoaderProps, 'variant'>> = (props) => (
  <Loader variant="spinner" {...props} />
);

export const DotsLoader: React.FC<Omit<LoaderProps, 'variant'>> = (props) => (
  <Loader variant="dots" {...props} />
);

export const PulseLoader: React.FC<Omit<LoaderProps, 'variant'>> = (props) => (
  <Loader variant="pulse" {...props} />
);

export const BarsLoader: React.FC<Omit<LoaderProps, 'variant'>> = (props) => (
  <Loader variant="bars" {...props} />
);

export const RippleLoader: React.FC<Omit<LoaderProps, 'variant'>> = (props) => (
  <Loader variant="ripple" {...props} />
);

export const CompanyLoader: React.FC<Omit<LoaderProps, 'variant'>> = (
  props
) => <Loader variant="company" {...props} />;

// Full-screen loader component
export const FullScreenLoader: React.FC<LoaderProps> = (props) => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-40">
    <Loader {...props} size="xl" showText={true} />
  </div>
);

// Inline loader for buttons and small spaces
export const InlineLoader: React.FC<LoaderProps> = (props) => (
  <Loader {...props} size="sm" showText={false} />
);

export default Loader;
