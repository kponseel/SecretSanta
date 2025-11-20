import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className,
  children, 
  ...props 
}) => {
  const base = "inline-flex items-center justify-center font-bold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    primary: "bg-red-700 text-white hover:bg-red-800 focus:ring-red-600 shadow-md hover:shadow-lg border border-transparent",
    secondary: "bg-emerald-800 text-white hover:bg-emerald-900 focus:ring-emerald-600 shadow-md",
    outline: "border-2 border-red-200 text-red-800 bg-white hover:bg-red-50 focus:ring-red-500 hover:border-red-300",
    ghost: "text-red-700 hover:bg-red-50 hover:text-red-900",
    gold: "bg-amber-400 text-amber-950 hover:bg-amber-500 focus:ring-amber-400 shadow-md",
  };

  const sizes = {
    sm: "text-xs px-3 py-2",
    md: "text-sm px-5 py-2.5", // Slightly larger for easier tapping
    lg: "text-base px-6 py-4",
  };

  return (
    <button 
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};