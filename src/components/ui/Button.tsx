import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        // Variants
        {
          'bg-aspen-amber text-white hover:bg-aspen-copper focus:ring-aspen-copper shadow-md hover:shadow-lg':
            variant === 'primary',
          'bg-aspen-forest text-white hover:bg-aspen-pine focus:ring-aspen-forest shadow-md hover:shadow-lg':
            variant === 'secondary',
          'border-2 border-aspen-amber text-aspen-amber hover:bg-aspen-amber hover:text-white focus:ring-aspen-copper':
            variant === 'outline',
          'text-aspen-pine hover:bg-aspen-cream focus:ring-aspen-stone':
            variant === 'ghost',
        },
        // Sizes
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-5 py-2.5 text-base': size === 'md',
          'px-7 py-3.5 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
