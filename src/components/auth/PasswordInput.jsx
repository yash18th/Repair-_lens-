import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({
  id,
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  autoComplete,
  required,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-medium text-[#A7B0BC]">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-lg border bg-[#0D1118] px-3.5 py-2.5 pr-10 text-xs text-[#F4F6F8] placeholder:text-[#687382] transition-colors focus:outline-none ${
            error ? 'border-[#B36262] focus:border-[#B36262]' : 'border-[#232B36] focus:border-[#7D91AA]'
          }`}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-[#687382] transition-colors hover:text-[#A7B0BC] cursor-pointer"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={0}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {error ? (
        <p className="text-xs text-[#B36262]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
