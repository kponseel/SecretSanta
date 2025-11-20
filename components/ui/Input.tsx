import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({ label, containerClassName, className, ...props }) => {
  return (
    <div className={`flex flex-col ${containerClassName || ''}`}>
      {label && <label className="text-sm font-bold text-slate-700 mb-1.5">{label}</label>}
      <input
        className={`border border-slate-300 bg-white text-slate-900 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all placeholder:text-slate-400 shadow-sm ${className || ''}`}
        {...props}
      />
    </div>
  );
};

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }> = ({ label, className, ...props }) => {
  return (
    <div className="flex flex-col">
      {label && <label className="text-sm font-bold text-slate-700 mb-1.5">{label}</label>}
      <textarea
        className={`border border-slate-300 bg-white text-slate-900 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all placeholder:text-slate-400 shadow-sm ${className || ''}`}
        {...props}
      />
    </div>
  );
};