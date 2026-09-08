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
      <label htmlFor={id} className="block text-xs font-medium text-[#A7B0BD]">
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
          className={`w-full rounded-lg border bg-[#0C1015] px-3.5 py-2.5 pr-10 text-xs text-[#F5F7FA] placeholder:text-[#596473] transition-colors focus:outline-none ${
            error ? 'border-[#A65D5D] focus:border-[#A65D5D]' : 'border-[#202731] focus:border-[#8294AA]'
          }`}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-[#667180] transition-colors hover:text-[#A7B0BD]"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={0}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {error ? (
        <p className="text-xs text-[#A65D5D]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
