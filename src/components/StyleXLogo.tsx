import React from 'react';

interface StyleXLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  variant?: 'light' | 'dark';
}

export const StyleXLogo: React.FC<StyleXLogoProps> = ({
  size = 'md',
  className = ''
}) => {
  if (size === 'hero') {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <img
          src="/logo.png"
          alt="StyleX Signature Salon"
          className="w-48 sm:w-72 md:w-80 lg:w-96 max-w-[75vw] h-auto max-h-16 sm:max-h-28 md:max-h-32 object-contain drop-shadow-[0_6px_20px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-105"
          loading="eager"
        />
      </div>
    );
  }

  if (size === 'sm') {
    return (
      <div className={`flex items-center ${className}`}>
        <img
          src="/logo.png"
          alt="StyleX Signature Salon"
          className="h-6 sm:h-7 w-auto object-contain transition-transform hover:scale-105 duration-200"
          loading="eager"
        />
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`flex items-center ${className}`}>
        <img
          src="/logo.png"
          alt="StyleX Signature Salon"
          className="h-10 sm:h-12 w-auto object-contain transition-transform hover:scale-105 duration-200"
          loading="eager"
        />
      </div>
    );
  }

  // Default 'md'
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/logo.png"
        alt="StyleX Signature Salon"
        className="h-7 sm:h-8 md:h-9 w-auto object-contain transition-transform hover:scale-105 duration-200"
        loading="eager"
      />
    </div>
  );
};
