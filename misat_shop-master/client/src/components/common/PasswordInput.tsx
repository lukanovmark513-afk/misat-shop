import React, { useState } from 'react';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = 'Введите пароль',
  className = '',
  label,
  error
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="text-gray-400 text-[10px] font-medium mb-1.5 block">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2.5 bg-black/30 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white text-sm placeholder:text-gray-500 focus:border-white/30 focus:outline-none ${className}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
        >
          {showPassword ? (
            <i className="fas fa-eye-slash text-xs"></i>
          ) : (
            <i className="fas fa-eye text-xs"></i>
          )}
        </button>
      </div>
      {error && (
        <p className="text-red-400 text-[9px] mt-1">{error}</p>
      )}
    </div>
  );
};

export default PasswordInput;